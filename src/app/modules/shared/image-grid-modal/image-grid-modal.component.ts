import { DataService } from './../../../_services/data.service'
import { LayoutLoaderService } from './../../../_services/layout-loader.service'
import { LayoutLoaderComponent } from './../../../_components/layout-loader/layout-loader.component'
import { CriticsComponent } from './../../profile/critics/critics.component'
import {
  Component,
  OnInit,
  Input,
  AfterContentInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ProfileService } from '../../profile/profile.service'
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap'
import { PhotoUploadService } from '../../photo-upload/photo-upload.service'
import { EventEmitter } from '@angular/core'
import { Output } from '@angular/core'
import * as MobileDetect from 'mobile-detect'

@Component({
  selector: 'app-image-grid-modal',
  templateUrl: './image-grid-modal.component.html',
  styleUrls: ['./image-grid-modal.component.css']
})
export class ImageGridModalComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: any
  @Input() imgDetails: any
  @Input() currentItemKey: any
  @Input() catType: any
  @ViewChild('sectionNeedToScroll') sectionNeedToScroll: ElementRef
  @Output() like: EventEmitter<any> = new EventEmitter()
  @Output() criticImages: EventEmitter<any> = new EventEmitter()
  @Output() removeCritic: EventEmitter<any> = new EventEmitter()
  @ViewChild('scrollElement')
  inputScrollRef: ElementRef
  closeButton: Boolean = false
  showPaginationLoader: boolean = true;
  criticStatus: Boolean = false;

  imageSlides: any
  nextImage: any
  currentImage: any
  currentItem: any
  preImage: any
  isShowNext: boolean = true
  isShowPre: boolean = true
  isShowDropDown: boolean = false
  authUserDetails: any
  isAuthUser: boolean = false
  activepopup: boolean = false
  type = 'common'
  modalReference: any = false
  @ViewChild('scrollContainer')
  public scrollContainer: ElementRef
  criticDatas: any = []
  minHeight: any = ''
  likePhoto: any = true
  likeValue: any = 0
  fromModal: any = false
  showImageModal: number = 0
  mobile: Boolean = false
  tabSelection: any
  removeCriticBtn: Number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private dataService: DataService,
    private photoUploadService: PhotoUploadService,
    private layoutloaderservice: LayoutLoaderService,
    private scrollElement: ElementRef
  ) {}

  ngOnInit() {
    this.showPaginationLoader = true
    if (this.data) {
      this.showPaginationLoader = false
    }

    const md = new MobileDetect(window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true
    }
    this.activepopup = true
    this.dataService.share.subscribe((val: any) => {
      ////console.log(val)
      this.likePhoto = true
      this.likeValue = val
      // this.dataService.passLike(val);
    })

    this.dataService.image.subscribe((val: any) => {
      setTimeout(() => {
        this.activepopup = false
        this.showImageModal = 1
      }, 1000)
    });

    this.dataService.removeCriticBtn.subscribe(res => {
      this.criticStatus = res ? true : false;
    });

    // this.dataService.getLikeData().subscribe((val: any) => { alert("image")
    //     this.dataService.passToLike(val);
    // });
    this.isShowNext = true
    this.isShowPre = true

    if (!this.imgDetails[this.currentItemKey + 1]) {
      this.isShowNext = false
    }
    if (!this.imgDetails[this.currentItemKey - 1]) {
      this.isShowPre = false
    }

    if (localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(localStorage.getItem('user'))
      this.isAuthUser = this.authUserDetails.id == this.data.id ? true : false
    }

    this.getCriticsList()
    this.updatePhotoViews()
    // setTimeout(() => {
    //   this.activepopup = false
    // }, 1000)
  }

  ngAfterViewInit() {
    // window.scrollTo(0, 0)
    // this.scrollContainer.nativeElement.scrollTop = 0
    // const doc = document.getElementById('story-tab-panel')
    // setTimeout(function() {
    //   this.minHeight = doc.clientHeight
    // }, 0)
  }

  getCriticsList() {
    const id = this.authUserDetails ? this.authUserDetails.id : '';
    this.profileService.getCritics(this.data.id, id).subscribe((res: any) => {
      // this.subPlan = res.uploads.subscription_plan;
      this.criticDatas = res.uploads.critique;
      this.criticStatus = res.uploads.critique_status == 1 ? true : false;
    })
  }

  updatePhotoViews() {
    let data = { upload_id: this.data.id }
    this.profileService.updatePhotoViewsData(data).subscribe((res: any) => {})
  }

  /**
   * show profile of user
   * @param username
   */
  showProfile(username) {
    this.modalService.dismissAll()
    this.router.navigate( [ '@' + username])
  }

  addPixel(height) {
    return height + 'px'
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
    this.activepopup = true
    this.isShowNext = true
    this.isShowPre = true
    this.currentItemKey = this.currentItemKey + 1
    this.data = this.imgDetails[this.currentItemKey]
    if (!this.imgDetails[this.currentItemKey + 1]) {
      this.isShowNext = false
    }
    if (!this.imgDetails[this.currentItemKey - 1]) {
      this.isShowPre = false
    }
    // setTimeout(() => {
    //   this.activepopup = false
    // }, 1000)
  }

  imagePreFn() {
    this.activepopup = true
    this.isShowNext = true
    this.isShowPre = true
    this.currentItemKey = this.currentItemKey - 1
    this.data = this.imgDetails[this.currentItemKey]
    if (!this.imgDetails[this.currentItemKey + 1]) {
      this.isShowNext = false
    }
    if (!this.imgDetails[this.currentItemKey - 1]) {
      this.isShowPre = false
    }
    // setTimeout(() => {
    //   this.activepopup = false
    // }, 1000)
  }

  /**
   * Data change
   * @param $data
   */
  dataChangeEvent($eventData) {
    this.activepopup = true
    this.showImageModal = 0
    // this.photoUploadService.getPhotoDetails($eventData.id).subscribe(
    //   (response: any) => {
    //     this.data = response.uploadDetails
    //     this.currentItemKey = $eventData.currentItemKey
    //     this.activepopup = false
    //   },
    //   error => {}
    // )
    this.data = $eventData
    this.currentItemKey = $eventData.currentItemKey
    // setTimeout(() => {
    //   this.activepopup = false
    // }, 1000)
  }

  /**
   * Like Photos
   */
  likePhotos(item) {
    if (this.isAuthUser == false) {
      this.router.navigate(['/sign-in'])
    } else {
      this.data.like_status = this.data.like_status == 0 ? 1 : 0
      let data = { upload_id: this.data.id }
      this.profileService.updateLikeStatus(data).subscribe(
        (response: any) => {
          this.data.like_count = response.likeCount
          //this.dataService.refreshData()
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
  editPhoto() {
    this.modalService.dismissAll()
    this.router.navigate(['user/upload-photo/details'])
  }

  /**
   * Delete photo
   */

  deletePhoto(content) {
    this.modalService.open(content).result.then(
      result => {
        this.profileService.deletePhotoDetails(this.data.id).subscribe(res => {
          this.modalService.dismissAll()
          this.showProfile(this.data.username)
        })
      },
      reason => {}
    )
  }

  /**
   * Open Modal
   */
  openModal(content) {
    this.modalService.open(content).result.then(result => {}, reason => {})
  }

  upgradePlan() {
    this.modalService.dismissAll()
    this.router.navigate(['/subscription/plans'])
  }

  crticPopup() {
    this.fromModal = true

    this.dataService.scrollUpdate()
    // this.modalService.dismissAll()
    // const modalRef = this.modalService.open(CriticsComponent, {
    //   windowClass: 'critic-cls popup-shimmer'
    // })
    // modalRef.result
    //   .then(result => {}, reason => {})
    //   .catch(error => {
    //     ////console.log(error)
    //   })
  }

  ngOnDestroy(): void {
    if (this.likePhoto) {
      this.like.emit(this.likeValue)
    }
    this.likeValue = ''
    this.likePhoto = false;
    if (this.removeCriticBtn) {
    this.removeCritic.emit({id: this.removeCriticBtn});
   }
  }

  showCriticPopup(data) {
    this.fromModal = true
    this.data = data
    this.dataService.scrollUpdate()
  }

  hideCritic() {
    this.fromModal = false;
  }

  showImageFunction(item) {
    this.dataService.passData(item)
  }

  closeModal() {
    this.closeButton = false
    if (this.modalService) {
      this.modalService.dismissAll()
    }
  }

  removeCriticData($event) {
    this.removeCriticBtn = $event.id;
  }


}
