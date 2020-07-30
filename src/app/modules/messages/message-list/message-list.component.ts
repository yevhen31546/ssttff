import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Output,
  EventEmitter,
  AfterViewChecked,
  SimpleChange,
  ViewChildren,
  QueryList,
  Optional
} from '@angular/core'
import { PusherService } from './../../../_services/pusher.service'
import { MessageService } from './../../../_services/message.service'
import { environment } from '../../../../environments/environment'
import { MessagesService } from './../messages.service'
import { ProfileService } from './../../profile/profile.service'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment'
import { Router } from '@angular/router'
import * as _ from 'lodash'
import { ChangeDetectorRef , Inject} from '@angular/core';
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji/public_api'
import { ConnectionService } from 'ng-connection-service'

interface Message {
  message: string
  inbox_id: string
}

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, AfterViewChecked {
  messages: any = []
  userName: string
  messageText: string
  userDetails: any
  active = false
  otherUserDetails: any
  channel: any
  userList: any = []
  commentValue: any
  showPaginationLoader: boolean = false
  isFocused: boolean = false
  isEnableEnter: boolean = true
  @ViewChildren('targetTh')
  targetTh: QueryList<ElementRef>
  status = 'ONLINE'
  isConnected = true
  commentVal: String = ''
  nonSendMessages = []
  countCall: number = 0
  @ViewChild('textareaHeight') textareaHeight: ElementRef

  @Input() data: any = []
  @Input() index: any = []
  @Input() mobile: boolean
  @Output() readCount: EventEmitter<any> = new EventEmitter()
  @Output() changeDetect: EventEmitter<any> = new EventEmitter()
  @Output() messageEvent: EventEmitter<any> = new EventEmitter()
  @ViewChild('emojiContent') emojiContent
  channelName: string
  chatForm: FormGroup
  count: any = 1000
  isModal: boolean = false
  hideme: any = {}
  timeArray: any = []
  startTime: any
  end: any
  isPagination: boolean = false
  currentPage: number = 1
  @ViewChild('scrollMe') private myScrollContainer: ElementRef
  @ViewChild('focusableSubmit') private focusableSubmit
  user: any = ''
  comment: any = ''
  emojiItem: any = ''
  onComment: any
  userNames: any = []
  mentionItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
      // selectMention: this.format
      // mentionSelect: this.format
    }
  ]
  show: boolean = false
  public onlineFlag = navigator.onLine

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private pusherService: PusherService,
    private messagesService: MessagesService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private profileservice: ProfileService,
    private modalActiveService: NgbActiveModal,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private connectionService: ConnectionService
  ) {
    this.messages = []
  }

  ngOnInit() {
    this.chatForm = this.formBuilder.group({
      message: ['', [Validators.required, Validators.maxLength(1000)]]
    })

    if (this.localStorage.getItem('currentUser')) {
      this.userDetails = JSON.parse(this.localStorage.getItem('user'))
    }

    if (typeof this.data !== 'undefined') {
      this.createThread()
      this.addPusher()
      this.loadMessage()
    }
  }

  ngOnChanges(changes: SimpleChange) {
    this.checkConnection()
    if (this.isConnected == true) {
      if (typeof this.data !== 'undefined') {
        this.messages = []
        this.currentPage = 1
        this.createThread()
        this.addPusher()
        this.loadMessage()
      }
    }
  }

  ngAfterViewChecked() {
    if (!this.isPagination) {
      this.scrollToBottom()
    }
    this.cdref.detectChanges()
  }

  addPusher() {
    this.channelName = 'presence-inbox.' + this.data.id
    //console.log(this.channelName,"channelname", this.data)
    if(this.channelName) { //console.log(this.pusherService)
    this.channel = this.pusherService.getPusher().subscribe(this.channelName);

    // this.channel = this.pusherService.pusher.subscribe(this.channelName)

    // this.channel.bind('pusher:subscription_succeeded', function() {})

    // this.channel.bind('pusher:subscription_error', function(status) {
    //   ////console.log(status)
    // })

    // this.pusherService.pusher.connection.bind('error', function(err) {
    //   ////console.log(err)
    //   if (err.error.data.code === 4004) {
    //     ////console.log('err')
    //   }
    // })

    this.channel.bind('messagesent', data => {
      if (!this.messages.some((item: any) => item.id == data.update.id)) {
        this.messages = this.messages.concat(data.update)
        this.getComment(
          data.update,
          data.update.message,
          data.update.mention_list
        )
        this.timeArray = this.timeArray.concat(data.update.createdAt)
        data.update.index = this.index
        this.changeDetect.emit()
      }
    });
  }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.chatForm.controls
  }

  createThread() {
    this.timeArray = []
    this.isModal = false
    let data = { user_id: this.data.other_user_id }
    this.messagesService.createThread(data).subscribe((response: any) => {
      this.data.id = response.inboxId
      this.addPusher()
      this.isModal = this.data.isModal === undefined ? false : this.data.isModal
    })
  }

  getChannel() {
    return this.channel
  }

  closeModal() {
    this.modalActiveService.close()
  }

  showProfile(username) {
    this.router.navigate( [ '@' + username])
  }

  loadMessage() {
    this.showPaginationLoader = true
    let data = {
      inbox_id: this.data.id,
      other_user_id: this.data.other_user_id,
      page: this.currentPage,
      per_page: 10
    }
    this.messagesService.loadMessageData(data).subscribe((response: any) => {
      let elementArray = response.message_list.data.reverse()
      elementArray.forEach((element: any) => {
        element.imageShow = true
        element.isGroup = false
        this.getComment(element, element.message, element.mention_list)
      })
      this.messages = elementArray.concat(this.messages)
      this.otherUserDetails = response.user_details;
      if (this.otherUserDetails.photo_url == null) {
        this.otherUserDetails.photo_url = 'assets/images/temp/user-icon.svg'
      }
      this.showPaginationLoader = false

      //this.readCount.emit(this.read_count)
    })
  }

  pageChanged() {
    this.isPagination = true
    this.currentPage = this.currentPage + 1
    this.loadMessage()
  }

  sendMessage() {
    ////console.log(this.isEnableEnter)
    if (
      this.isEnableEnter == true &&
      (this.count < 1 || this.count != 'Over character limit')
    ) {
      this.isPagination = false
      if (
        this.chatForm.value.message &&
        this.chatForm.value.message.trim() != ''
      ) {
        let content = this.chatForm.value.message
        if (this.isConnected == false) {
          let messageArray = {
            message: content,
            is_send: 0,
            inbox_id: this.data.id,
            comment: this.commentValue,
            sender_user_id: this.userDetails.id,
            users_list: JSON.stringify(this.userList),
            created_at: moment().format('YYYY-MM-DD HH:mm:ss')
          }
          this.nonSendMessages = this.nonSendMessages.concat(messageArray)
          this.messages = this.messages.concat(messageArray)
        } else {
          //this.chatForm.value.message = content
          let data = {
            message: content,
            inbox_id: this.data.id,
            comment: this.commentValue,
            users_list: JSON.stringify(this.userList)
          }
          this.messagesService
            .sendMessageData(data)
            .subscribe((response: any) => {
              if (response.message_broadcast_data.is_send == 0) {
                this.messages = this.messages.concat(
                  response.message_broadcast_data
                )
                // this.currentMessage=response.message_broadcast_data
              }

              //this.changeDetect.emit()
            })
        }
        this.chatForm.value.message = ''
        this.chatForm.reset()
        this.count = 1000
      }
    } else {
      this.isEnableEnter = true
    }
  }

  replaceURLWithHTMLLinksHere(text, sender_id) {
    var urlRegex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g
    const cls = sender_id !== this.userDetails.id ? 'text-black' : 'text-white'
    return text.replace(urlRegex, function(url) {
      return (
        '<span class="underline"><a class="' +
        cls +
        '" target="_blank" href="' +
        url +
        '">' +
        url +
        '</a></span>'
      )
    })
  }

  addhttp(url) {
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
      url = 'http://' + url
    }
    return url
  }

  reSendMessage(item, index) {
    let data = {
      message: item.message,
      inbox_id: item.inbox_id,
      users_list: JSON.stringify(item.userList),
      message_id: item.id
    }
    this.messagesService.sendMessageData(item).subscribe((response: any) => {
      if (item.id) {
        item.is_send = response.message_broadcast_data.is_send
      }
      this.messages.splice(index, 1)
      // else {

      //   //this.messages = this.messages.concat(response.message_broadcast_data)
      // }
      //  ////console.log(response.message_broadcast_data)
      //    if(response.message_broadcast_data.is_send==1){
      //   //   item=response.message_broadcast_data
      //   // // this.currentMessage=response.message_broadcast_data
      //    }
    })
  }

  onTypeInput($event) {
    this.count = 1000 - $event.length
    if (this.count < 1) {
      this.count = 'Over character limit'
    }
  }

  deleteMessage(item, content) {
    this.modalService.open(content).result.then(
      result => {
        let data = { message_id: item.id }
        this.messagesService.deleteMessage(data).subscribe((response: any) => {
          this.hideme[item.id] = false
        })
      },
      reason => {}
    )
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight
    } catch (err) {}
  }

  eventHandler(event) {
    if (event.keyCode == 13)
      if (!event.shiftKey) {
        this.focusableSubmit.click()
      }
  }

  getDateFormat(data: any, i) {
    if (data) {
      let last = i - 1
      if (
        this.messages[last] &&
        this.messages[last].sender_user_id == data.sender_user_id
      ) {
        var startTime = moment(this.messages[last].created_at, 'hh:mm:ss a')
        var endTime = moment(data.created_at, 'hh:mm:ss a')

        if (endTime.diff(startTime, 'minutes') < 1) {
          this.messages[last].created_at = ''
          this.messages[last].isGroup = true
          data.imageShow = false
        }
      }
      if (data.created_at) {
        return moment(data.created_at + ' Z')
          .format('MMM DD, h:mm a')
          .toLocaleString()
      } else {
        return ''
      }
    }
  }

  getWidth(index) {
    let widths: any = this.targetTh.map(th => th.nativeElement.offsetWidth)
    return widths[index] + 'px'
  }

  minDiff() {
    var duration = moment.duration(this.end.diff(this.startTime))
    ////console.log(duration.asMinutes())
  }

  smiley() {
    this.show = !this.show
  }

  isText(event: any) {
    this.onComment = true
    const text = event
    this.comment = text
    this.commentValue = text
    if (this.commentValue) {
      if (this.commentValue.indexOf('@') !== -1) {
        this.userNames.forEach(element => {
          if (
            this.commentValue.indexOf('@' + element) !== -1 &&
            this.commentValue.indexOf(
              '<span class="mention-span">@' + element + '</span>'
            ) == -1
          ) {
            this.commentValue = _.replace(
              this.commentValue,
              new RegExp('@' + element, 'g'),
              '<span class="mention-span">@' + element + '</span>'
            )
          }
        })
      }
      this.commentValue = this.commentValue.replace('<br/>', '\r')
      this.commentValue = this.commentValue.replace('<br/>', '\n')
      let test = this.commentValue
      test = test.replace(/\n/g, '<br />&shy;')
      test = test.replace(/ {2}/g, ' &nbsp;') + '&shy;'
      this.commentValue = test
    }
    if (text) {
      this.active = true
    } else {
      this.active = false
    }
  }

  getComment(comment: any, content: any, users: any) {
    if (users) {
      users.forEach(element => {
        if (content.indexOf('@' + element) !== -1) {
          const cls =
            comment.sender_user_id !== this.userDetails.id
              ? 'text-black'
              : 'text-white'

          content = _.replace(
            content,
            new RegExp('@' + element, 'g'),
            "<u><a class='" +
              cls +
              "' href='/@" +
              element +
              "'><b>@" +
              element +
              '</b></a></u>'
          )
          //this.isEnableEnter = false
        }
      })
      comment.message = content
    }
  }

  selectedTerm(term: any) {
    this.onComment = false
    this.userList.push(term.id)
    this.userNames.push(term.username)
    const lastIndex = this.comment.lastIndexOf(' ')
    this.comment = this.comment.substring(0, lastIndex)
    ////console.log(this.comment)
    setTimeout(
      function() {
        this.commentVal = this.comment + ' '
      }.bind(this),
      200
    )
  }

  format(item) {
    return '<strong>@' + item.username + '</strong>'
  }

  searchUser(event: any) {
    this.profileservice.getPeople(event).subscribe((res: any) => {
      this.mentionItems[0].items = res.users
      if (res.users.length != 0) {
        this.isEnableEnter = false
      } else {
        this.isEnableEnter = true
      }
    })
  }

  public addEmoji(event: { $event: MouseEvent; emoji: EmojiData }) {
    let emoticonElement = <HTMLElement>event.$event.target
    if (
      !emoticonElement.style.backgroundImage ||
      emoticonElement.style.backgroundImage === ''
    ) {
      emoticonElement = <HTMLElement>emoticonElement.firstChild
    }
    if (this.chatForm.value.message == null) {
      this.chatForm.value.message = ''
    }
    this.chatForm.controls['message'].setValue(
      this.chatForm.value.message + event.emoji.native
    )
    this.commentValue = this.commentValue + event.emoji.native
    this.count = this.count - 1
    this.show = false
  }

  backtoList() {
    this.messageEvent.emit()
  }

  focusElement() {
    this.isFocused = true
  }

  getLocation(location: string) {
    if (location) {
      const loc = _.split(location, ',')
      return _.last(loc)
    } else {
      return 'The World'
    }
  }

  checkConnection() {
    this.connectionService.monitor().subscribe(isConnected => {
      this.isConnected = isConnected
      if (this.isConnected) {
        this.status = 'ONLINE'
        this.countCall++
        if (this.countCall == 1) {
          for (let i = 0; i < this.nonSendMessages.length; i++) {
            this.messagesService
              .sendMessageData(this.nonSendMessages[i])
              .subscribe((response: any) => {})
          }
        }
        this.nonSendMessages = []
      } else {
        this.countCall = 0
        this.status = 'OFFLINE'
      }
    })
  }

  autosize(event: Event) {
    // this.textareaHeight.nativeElement.style.height = this.textareaHeight.nativeElement.scrollHeight + 'px';
    this.textareaHeight.nativeElement.style.overflow = 'hidden'
    this.textareaHeight.nativeElement.style.height = 'auto'
    this.textareaHeight.nativeElement.style.height =
      this.textareaHeight.nativeElement.scrollHeight + 'px'
  }
}
