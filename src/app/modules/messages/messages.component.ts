import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { LoaderService } from './../../_services/loader.service'
import Echo from 'laravel-echo'
import { Component, OnInit, Input, Output, EventEmitter , Inject,Optional} from '@angular/core';
import { PusherService } from './../../_services/pusher.service'
import { MessageService } from './../../_services/message.service'
import { environment } from '../../../environments/environment'
import { MessagesService } from './messages.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment'
import * as MobileDetect from 'mobile-detect'
import { NotificationService } from '../../_services/notification.service'
import { Router } from '@angular/router'
import { Title } from '@angular/platform-browser'
import * as _ from 'lodash'

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  inboxData: any = []
  followingsList: any = []
  data: any
  @Output() onSelectUser = new EventEmitter<boolean>()
  hideinbox = {}
  currentPage: number = 1
  showNewChat: boolean = false
  index: number = 0
  channelName: string
  channel: any
  mobile: boolean = false
  mobileview: boolean = false
  selectedId: number=0
  public onlineFlag = navigator.onLine


  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private messagesService: MessagesService,
    private modalService: NgbModal,
    private pusherService: PusherService,
    private notificationService: NotificationService,
    private router: Router,
    private loaderService: LoaderService,
    private titleService: Title
  ) {}

  ngOnInit() {
    let authUser = this.localStorage.getItem('currentUser');
    this.loaderService.display();
    //this.notificationService.receiveMessage()
    this.notificationService.currentMessage.subscribe(data => {
      //do what ever needs doing when data changes

      if (data) {
        if (data.data.type == 'message') {
          let presenceCheck = this.pusherService.pusher.channel(
            'presence-inbox.' + data.data.type_id
          )
          ////console.log(presenceCheck)
          if (typeof presenceCheck === 'undefined') {
            this.loadInboxData()
            this.addPusherSubscribe(data.data.type_id)
          }
        }
      }
    })

    this.titleService.setTitle('Messages | Shoot The Frame')
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true
    }
    if (authUser) {
      this.loadInboxData();
    } else {
      this.router.navigate(['/sign-in']);
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    for (let i = 0; i < this.inboxData.length; ++i) {
      var channel = 'presence-inbox.' + this.inboxData[i].id
      this.pusherService.pusher.unsubscribe(channel)
    }
  }

  pageChanged() {
    this.currentPage = this.currentPage + 1
    this.loadInboxData()
  }

  updateInboxData() {
    this.mobileview = false
    // this.inboxData.inbox_list.data[data.index].recent_message = data.message
  }

  loadInboxData() {
    let data = {
      perPage: 100,
      page: this.currentPage
    }
    this.messagesService.loadInbox(data).subscribe((response: any) => {
      this.loaderService.hide()
      //this.inboxData = this.inboxData.concat(response.inbox_list.data)
      let chat = response.inbox_list.data


      for (let i = 0; i < chat.length; ++i) {
        chat[i].recent_message= chat[i] && chat[i].recent_message ? chat[i].recent_message.replace(/(<([^>]+)>)/ig,"") : '';
        this.addPusherSubscribe(chat[i].id)

        // this.inboxData.push(chat[i])
      }
      this.inboxData = chat
      // this.data = response.inbox_list.data[0]
    })
  }

  addPusherSubscribe(id) {
    this.channelName = 'presence-inbox.' + id
    this.pusherService.pusher.connection.bind('connected', function(data) {
      this.socketId = data.socket_id
      let params = {
        channel_name: this.channelName,
        socket_id: this.socketId
      }
    })

    this.channel = this.pusherService.pusher.subscribe(this.channelName)

    this.channel.bind('pusher:subscription_succeeded', function() {
      ////console.log('success')
    })

    this.channel.bind('pusher:subscription_error', function(status) {
      ////console.log(status)
    })

    this.channel.bind('messagesent', data => {
      //this.loadInboxData()
    })
  }

  deleteInbox(item, content) {
    this.modalService.open(content).result.then(
      result => {
        let data = { inbox_id: item.id }
        this.messagesService.deleteInbox(data).subscribe((response: any) => {
          this.hideinbox[item.id] = false
          this.data = ''
        })
      },
      reason => {}
    )
  }

  selectUser(item, i) {
    this.mobileview = true
    this.data = item
    this.selectedId = item.id
    this.index = i
    let params = { inbox_id: item.id }
    this.messagesService.readInbox(params).subscribe((response: any) => {
      item.unreadCount = response.read_count
    })
  }

  selectNewUser(item) {
    this.mobileview = true

    this.showNewChat = false
    this.data = { other_user_id: item.to_user_id, first_name: item.name }
    this.data.userDetails = { first_name: item.name }
    this.createThread(item.to_user_id)
    this.selectedId = item.id
    //this.inboxData = []
    this.currentPage = 1
    this.loadInboxData()
  }

  createThread(user_id) {
    let data = { user_id: user_id }
    this.messagesService.createThread(data).subscribe((response: any) => {
      this.data.id = response.inboxId
      this.addPusherSubscribe(response.inboxId)
    })
  }

  getDateFormat(data: any) {
    if (data) {
      return moment(data + ' Z').format('MMM DD')
    }
  }

  newChatStatus(status) {
    this.showNewChat = status
    if (status == true) {
      this.currentPage = 1
      this.followingsList = []
      this.getFollowingUsers()
    } else {
      this.currentPage = 1
      // this.inboxData = []
      this.loadInboxData()
    }
  }

  pageFollowingsChanged() {
    this.currentPage = this.currentPage + 1
    this.getFollowingUsers()
  }

  getFollowingUsers() {
    let data = {
      perPage: 10,
      page: this.currentPage
    }
    this.messagesService
      .getMessageFollowers(data)
      .subscribe((response: any) => {
        this.followingsList = this.followingsList.concat(
          response.followingsList
        )
      })
  }

  changeDetect() {
    this.loadInboxData()
  }

  showProfile(username) {
    this.router.navigate( [ '@' + username])
  }

  getLocation(location: string) {
    if (location) {
      const loc = _.split(location, ',')
      return _.last(loc)
    } else {
      return 'The World'
    }
  }


}
