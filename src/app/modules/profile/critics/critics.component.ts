import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { CollectiveScoreInfoComponent } from './../../../modals/collective-score-info/collective-score-info.component';
import { element } from 'protractor'
import { CritiquesService } from './../../critiques/critiques.service'
import { Title } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { CanDeactivateGuard } from './../../../_guards/can-deactivate.guard'
import {
  NgbModal,
  NgbModalRef,
  NgbModalOptions,
  NgbActiveModal
} from '@ng-bootstrap/ng-bootstrap'
import { AlertService } from './../../../_services/alert.service'
import { ProfileService } from './../profile.service'
import { NgForm } from '@angular/forms'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
  Output,
  EventEmitter,
  SimpleChange,
  SimpleChanges,Optional
} from '@angular/core'
import * as _ from 'lodash'
import { Inject } from '@angular/core'
import { DataService } from '../../../_services'
import { AwardHistoryComponent } from '../../shared/award-history/award-history.component'
import { PhotoEssayListModalComponent } from '../../photo-essay/photo-essay-list-modal/photo-essay-list-modal.component'
import { CollectionsListModalComponent } from '../../collections/collections-list-modal/collections-list-modal.component'
import { ShareModalComponent } from '../../shared/share-modal/share-modal.component'
import * as moment from 'moment'
import { CritiqueInfoComponent } from '../../../modals/critique-info/critique-info.component'
import { CritiqueComponentInfoComponent } from '../../../modals/critique-component-info/critique-component-info.component'

@Component({
  selector: 'app-critics',
  templateUrl: './critics.component.html',
  styleUrls: ['./critics.component.css'],
  providers: [AlertService]
})
export class CriticsComponent implements OnInit {
  @Input() upload_id: any
  @Input() upload_image: any = 'assets/images/temp/banner.png'

  @Input() modalData: any = ''
  @Input() imgDetails: any = ''
  @Input() currentItemKey: any = ''
  @Input() fromModal: any = false
  @Input() addCritic: boolean
  @Input() criticDetails: any
  @Input() view: Boolean
  @Input() edit: Boolean

  // @HostListener('document:click', ['$event'])

  @ViewChild('abandonContent') abandonContent
  @ViewChild('scrollMe') private ScrollContainer: ElementRef
  @Output('hideCritic') hideCritic: EventEmitter<any> = new EventEmitter<any>();
  @Output('removeCritic') removeCritic: EventEmitter<any> = new EventEmitter<any>();
  //@HostListener('document:click', ['$event'])
  colorPalate: any = ''
  criticInsForm: FormGroup
  modalReference: any = false
  isShowDropDown: boolean = false
  editCounter: any = 0
  activepopup: boolean = false;

  testVal = '';
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

  counter: any = 0
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
  impact_users_list: any = []
  disable: Boolean = false
  people: any
  deactivateGuard: Boolean = false
  modalRef: NgbModalRef
  userDetails: any
  currentType: any = []
  userTypes: any = [
    // {
    //   impact_users_list: []
    // }
  ]
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
  data: any
  success: Boolean = false
  uploadData: any = []
  fixed = false
  change = false

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
  ]

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
  ]

  public config = {}
  authUserDetails: any
  isAuthUser: boolean = false
  isShowPre: boolean = true
  isShowNext: boolean = true;
  criticSuccess: Boolean = false;

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _alertService: AlertService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private route: Router,
    private eRef: ElementRef,
    private dataService: DataService,
    private router: Router,
    private criticService: CritiquesService,
    private _title: Title
  ) {}

  ngOnInit() {
    this.activepopup = true
    this.data = this.modalData;
    this.dataService.scrollUpdation.subscribe(data => {
      this.scrollToTop()
    }); //console.log(this.data,"dataaaa",this.modalData)
    this.getColor()
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.isAuthUser =
        this.authUserDetails.id === this.data.user_id ? true : false
    }
    // // const stickyVar = new sticky('.sticky');
    // ////console.log(stickyVar);
    // this.searchPeople();
    this.criticInsForm = this.formBuilder.group({
      impact_comment: [{ value: '', disabled: this.view }],
      impact_value: [{ value: 0, disabled: this.view }],
      composition_comment: [{ value: '', disabled: this.view }],
      composition_value: [{ value: 0, disabled: this.view }],
      emotion_comment: [{ value: '', disabled: this.view }],
      emotion_value: [{ value: 0, disabled: this.view }],
      exposure_comment: [{ value: '', disabled: this.view }],
      exposure_value: [{ value: 0, disabled: this.view }],
      creativity_comment: [{ value: '', disabled: this.view }],
      creativity_value: [{ value: 0, disabled: this.view }],
      difficulty_comment: [{ value: '', disabled: this.view }],
      difficulty_value: [{ value: 0, disabled: this.view }],
      te_value: [{ value: 0, disabled: this.view }],
      te_comment: [{ value: '', disabled: this.view }],
      color_value: [{ value: 0, disabled: this.view }],
      color_comment: [{ value: '', disabled: this.view }],
      subject_comment: [{ value: '', disabled: this.view }],
      subject_value: [{ value: 0, disabled: this.view }],
      story_value: [{ value: 0, disabled: this.view }],
      story_comment: [{ value: '', disabled: this.view }]
    });

    if (this.criticDetails) {
      // this.criticInsForm.patchValue(this.criticDetails);
      this.textAreaVal[0]['impact_comment'] = this.criticDetails.impact_comment;
      this.textAreaVal[0]['composition_comment'] = this.criticDetails.composition_comment;
      this.textAreaVal[0]['emotion_comment'] = this.criticDetails.emotion_comment;
      this.textAreaVal[0]['exposure_comment'] = this.criticDetails.exposure_comment;
      this.textAreaVal[0]['creativity_comment'] = this.criticDetails.creativity_comment;
      this.textAreaVal[0]['difficulty_comment'] = this.criticDetails.difficulty_comment;
      this.textAreaVal[0]['technical_execution_comment'] = this.criticDetails.technical_execution_comment;
      this.textAreaVal[0]['color_comment'] = this.criticDetails.color_comment;
      this.textAreaVal[0]['subject_comment'] = this.criticDetails.subject_comment;
      this.textAreaVal[0]['story_comment'] = this.criticDetails.story_comment;

      this.criticInsForm.patchValue({
        impact_comment: this.criticDetails.impact_comment
          ? this.criticDetails.impact_comment
          : '',
        impact_value: this.criticDetails.impact_value
          ? this.criticDetails.impact_value
          : 0,
        composition_comment: this.criticDetails.composition_comment
          ? this.criticDetails.composition_comment
          : '',
        composition_value: this.criticDetails.composition_value
          ? this.criticDetails.composition_value
          : 0,
        emotion_comment: this.criticDetails.emotion_comment
          ? this.criticDetails.emotion_comment
          : '',
        emotion_value: this.criticDetails.emotion_value
          ? this.criticDetails.emotion_value
          : 0,
        exposure_comment: this.criticDetails.exposure_comment
          ? this.criticDetails.exposure_comment
          : '',
        exposure_value: this.criticDetails.exposure_value
          ? this.criticDetails.exposure_value
          : 0,
        creativity_comment: this.criticDetails.creativity_comment
          ? this.criticDetails.creativity_comment
          : '',
        creativity_value: this.criticDetails.creativity_value
          ? this.criticDetails.creativity_value
          : 0,
        difficulty_comment: this.criticDetails.difficulty_comment
          ? this.criticDetails.difficulty_comment
          : '',
        difficulty_value: this.criticDetails.difficulty_value
          ? this.criticDetails.difficulty_value
          : 0,
        te_value: this.criticDetails.technical_execution_value ? this.criticDetails.technical_execution_value : 0,
        te_comment: this.criticDetails.technical_execution_comment
          ? this.criticDetails.technical_execution_comment
          : '',
        color_value: this.criticDetails.color_value
          ? this.criticDetails.color_value
          : 0,
        color_comment: this.criticDetails.color_comment
          ? this.criticDetails.color_comment
          : '',
        subject_comment: this.criticDetails.subject_comment
          ? this.criticDetails.subject_comment
          : '',
        subject_value: this.criticDetails.subject_value
          ? this.criticDetails.subject_value
          : 0,
        story_value: this.criticDetails.story_value
          ? this.criticDetails.story_value
          : 0,
        story_comment: this.criticDetails.story_comment
          ? this.criticDetails.story_comment
          : ''
      });

      this.change = this.view ? false : this.edit && this.counter >0 ? true : this.change
      this.disable = this.edit ? false : this.disable
      this.getCounterData()
    }

    if (this.localStorage.getItem('currentUser')) {
      this.userDetails = JSON.parse(this.localStorage.getItem('user'))
      if (this.localStorage.getItem('currentUser')) {
        this.userDetails = JSON.parse(this.localStorage.getItem('user'))
        this._title.setTitle(
          'Critique Photo | ' +
            this.modalData.title +
            ' by ' +
            this.userDetails.first_name +
            this.userDetails.last_name +
            ' | Shoot The Frame'
        )
      }

      this.checkChange()
    }
  }

  checkChange() {
    this.criticInsForm.valueChanges.subscribe(res => {
      this.change = false;
      const _that = this;
      _.forEach(res, function(value, key) {
        if (value && (value > 0 || value.length > 0)) {
          _that.change = true;
        }
      });
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.data = this.modalData
  }

  setCounter(event: any, type: any) {
    if (this.userDetails) {
      if (!this.criticDetails) {
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
        this.getCounterData()
      }
    } else {
      this.showInfo(type)
    }
  }

  getCounterData() {
    const _that = this
    _.forEach(this.criticInsForm.value, function(value, key) {
      if ((value > 0 || value.length > 0) && value != '') {
        _that.editCounter += 1
      }
    })
    this.counter = this.editCounter;
  }

  showProfile(username) {
    this.modalService.dismissAll()
    this.router.navigate( [ '@' + username])
  }

  /**
   * show drop down
   * @param username
   */
  showDropDown() {
    this.isShowDropDown = this.isShowDropDown == true ? false : true
  }

  onSubmitCritics() { // submit critics
    if (this.edit) {
      this.editCritics()
    } else {
      this.disable = true
      this.saveCritics()
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

  setUser(user: any,crType: any) {
    if (this.userTypes[this.currentType]) {
      this.userIds.push(user);
      this.userTypes[this.currentType] = this.userIds;

      setTimeout(function() {
        this.textAreaVal[0][crType] = this.criticInsForm.value[crType] + ' ';
      }.bind(this), 200);
    } else {
      this.userTypes[this.currentType] = [user];
    } ////console.log(this.userTypes,"setuser usertypes");
  }

  saveCritics() {
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
    this.uploadData.upload_id = this.modalData.id
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

  editCritics() {
    this.uploadData = this.criticInsForm.value;
      for (let [type, value] of Object.entries(this.uploadData)) {
      if (this.userTypes[type]) {
        this.userTypes[type].forEach((el, name) => {
           const indexValue: any = value;
          if (indexValue && indexValue.indexOf('@' + el.username) !== -1) {

            let userName = ''
            if (type != 'te_comment') {
              const typename = type.split('_');
              type = typename[0]
              userName = type + '_users_list'
            } else {
              userName = 'technical_execution' + '_users_list'
            }
              ////console.log(this.users, userName);
            this.users[0][userName].push(el.id) ;
            this.uploadData[userName] = JSON.stringify(this.users[0][userName])
            // });
          }
        })
      }
    }

    this.uploadData.upload_id = this.modalData.id
    this.uploadData.technical_execution_comment = this.criticInsForm.value.te_comment
    this.uploadData.technical_execution_value = this.criticInsForm.value.te_value
    this.uploadData.critique_id = this.criticDetails.id

    this.criticService.editCritique(this.uploadData).subscribe(
      (res: any) => {
        this.success = true
        this.disable = true
        this.change = false
        this.criticInsForm.reset()
        this._alertService.success(res.title, res.message)
      },
      error => {
        this.success = true
        this._alertService.warning(error.title, error.message)
      }
    )
  }

  format(item: any) {
    return '@' + item['username']
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

  canDeactivate() {
    if (this.deactivateGuard === true) {
      return true
    }
    if (this.change) {
      const promise = new Promise((resolve, reject) => {
        this.modalRef = this.modalService.open(this.abandonContent)
        this.modalRef.result.then(
          result => {
            this.deactivateGuard = true
            if (this.fromModal) {
              this.hideCritic.emit();
            } else {
              this.modalService.dismissAll()
            }
            resolve(true)
          },
          reason => {
            this.deactivateGuard = false
            resolve(false)
          }
        )
      });
      return promise;
    } else {
      if (this.fromModal) {
        this.hideCritic.emit();
        if(this.criticSuccess) {
          this.removeCritic.emit({id:this.modalData.id});
           this.dataService.removeCritic(this.modalData.id);
        }
      } else {
        this.modalService.dismissAll()
      }
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
    }, 500);
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

  submitStfAwards(data: any) {
    this.modalService.dismissAll()
    if (this.data.finalist > 0) {
      const error = {
        title: 'Photo already submitted',
        message: 'The photo is currently submitted',
        type: 'stfawarderror'
      }
      this.dataService.alertData(error)
    }
    if (this.data.stf_entry > 0) {
      const error = {
        title: 'Photo already submitted',
        message:
          'The photo is currently submitted into the STF Awards. You are not able to submit a photo twice in the same month.',
        type: 'stfawarderror'
      }
      this.dataService.alertData(error)
    } else if (this.data.finalist > 0) {
      const error = {
        title: 'Unable to submit photo',
        message:
          'You are not able to submit this photo into the STF Awards because it has previous been a finalist or a winner.',
        type: 'stfawarderror'
      }
      this.dataService.alertData(error)
    } else {
      this.router.navigate([
        'user/upload-photo/submit-stf-awards',
        this.data.id
      ])
    }
  }

  awardHistoryModal(item) {
    this.modalReference = this.modalService.open(AwardHistoryComponent, {
      centered: true
    })
    this.modalReference.componentInstance.historyId = item.id
    this.modalReference.result.then(result => {}, reason => {})
  }

  /**
   *
   * @param photo_id
   */
  addPhotoEssay(item) {
    this.modalReference = this.modalService.open(PhotoEssayListModalComponent, {
      windowClass: 'modal-md'
    })
    // ////console.log(item)
    this.modalReference.componentInstance.data = item
    this.modalReference.result.then(
      result => {
        //  ////console.log(result)
      },
      reason => {}
    )
  }

  /**
   * Edit Photo
   */
  editPhoto(id: any) {
    this.localStorage.setItem('subjectId', id)
    this.localStorage.setItem('updateStatus', '1')
    this.modalService.dismissAll()
    this.router.navigate(['user/upload-photo/details'])
  }

  /**
   * Delete photo
   */

  deletePhoto(content) {
    this.modalService.open(content).result.then(
      result => {
        ////console.log(result)
        this._profileService.deletePhotoDetails(this.data.id).subscribe(
          res => {
            ////console.log(res, 'delete')
            if (res.status === true) {
              res.delete = true
              this.modalService.dismissAll()
              let data = {
                title: res.title,
                message: res.message,
                type: 'success',
                id: this.data.id,
                index: this.currentItemKey
              }
              this.dataService.alertData(data)
              //  this.showProfile(this.data.username);
            } else {
              res.delete = false
              this.modalService.dismissAll()
              let data = {
                title: res.title,
                message: res.message,
                type: 'info'
              }
              this.dataService.alertData(data)
            }
          },
          error => {
            error.delete = false
            this.modalService.dismissAll()
            let data = {
              title: error.error.title,
              message: error.error.common_error,
              type: 'info'
            }
            this.dataService.alertData(data)
          }
        )
      },
      reason => {}
    )
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
      ////console.log(item)
      this.modalReference.componentInstance.data = item
      this.modalReference.result.then(
        result => {
          ////console.log(result)
        },
        reason => {}
      )
    }
  }

  /**
   * Like Photos
   */
  likePhotos(item) {
    if (!this.authUserDetails) {
      this.router.navigate(['/sign-up'])
    } else {
      this.dataService.passurLike(this.currentItemKey)

      this.data.like_status = this.data.like_status == 0 ? 1 : 0
      let data = { upload_id: this.data.id }
      this._profileService.updateLikeStatus(data).subscribe(
        (response: any) => {
          this.data.like_count = response.likeCount
          // if (this.catType == 'like') {
          //   ////console.log(this.catType, 'this.catType')
          //   // this._data.passData(this.currentItemKey)
          // }
          // this.modalService.dismissAll()
          // this._data.passData(this.currentItemKey)
        },
        error => {
          this.data.like_status = this.data.like_status == 0 ? 0 : 1
        }
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

  showImageFunction(item) {
    this.activepopup = false
    //this.dataService.passData(item)
  }

  /**
   * Open Modal
   */
  openModal(content) {
    let modalOptions: NgbModalOptions = {
      windowClass: 'info-pos'
    }
    this.modalService
      .open(content, modalOptions)
      .result.then(result => {}, reason => {})
  }

  getDates(data: any) {
    ////console.log(data)
    return moment(data).format('MMM DD, YYYY')
  }

  getColor() {
    if (this.data.colour_palette) {
      setTimeout(() => {
        this.colorPalate = JSON.parse(this.modalData.colour_palette)
      }, 1000)
    }
  }

  closeModal() {
    if (this.change) {
      // this.criticClose.emit("close");
      this.canDeactivate()
    } else {
      this.activeModal.close(); ////console.log(this.activeModal,"this.activeModal")
    }
  }

  routeTags(el,type) {
    this.modalService.dismissAll()
    this.router.navigate(['search-photos', type, el])
  }

  openInfoModal() {
    this.modalReference = this.modalService.open(CritiqueInfoComponent, {
      windowClass: 'modal-md'
    })
  }

  infoModal(type) {
    const modalRef = this.modalService.open(CritiqueComponentInfoComponent)
    modalRef.componentInstance.type = type
  }

  infoCollectiveModal() {
    const modalRef = this.modalService.open(CollectiveScoreInfoComponent)
  }


  ngOnDestroy(): void {
    if (this.criticSuccess) { //console.log("succeesss")
      this.removeCritic.emit({id:this.modalData.id});
      this.dataService.removeCritic(this.modalData.id);
     }
  }

}
