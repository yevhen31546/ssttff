import { CritiqueComponentInfoComponent } from './../../../modals/critique-component-info/critique-component-info.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CriticsComponent } from './../critics/critics.component'
import { DataService } from './../../../_services/data.service'
import { Router } from '@angular/router'
import { ProfileService } from './../profile.service'
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterContentInit,
  OnChanges
} from '@angular/core';
import * as _ from 'lodash';
import * as MobileDetect from 'mobile-detect'


@Component({
  selector: 'app-view-critic',
  templateUrl: './view-critic.component.html',
  styleUrls: ['./view-critic.component.css']
})
export class ViewCriticComponent
  implements OnInit, AfterContentInit, OnChanges {
  @Input() uploadId
  @Input() data: any = ''
  @Input() imgDetails: any = ''
  @Input() currentItemKey: any = ''
  @Output() profile: EventEmitter<any> = new EventEmitter()
  @Output() upgrade: EventEmitter<any> = new EventEmitter()
  @Output() critic: EventEmitter<any> = new EventEmitter()
  @Output('criticPopup') criticPopup: EventEmitter<any> = new EventEmitter<
    any
  >()
  @Input() criticDatas: any = []
  showPaginationLoader: boolean = false

  // criticDatas: any = '';
  subPlan: Number = 0
  userDetails: any = []
  showJoinInfo: any = []
  showUpgradeInfo: any = []
  active: any = false
  user: any = 0
  users: any = []
  userId: any = '';
  criticUserId: any ='';
  criticFields: any = [
    'impact_comment',
    'composition_comment',
    'emotion_comment',
    'exposure_comment',
    'creativity_comment',
    'difficulty_comment',
    'technical_execution_comment',
    'color_comment',
    'subject_comment',
    'story_comment'
  ];
  mobile: Boolean = false;

  constructor(
    private _profileService: ProfileService,
    private router: Router,
    private _dataService: DataService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {

    const md = new MobileDetect(window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true
    }
    this.showPaginationLoader = true
    if (localStorage.getItem('currentUser')) {
      this.userDetails = JSON.parse(localStorage.getItem('user'))
      this.userId = this.userDetails.id
      this.getProfileData()
    }
    this.getCriticsList()
    ////console.log(this.data, this.userDetails, 'imageeeee')
  }

  ngAfterContentInit(): void {
    // this.showPaginationLoader = false
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
  }

  ngOnChanges() {
    this.criticDatas = []
    this.getCriticsList()
  }

  getCriticsList() {
    this.showPaginationLoader = true
    this._profileService
      .getCritics(this.uploadId, this.userId)
      .subscribe((res: any) => {
        this.criticDatas = res.uploads.critique;
        if (this.criticDatas.length > 0) {
        this.criticDatas.forEach(element => {
          ////console.log(element);
          this.criticFields.forEach((elem, key) => { ////console.log(elem,key)
             if (element[elem]) {
                const mention = elem.split('_');
               ////console.log(elem, element[elem], element[mention[0] + '_mention_list'],"elem")
                  let mentionUsers = element[mention[0] + '_mention_list'];
                  if (elem == 'technical_execution_comment') {
                    mentionUsers = element['technical_execution_mention_list'];
                  }
                  this.getComment(element, element[elem], mentionUsers, elem);
             }
          });
         });
      }
        this.showPaginationLoader = false
      });
  }

  showProfile(username) {
    if (this.userDetails && this.subPlan !== 1) {
      this.profile.emit(username)
    }
  }

  showInfo(userId: any) {
    // if ( this.criticDatas.user_id === this.userId ) {
    this.criticUserId = userId;
    if (this.userDetails.length !== 0) {
      if (this.users[userId]) {
        this.users[userId] = false
      } else {
        this.users.push(userId)
        this.users[userId] = true
      }
    } else {
      this.users[userId] = false
    }
    if (this.userDetails.length == 0) {
      if (this.showJoinInfo[userId]) {
        this.showJoinInfo[userId] = false
      } else {
        this.showJoinInfo.push(userId)
        this.showJoinInfo[userId] = true
      }
    }
    if (this.subPlan === 1) {
      if (this.showUpgradeInfo[userId]) {
        this.showUpgradeInfo[userId] = false
      } else {
        this.showUpgradeInfo.push(userId)
        this.showUpgradeInfo[userId] = true
      }
    }
    // }
    ////console.log( this.users,"showmodel")
  }

  upgradePlan() {
    this.upgrade.emit()
  }

  getProfileData() {
    let data = { username: this.userDetails.username }
    this._profileService.getProfileData(data).subscribe((response: any) => {
      this.subPlan = response.user.subscription_plan
    })
  }

  addCritics() {
    this.criticPopup.emit()
  }

  signIn() {
    this.modalService.dismissAll()
    this.router.navigate(['/sign-up'])
  }

  infoModal(type) {
    const modalRef = this.modalService.open(CritiqueComponentInfoComponent)
    modalRef.componentInstance.type = type;
  }

  getComment(comment: any, content: any, users: any, type) { ////console.log(users);
    users.forEach(element => {
      ////console.log(element)
      if (content.indexOf('@' + element) !== -1) {
        content = _.replace(
          content,
          new RegExp('@' + element, 'g'),
          "<a class='text-black' href='/@" +
            element +
            "'><b>@" +
            element +
            '</b></a>'
        )
      }
    })
    comment[type] = content
  }


  closeModal() {
    this.modalService.dismissAll();
  }

}
