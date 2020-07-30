import { Inject } from '@angular/core';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { environment as env } from './../../../../environments/environment';
import { Meta, Title } from '@angular/platform-browser'
import { AwardHistoryComponent } from './../award-history/award-history.component'
import { ShareModalComponent } from './../share-modal/share-modal.component'
import { AlertService } from './../../../_services/alert.service'
import { DataService } from './../../../_services/data.service'
import { CriticsComponent } from './../../profile/critics/critics.component'
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit,
  ElementRef,Optional
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ProfileService } from '../../profile/profile.service'
import { CollectionsListModalComponent } from '../../collections/collections-list-modal/collections-list-modal.component'
import { PhotoEssayListModalComponent } from '../../photo-essay/photo-essay-list-modal/photo-essay-list-modal.component'
import {
  NgbModal,
  NgbModalRef,
  NgbActiveModal,
  NgbModalOptions
} from '@ng-bootstrap/ng-bootstrap'
import * as moment from 'moment'
import { CollectiveScoreInfoComponent } from '../../../modals/collective-score-info/collective-score-info.component'
import * as MobileDetect from 'mobile-detect'
import { Location } from '@angular/common';

@Component({
  selector: 'app-modal-top',
  templateUrl: './modal-top.component.html',
  styleUrls: ['./modal-top.component.css']
})
export class ModalTopComponent implements OnInit, AfterViewInit {
  @Input() data: any = ''
  @Input() imgDetails: any = ''
  @Input() currentItemKey: any = ''
  @Input() addCritic: boolean
  @Input() catType: any
  @ViewChild('abandonContent') abandonContent
  modalReference: any = false
  @ViewChild('uploadMedia') uploadMedia
  @Output('criticClose') criticClose: EventEmitter<any> = new EventEmitter()
  @Input() change: any = false

  imageSlides: any
  nextImage: any
  currentImage: any
  currentItem: any
  preImage: any
  isShowNext: boolean = true
  isShowPre: boolean = true
  isShowDropDown: boolean = false
  authUserDetails: any = []
  isAuthUser: boolean = false
  deactivateGuard: Boolean = false
  modalRef: NgbModalRef
  colorPalate: any
  @Output('dataChange') dataChange: EventEmitter<any> = new EventEmitter<any>()
  @Output('criticPopup') criticPopup: EventEmitter<any> = new EventEmitter<
    any
  >()
  mobile: any = ''
  batchDate: any = '2019-02-30 23:59:59';
  lastIndex: any = 2100;


  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private router: Router,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private _data: DataService,
    private activeModal: NgbActiveModal,
    private _eref: ElementRef,
    private meta: Meta,
    private title: Title,
    private dataService: DataService,
    private titleService: Title,
    private location: Location,

  ) {}

  ngOnInit() {
    //console.log(this.addCritic, 'addcritic')
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true
    }
    this.titleService.setTitle(
      this.imgDetails[this.currentItemKey].title +
        ' by ' +
        this.imgDetails[this.currentItemKey].name +
        ' | Shoot The Frame'
    )
    this._data.critic.subscribe(res => {
      this.crticPopupEvent(res)
    })
    this.getColor()
    this.isShowNext = true
    this.isShowPre = true

    if (!this.imgDetails[this.currentItemKey + 1]) {
      this.isShowNext = false
    }
    if (!this.imgDetails[this.currentItemKey - 1]) {
      this.isShowPre = false
    }

    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.isAuthUser =
        this.authUserDetails.id === this.data.user_id ? true : false
    }
  }

  ngAfterViewInit(): void {
    // setTimeout(function() {
    //   document.getElementsByTagName('ngb-modal-window')[0].scrollTop = 0;
    // }.bind(this), 0);
  }

  showImageFunction(item) {
    this.dataService.passImgageData(item)
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

  /**Modal Box Functionality */
  imageNextFn() {
    this.isShowNext = true
    this.isShowPre = true
    this.currentItemKey = this.currentItemKey + 1
    this.data = this.imgDetails[this.currentItemKey]; //console.log(this.data)
    this.location.go(`/photo/${this.data.share_id}`)
    if (!this.imgDetails[this.currentItemKey + 1]) {
      this.isShowNext = false
    }
    if (!this.imgDetails[this.currentItemKey - 1]) {
      this.isShowPre = false
    }
    this.data.currentItemKey = this.currentItemKey
    this.dataChange.emit(this.data)
    this.titleService.setTitle(
      this.imgDetails[this.currentItemKey].title +
        ' by ' +
        this.imgDetails[this.currentItemKey].name +
        ' | Shoot The Frame'
    )
  }

  imagePreFn() {
    this.isShowNext = true
    this.isShowPre = true
    this.currentItemKey = this.currentItemKey - 1;
    this.data = this.imgDetails[this.currentItemKey];
    this.location.go(`/photo/${this.data.share_id}`)
    if (!this.imgDetails[this.currentItemKey + 1]) {
      this.isShowNext = false
    }
    if (!this.imgDetails[this.currentItemKey - 1]) {
      this.isShowPre = false
    }
    this.data.currentItemKey = this.currentItemKey
    this.dataChange.emit(this.data)
    this.titleService.setTitle(
      this.imgDetails[this.currentItemKey].title +
        ' by ' +
        this.imgDetails[this.currentItemKey].name +
        ' | Shoot The Frame'
    )
  }

  /**
   * Like Photos
   */
  likePhotos(item) {
    if (this.authUserDetails.length === 0) {
      this.modalService.dismissAll()
      this.router.navigate(['/sign-up'])
    } else {
      this._data.passurLike(this.currentItemKey)

      this.data.like_status = this.data.like_status == 0 ? 1 : 0
      let data = { upload_id: this.data.id }
      this.profileService.updateLikeStatus(data).subscribe(
        (response: any) => {
          this.data.like_count = response.likeCount
          if (this.catType == 'like') {
            ////console.log(this.catType, 'this.catType')
            // this._data.passData(this.currentItemKey)
          }
          // this.modalService.dismissAll()
          // this._data.passData(this.currentItemKey)
        },
        error => {
          this.data.like_status = this.data.like_status == 0 ? 0 : 1
        }
      )
    }
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
   * Submit StF Awards
   */
  submitStfAwards(data: any) {
    this.modalService.dismissAll()
    if (this.data.finalist > 0) {
      const error = {
        title: 'Photo already submitted',
        message: 'The photo is currently submitted',
        type: 'stfawarderror'
      }
      this._data.alertData(error)
    }
    if (this.data.stf_entry > 0) {
      const error = {
        title: 'Photo already submitted',
        message:
          'The photo is currently submitted into the STF Awards. You are not able to submit a photo twice in the same month.',
        type: 'stfawarderror'
      }
      this._data.alertData(error)
    } else if (this.data.finalist > 0) {
      const error = {
        title: 'Unable to submit photo',
        message:
          'You are not able to submit this photo into the STF Awards because it has previous been a finalist or a winner.',
        type: 'stfawarderror'
      }
      this._data.alertData(error)
    } else {
      this.router.navigate([
        'user/upload-photo/submit-stf-awards',
        this.data.id
      ])
    }
  }

  /**
   * Delete photo
   */

  deletePhoto(content) {
    this.modalService.open(content).result.then(
      result => {
        ////console.log(result)
        this.profileService.deletePhotoDetails(this.data.id).subscribe(
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
              this._data.alertData(data)
              //  this.showProfile(this.data.username);
            } else {
              res.delete = false
              this.modalService.dismissAll()
              let data = {
                title: res.title,
                message: res.message,
                type: 'info'
              }
              this._data.alertData(data)
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
            this._data.alertData(data)
          }
        )
      },
      reason => {}
    )
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

  crticPopup() {
    this.setTitle()
    this.criticPopup.emit(this.data)
    // this.modalService.dismissAll()
    // const modalRef = this.modalService.open(CriticsComponent, {
    //   windowClass: 'critic-cls popup-shimmer',
    //   backdropClass: 'hidden'
    // })
    // modalRef.componentInstance.modalData = this.data
    // modalRef.componentInstance.imgDetails = this.imgDetails
    // modalRef.componentInstance.currentItemKey = this.currentItemKey
    // modalRef.result
    //   .then(result => {})
    //   .catch(error => {
    //     ////console.log(error)
    //   })
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
            this.modalService.dismissAll()
            resolve(true)
          },
          reason => {
            this.deactivateGuard = false
            resolve(false)
          }
        )
      })
      return promise
    }
  }

  getColor() {
    if (this.data.colour_palette) {
      setTimeout(() => {
        this.colorPalate = JSON.parse(this.data.colour_palette)
      }, 1000)
    }
  }

  closeModal() {
    if (this.change) {
      // this.criticClose.emit("close");
      this.canDeactivate()
    } else {
      this.activeModal.close()
    }
  }

  /**
   *
   * @param photo_id
   */
  addPhotoEssay(item) {
    this.modalReference = this.modalService.open(PhotoEssayListModalComponent, {
      windowClass: 'modal-md'
    })
    ////console.log(item)
    this.modalReference.componentInstance.data = item
    this.modalReference.result.then(
      result => {
        ////console.log(result)
      },
      reason => {}
    )
  }

  /**
   *collection pop up
   * @param photo_id
   */
  addCollections(item) {
    ////console.log(this.authUserDetails.length)
    if (this.authUserDetails.length == 0) {
      this.modalService.dismissAll()
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

  getDates(data: any) {
    ////console.log(data)
    return moment(data).format('MMM DD, YYYY')
  }

  sharePhoto() {
    this.window.open(
      'http://www.facebook.com/sharer/sharer.php?u=https://stf-frontend.cubettech.in/profile/@ansa123'
    )
  }

  crticPopupEvent(data: any) {
    this.data = data.data
    this.imgDetails = data.imgDetails
    this.currentItemKey = data.currentItemKey
    this.crticPopup()
  }

  routeSearch(element, type) {
    this.modalService.dismissAll()
    this.router.navigate(['search-photos', type, element])
    //this.router.navigate(['tags', element])
  }

  shareImage(item, type) {
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

  // submitStfAwards(item: any) {
  //   this.modalService.dismissAll()
  //   this.router.navigate(['user/upload-photo/submit-stf-awards', item.id])
  // }

  awardHistoryModal(item) {
    this.modalReference = this.modalService.open(AwardHistoryComponent, {
      centered: true
    })
    this.modalReference.componentInstance.historyId = item.id
    this.modalReference.result.then(result => {}, reason => {})
  }

  updateAdultContent(item) {
    item.adult_content = 0
  }

  infoCollectiveModal() {
    const modalRef = this.modalService.open(CollectiveScoreInfoComponent)
  }

  setTitle() {
    if (this.authUserDetails) {
      this.titleService.setTitle(
        'Critique Photo | ' +
          this.imgDetails[this.currentItemKey].title +
          ' by ' +
          this.authUserDetails.first_name +
          this.authUserDetails.last_name +
          ' | Shoot The Frame'
      )
    }
  }
}
