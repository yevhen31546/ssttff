import { WINDOW } from '@ng-toolkit/universal';
import Echo from 'laravel-echo'
import { Component, OnInit, ViewChild, ElementRef , Inject, PLATFORM_ID} from '@angular/core';
import { NotificationService } from '../../_services/notification.service'
import { WebNotificationService } from '../web-notification/web-notification.service'
import * as moment from 'moment'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { MessageListComponent } from '../messages/message-list/message-list.component'
import { MessagesService } from '../messages/messages.service'
import { ImageGridModalComponent } from '../shared/image-grid-modal/image-grid-modal.component'
import { ProfileService } from '../profile/profile.service'
import { LoaderService } from '../../_services'
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-web-notification',
  templateUrl: './web-notification.component.html'
})
export class WebNotificationComponent implements OnInit {
  currentPage: number = 1
  notificationData: any = []
  modalReference: any

  @ViewChild('deleteModal')
  deleteModal: ElementRef
  showPaginationLoader:boolean=true

  constructor(@Inject(WINDOW) private window: Window,
  @Inject(PLATFORM_ID) private platformId: Object,
    private notificationService: NotificationService,
    private userNotificationService: WebNotificationService,
    private router: Router,
    private modalService: NgbModal,
    private messagesService: MessagesService,
    private profileService: ProfileService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

    this.notificationService.currentMessage.subscribe(data => {
      //do what ever needs doing when data changes
      if (data) {
        if (data.data.type == 'like') {
          data.data.appendText = 'liked '
        } else if (data.data.type == 'critique') {
          data.data.appendText = 'critiqued '
        } else if (data.data.type == 'message') {
          data.data.appendText = 'sent you a'
        } else if (data.data.type == 'follow') {
          data.data.appendText = 'followed you'
        } else if (data.data.type == 'comment') {
          data.data.appendText = 'commented on '
        }

        this.notificationData.unshift(data.data)
        this.getUnique(this.notificationData,'id')
      }
    })
  }
    this.getNotification()
  }

  getNotification() {
    let data = {
      perPage: 100,
      page: this.currentPage
    }
    this.userNotificationService
      .getNotification(data)
      .subscribe((response: any) => {
        //this.inboxData = this.inboxData.concat(response.inbox_list.data)
        this.notificationData = response.notification_list

        // this.inboxData = chat

        for (let i = 0; i < this.notificationData.length; ++i) {
          if (this.notificationData[i].type == 'like') {
            this.notificationData[i].appendText = 'liked '
          } else if (this.notificationData[i].type == 'critique') {
            this.notificationData[i].appendText = 'critiqued '
          } else if (this.notificationData[i].type == 'message') {
            this.notificationData[i].appendText = 'sent you a'
          } else if (this.notificationData[i].type == 'follow') {
            this.notificationData[i].appendText = 'followed you'
          } else if (this.notificationData[i].type == 'comment') {
            this.notificationData[i].appendText = 'commented on '
          }
        }
        this.showPaginationLoader=false
        // this.data = response.inbox_list.data[0]
      })
  }

  showProfile(item) {
    this.modalService.dismissAll()
    this.router.navigate( [ '@' + item.from_user_username])
  }

  timeSince(timeStamp) {
    return moment(timeStamp + ' Z').fromNow()
  }

  clearNotification() {
    this.modalService.open(this.deleteModal).result.then(result => {
      this.notificationData = []
      this.userNotificationService
        .deleteNotificationData()
        .subscribe((response: any) => {})
    })
  }

  closeModal() {
    this.modalService.dismissAll()
  }

  openMessageModal(item) {
    this.router.navigate(['/messages']);
    ////console.log(item)

    // let data = {
    //   user_id: item.type_id
    // }
    // this.messagesService.createThread(data).subscribe(
    //   (res: any) => {
    //     this.modalReference = this.modalService.open(MessageListComponent, {
    //       windowClass: 'modal-md',
    //       centered: true
    //     })
    //     let data = {
    //       id: res.inboxId,
    //       other_user_id: item.type_id,
    //       isModal: true,
    //       first_name: item.from_user_first_name,
    //       username: item.from_user_username,
    //       userDetails: {
    //         first_name: item.from_user_first_name,
    //         username: item.from_user_username
    //       }
    //     }
    //     this.modalReference.componentInstance.data = data
    //     this.modalReference.result.then(
    //       result => {
    //         // ////console.log(result)
    //       },
    //       reason => {}
    //     )
    //   },
    //   (error: any) => {}
    // )
     this.modalService.dismissAll()
  }

  openImageModal(item) {
    this.modalService.dismissAll()
    let data = { id: item.type_id }
    this.profileService.getUserImageData(data).subscribe((res: any) => {
      this.modalReference = this.modalService.open(ImageGridModalComponent, {
        windowClass: 'critic-cls popup-shimmer',
        centered: true
      })
      let imgDetails = [res.uploadDetails]
      this.modalReference.componentInstance.data = res.uploadDetails
      this.modalReference.componentInstance.currentItemKey = 0
      this.modalReference.componentInstance.imgDetails = imgDetails
      //this.modalReference = this.modalService.open(content)
      this.modalReference.result.then(
        result => {
          // ////console.log(result)
        },
        reason => {}
      )
    })
  }

  getUnique(arr, comp) {
    const unique = arr
      .map(e => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e])

    return unique
  }

}
