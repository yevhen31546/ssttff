import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { CollectiveScoreInfoComponent } from './../../../modals/collective-score-info/collective-score-info.component';
import { AwardHistoryComponent } from './../../shared/award-history/award-history.component';
import { PhotoEssayListModalComponent } from './../../photo-essay/photo-essay-list-modal/photo-essay-list-modal.component';
import { CritiqueComponentInfoComponent } from './../../../modals/critique-component-info/critique-component-info.component';
import { CriticsComponent } from './../../profile/critics/critics.component';
import { AlertService } from './../../../_services/alert.service'
import {
  NgbModal,
  NgbModalRef,
  NgbActiveModal,
  NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap'
import { FormGroup, FormBuilder } from '@angular/forms'
import { LoaderService } from './../../../_services/loader.service'
import { DataService } from './../../../_services/data.service'
import { Meta, Title } from '@angular/platform-browser'
import { ActivatedRoute, Router } from '@angular/router'
import { ProfileService } from './../../profile/profile.service'
import { Component, OnInit, ViewChild, ElementRef , Inject,Optional} from '@angular/core';
import * as _ from 'lodash'
import { CritiqueInfoComponent } from '../../../modals/critique-info/critique-info.component'
import * as moment from 'moment';
import { CollectionsListModalComponent } from '../../collections/collections-list-modal/collections-list-modal.component';
import { ShareModalComponent } from '../../shared/share-modal/share-modal.component';

@Component({
  selector: 'app-share-critique',
  templateUrl: './share-critique.component.html',
  styleUrls: ['./share-critique.component.css']
})
export class ShareCritiqueComponent implements OnInit {
  @ViewChild('abandonContent') abandonContent;
  @ViewChild('scrollMe') private ScrollContainer: ElementRef;
  imgDetails: any = ''
  currentItemKey: any = ''
  activepopup: Boolean = false
  id: any
  data: any = []
  addCritic: Boolean = false
  userData: any = []
  modalReference: any = false

  criticInsForm: FormGroup;
  counter: any = 0

  impact_users_list: any = []
  disable: Boolean = false
  people: any
  deactivateGuard: Boolean = false
  userDetails: any
  currentType: any = []
  userTypes: any = [
    {
      impact_users_list: []
    }
  ];
  success: Boolean = false

  fixed = false
  change = false
  modalRef: NgbModalRef;

  colorPalate: any = ''
  isShowDropDown: boolean = false
  editCounter: any = 0

  testVal = '';
  uploadData: any = [];
  criticSuccess: Boolean = false;

  criticData: any = {
    impact_value: 0,
    composition_value: 0,
    emotion_value: 0,
    exposure_value: 0,
    creativity_value: 0,
    difficulty_value: 0,
    te_value: 0,
    color_value: 0,
    subject_value: 0,
    story_value: 0
  }
  commentValue: any = []

  showCls: String = ''
  userIds: Array<any> = []
  users: Array<any> = [
    {
      impact_users_list: [],
      composition_users_list: [],
      emotion_users_list: [],
      exposure_users_list: [],
      creativity_users_list: [],
      difficulty_users_list: [],
      technical_execution_users_list: [],
      color_users_list: [],
      subject_users_list: [],
      story_users_list: [],
      comment_users_list: []
    }
  ]

  mentionItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]

  compositionItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]
  emotionItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]
  exposureItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]
  creativityItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]
  difficultyItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]
  technicalItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]
  colorItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]

  subjectItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ]

  storyItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
    }
  ];



  mention: Array<any> = [
    {
      impact_comment: this.mentionItems,
      composition_comment: this.compositionItems,
      emotion_comment: this.emotionItems,
      exposure_comment: this.exposureItems,
      creativity_comment: this.creativityItems,
      difficulty_comment: this.difficultyItems,
      te_comment: this.technicalItems,
      color_comment: this.colorItems,
      subject_comment: this.subjectItems,
      story_comment: this.storyItems
    }
  ];

  textAreaVal =[
    {
      impact_comment: '',
      composition_comment: '',
      emotion_comment: '',
      exposure_comment: '',
      creativity_comment:'',
      difficulty_comment: '',
      te_comment: '',
      color_comment: '',
      subject_comment: '',
      story_comment: ''
    }]

    authUserDetails: any = '';
    isAuthUser: boolean = false



  public config = {}

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private meta: Meta,
    private title: Title,
    private _data: DataService,
    private _loader: LoaderService,
    private formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _alertService: AlertService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.getColor()
    this._loader.display()
    this.title.setTitle('new title')
    this.id = this.route.snapshot.params['id']; //Get order ID

    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.isAuthUser =
        this.authUserDetails.id === this.data.user_id ? true : false;
    }
    this.getProfile()

    this.criticInsForm = this.formBuilder.group({
      impact_comment: [''],
      impact_value: [0],
      composition_comment: [''],
      composition_value: [0],
      emotion_comment: [''],
      emotion_value: [0],
      exposure_comment: [''],
      exposure_value: [0],
      creativity_comment: [''],
      creativity_value: [0],
      difficulty_comment: [''],
      difficulty_value: [0],
      te_value: [0],
      te_comment: [''],
      color_value: [0],
      color_comment: [''],
      subject_comment: [''],
      subject_value: [0],
      story_value: [0],
      story_comment: ['']
    });


    if (this.localStorage.getItem('currentUser')) {
      this.userDetails = JSON.parse(this.localStorage.getItem('user'))
    }

    this.checkChange()
  }

  checkChange() {
    this.criticInsForm.valueChanges.subscribe(res => {
      this.change = false
      const _that = this
      _.forEach(res, function(value, key) {
        if (value && (value > 0 || value.length > 0)) {
          _that.change = true
        }
      })
    })
  }

  getProfile() {
    this.profileService.getProfile(this.id).subscribe(
      (res: any) => {
        this.userData = res.uploadDetails;
        this._loader.hide();
        if (this.localStorage.getItem('currentUser')) {
          const authUserDetails = JSON.parse(this.localStorage.getItem('user'));
          this.addCritic =
            authUserDetails.id === this.userData.user_id ? true : false;
            if (this.addCritic) {
              this.router.navigate(['/photo/' + this.userData.share_id]);
            }
        }

      },
      error => {}
    )
  }

  setCounter(event: any, type: any) {
    if (this.userDetails) {
      let count = 0
      if (event.value > 0) {
        this.criticData[type] = event.value
        _.find(this.criticData, function(value, key) {
          if (value > 0) {
            count += 1
          }
        })
      }
      this.counter = count
    } else {
      this.showInfo(type)
    }
  }

  onSubmitCritics() {
    this.disable = true;


    this.uploadData = this.criticInsForm.value; ////console.log( this.uploadData,"uploaddata", this.userTypes);
    for (let [type, value] of Object.entries(this.uploadData)) {
      if (this.userTypes[type]) { ////console.log(type)
        this.userTypes[type].forEach((el, name) => { ////console.log(el);
          const indexValue: any = value;
          if (indexValue.indexOf('@' + el.username) !== -1) {
            let userName = ''
            if (type != 'te_comment') {
              const typename = type.split('_')
              type = typename[0]
              userName = type + '_users_list'
            } else {
              userName = 'technical_execution' + '_users_list'
            }
            this.users[0][userName].push(el.id); ////console.log(userName,"username",this.users[0][userName])
            this.uploadData[userName] = JSON.stringify(this.users[0][userName]);
            // });
          }
        });
      }
    }
////console.log( this.uploadData,"uploadata after submit")
    this.uploadData.upload_id = this.userData.id
    this.uploadData.technical_execution_comment = this.criticInsForm.value.te_comment
    this.uploadData.technical_execution_value = this.criticInsForm.value.te_value
    this._profileService.addCritic(this.uploadData).subscribe(
      (res: any) => {
        this.success = true
        this.change = false
        this.criticInsForm.reset();
        this.criticSuccess = true;
        this._alertService.success(res.title, res.message)
      },
      error => {
        this.disable = true
        this.success = true
        this._alertService.warning(error.title, error.message)
      }
    )
  }

  format(item: any) {

    return '@' + item['username']
  }

  setUser(user: any,crType: any) {
    if (this.userTypes[this.currentType]) {
      this.userIds.push(user);
      this.userTypes[this.currentType] = this.userIds;

      setTimeout(function() {
        this.textAreaVal[0][crType] = this.criticInsForm.value[crType] + ' ';
      }.bind(this), 200);
    } else {
      this.userTypes[this.currentType] = [user];
    }
  }


  searchPeople(term: any = '', type: any = '', key = '') {
    // search people for mention
    this.currentType = type
    this._profileService.getPeople(term).subscribe((res: any) => {
      this.mentionItems[0].items = res.users
      this.mention.forEach((elmt, key) => {
        elmt[type][0].items = res.users
      })
      this.people = res.users
      if (type) {
        this.userTypes[this.currentType] = [res.users]
      }
      // return this.people.filter((people) => people.username.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) !== -1);
    })
  }



  canDeactivate() {
    if (this.deactivateGuard === true) {
      return true
    }
    if (this.change) {
      const promise = new Promise((resolve, reject) => {
        this.modalRef = this.modalService.open(this.abandonContent)
        this.modalRef.result.then(
          result => {
            this.criticInsForm.reset();
            this.deactivateGuard = true;
            this.modalService.dismissAll()
            // this.route.navigate( [ '@' + this.userDetails.username]);
            resolve(true)
          },
          reason => {
            this.deactivateGuard = false
            resolve(false)
          }
        )
      })
      return promise
    } else {
      this.modalService.dismissAll()
    }
  }



  showInfo(type: any) {
    this.showCls = type
    if (!this.userDetails) {
      this.scrollToTop()
    }
  }

  scrollToTop(): void {
    setTimeout(() => {
      this.ScrollContainer.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }, 500)
  }

  onMouseWheel(event) {
    const el = document.getElementById('stickyTest')
    const screen = el.getBoundingClientRect()
    if (screen.top < screen.height - 10) {
      el.style.position = 'fixed'
    } else {
      el.style.position = 'absolute'
    }
  }

  alertCtitic(event: any) {
    this.canDeactivate()
  }

  openInfoModal() {
    this.modalReference = this.modalService.open(CritiqueInfoComponent, {
      windowClass: 'modal-md'
    })
  }

  criticPopup() {
    const modalRef = this.modalService.open(CriticsComponent, {
      windowClass: 'critic-cls popup-shimmer',
      backdrop: 'static'
    })
    modalRef.componentInstance.modalData = this.userData

  }


  showImageFunction(item) {
    this.activepopup = false
    //this.dataService.passData(item)
  }

  isText(event: any, type) {
    const text = event;
    this.commentValue[type] = text
    if (this.commentValue[type]) {
      // if (this.commentValue[type].indexOf('@') !== -1) {
        if (this.userTypes[type]) {
          this.userTypes[type].forEach(elm => {
            if (this.commentValue[type].indexOf('@' + elm.username) !== -1 && this.commentValue[type].indexOf('<span class="mention-span">@' +
            elm.username +
            '</span>') == -1) {
              this.commentValue[type] = _.replace(
                this.commentValue[type],
                new RegExp('@' + elm.username, 'g'),
                '<span class="mention-span">@' +
                  elm.username +
                  '</span>'
              );
            }
          });
        }

      // }
      this.commentValue[type] = this.commentValue[type].replace('<br/>', '\r')
      let test = this.commentValue[type]
      test = test.replace(/\n/g, '<br />&shy;')
      test = test.replace(/ {2}/g, ' &nbsp;') + '&shy;'
      this.commentValue[type] = test;
    }
  }


  saveCritics() {
    this.uploadData = this.criticInsForm.value;
    for (let [type, value] of Object.entries(this.uploadData)) {
      if (this.userTypes[type]) {
        this.userTypes[type].forEach((el, name) => {
          const indexValue: any = value;
          if (indexValue.indexOf('@' + el.username) !== -1) {
            let userName = ''
            if (type != 'te_comment') {
              const typename = type.split('_')
              type = typename[0]
              userName = type + '_users_list'
            } else {
              userName = 'technical_execution' + '_users_list'
            }
            this.users[0][userName].push(el.id);
            this.uploadData[userName] = JSON.stringify(this.users[0][userName]);
            // });
          }
        });
      }
    }
    this.uploadData.upload_id = this.userData.id;
    this.uploadData.technical_execution_comment = this.criticInsForm.value.te_comment;
    this.uploadData.technical_execution_value = this.criticInsForm.value.te_value;
    this._profileService.addCritic(this.uploadData).subscribe(
      (res: any) => {
        this.success = true
        this.change = false
        this.criticInsForm.reset();
        this.criticSuccess = true;
        this._alertService.success(res.title, res.message)
      },
      error => {
        this.disable = true
        this.success = true
        this._alertService.warning(error.title, error.message)
      }
    )
  }

  getDates(data: any) {
    return moment(data).format('MMM DD, YYYY')
  }

  getColor() {
    if (this.data.colour_palette) {
      setTimeout(() => {
        this.colorPalate = JSON.parse(this.userData.colour_palette)
      }, 1000);
    }
  }

  infoModal(type) {
    const modalRef = this.modalService.open(CritiqueComponentInfoComponent)
    modalRef.componentInstance.type = type
  }


  likePhotos(item) {
    if (!this.authUserDetails) {
      this.router.navigate(['/sign-up'])
    } else {
      this._data.passurLike(this.currentItemKey)

      this.userData.like_status = this.userData.like_status == 0 ? 1 : 0
      let data = { upload_id: this.userData.id }
      this._profileService.updateLikeStatus(data).subscribe(
        (response: any) => {
          this.userData.like_count = response.likeCount
        },
        error => {
          this.userData.like_status = this.userData.like_status == 0 ? 0 : 1
        }
      )
    }

  }

  infoCollectiveModal() {
    const modalRef = this.modalService.open(CollectiveScoreInfoComponent)
  }
  openModal(content) {
    let modalOptions: NgbModalOptions = {
      windowClass: 'info-pos'
    }
    this.modalService
      .open(content, modalOptions)
      .result.then(result => {}, reason => {})
  }

   /**
   *collection pop up
   * @param photo_id
   */
  addCollections(item) {
    if (!this.authUserDetails) {
      this.router.navigate(['/sign-up'])
    } else {
      this.modalReference = this.modalService.open(
        CollectionsListModalComponent,
        {
          windowClass: 'modal-md'
        }
      )
      this.modalReference.componentInstance.data = item;
      this.modalReference.result.then(
        result => {
        },
        reason => {}
      )
    }
  }
  share(item, type) {
    ////console.log(item)

    const modalRef = this.modalService.open(ShareModalComponent)
    modalRef.componentInstance.item = item
    modalRef.componentInstance.type = type
    modalRef.result
      .then(result => {})
      .catch(error => {
        ////console.log(error)
      })
  }

}
