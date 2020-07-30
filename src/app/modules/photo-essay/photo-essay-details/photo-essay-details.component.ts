import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Title } from '@angular/platform-browser'
import { AlertService } from './../../../_services/alert.service'
import { ShareModalComponent } from './../../shared/share-modal/share-modal.component'
import { CollectionsService } from './../../collections/collections.service'
import { CollectionsListModalComponent } from './../../collections/collections-list-modal/collections-list-modal.component'
import { CriticsComponent } from './../../profile/critics/critics.component'
import { Component, OnInit, Input , Inject,Optional} from '@angular/core';
import { PhotoEssayService } from '../photo-essay.service'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { PhotoEssayEditModalComponent } from '../photo-essay-edit-modal/photo-essay-edit-modal.component'
import { PhotoEssayDeleteComponent } from '../photo-essay-delete/photo-essay-delete.component'
import { DataService } from '../../../_services'
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'
import { ImageGridModalComponent } from '../../shared/image-grid-modal/image-grid-modal.component'
import { ProfileService } from '../../profile/profile.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-photo-essay-details',
  templateUrl: './photo-essay-details.component.html',
  styleUrls: ['./photo-essay-details.component.css'],
  providers: [AlertService]
})
export class PhotoEssayDetailsComponent implements OnInit {
  essayDet: any
  phtEssayId: any
  userPhotos: any = []
  identifyType: any = 'photo_essay_details'
  modalReference: any = false
  authUserDetails: any = ''
  isOwnPhotoEssay: boolean = false
  currentItemWidth: number = 360
  _masonry: Masonry
  masonryItems: any
  currentPage: number = 1
  showPaginationLoader: boolean = true
  paginationStatus: boolean = true
  // @Input() shareId: any;
  @Input() shareEssay: any = false
  userId: any = ''
  shareId: any = ''
  showLoader: any = false
  @Input() inputShareId: any = ''
  showOpacity: any = []
  closeButton: boolean = false
  emptyStatus: boolean = false;
  removeCriticBtn: Number = 0;

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private photoEssayService: PhotoEssayService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private _dataService: DataService,
    private alertService: AlertService,
    private profileService: ProfileService,
    private collectionService: CollectionsService,
    private _location: Location,
    private _title: Title
  ) {}

  ngOnInit() {
    this.showOpacity['1'] = '0'

    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.userId = this.authUserDetails.id
    }

    this.showLoader = true
    this.phtEssayId = this.inputShareId
      ? this.inputShareId
      : this.route.snapshot.params.id
    this._dataService.alert.subscribe((val: any) => {
      if (val.type == 'success') {
        this.alertService.success(val.title, val.message)
      } else if (val.type == 'info') {
        this.alertService.info(val.title, val.message)
      } else {
        this.alertService.error(val.title, val.message)
      }
    })
    this._dataService.refresh.subscribe((val: any) => {
      this.userPhotos = []
      this.currentPage = 1
      this.getPhotoEssayDetails()
      this.getPhotoEssayImages()
    })

    this._dataService.reload.subscribe((val: any) => {
      this.phtEssayId = val // ////console.log(val, 'shatreval')
      this.userPhotos = []
      this.currentPage = 1
      this.getPhotoEssayImages()
      this.getPhotoEssayDetails()

    })
    this.getPhotoEssayImages()
    this.getPhotoEssayDetails()

  }

 

  addPixel(item) {
    return (item.height / item.width) * 100 + '%'
    // let aspectRatio = width / height
    // let heightT = this.currentItemWidth / aspectRatio
    // return heightT + 'px'
  }

  // Get ng masonry grid instance first
  onNgMasonryInit($event: Masonry) {
    this._masonry = $event
  }

  completeLayout($event) {
    //this._masonry.reloadItems()
    //this.loaderService.hide()
  }

  pageChanged() {
    ////console.log(this.paginationStatus)
    if (this.paginationStatus == true) {
      this.currentPage = this.currentPage + 1
      this.showOpacity[this.currentPage] = '0'
      this.getPhotoEssayImages()
    }
  }

  getPhotoEssayDetails() {
    let data = { photo_essay_id: this.phtEssayId }
    this.photoEssayService
      .getPhotoEssayDetails(data)
      .subscribe((response: any) => {
        this.essayDet = response.essays; ////console.log(this.essayDet)
        this._title.setTitle(this.essayDet.title + ' by ' + this.essayDet.name + ' | Shoot The Frame');
        if (
          this.authUserDetails &&
          this.authUserDetails.id === this.essayDet.user_id
        ) {
          this.isOwnPhotoEssay = true
        }
      })
  }

  getPhotoEssayImages() {
    this.showPaginationLoader = true;
    this.paginationStatus = true;
    let data = {
      photo_essay_id: this.phtEssayId,
      per_page: 10,
      page: this.currentPage,
      user_id: this.userId
    }
    this.photoEssayService.getPhotoEssayImages(data).subscribe(
      (response: any) => { //console.log(response, this.userPhotos)
        //this.showLoader = false
        if (this.userPhotos.length != 0) {
          // Check if Masonry instance exists
          this._masonry.setAddStatus('append') // set status to 'append'
          // some grid items: items
        }
        // Check if Masonry instance exist
        let photos = response.photos
        if (photos.length == 0 && this.currentPage != 1) {
          this.emptyStatus = true
        }
        if (photos.length == 0) {
          this.paginationStatus = false
        }
        ////console.log(this.paginationStatus)
        for (let i = 0; i < photos.length; ++i) {
          response.photos[i].page = data.page
          this.userPhotos.push(photos[i])
        }
        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 500)
      },
      error => {
        this.showPaginationLoader = false
      }
    )
  }

  appendItems($event) {}

  /**
   * Edit Photo
   */
  editPhoto(id: any) {
    this.localStorage.setItem('subjectId', id)
    this.localStorage.setItem('updateStatus', '1')
    this.modalService.dismissAll()
    this.router.navigate(['user/upload-photo/details'])
  }

  editPhotoEssay() {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(PhotoEssayEditModalComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = this.essayDet
    this.modalReference.componentInstance.alert.subscribe(val => {
      if (val.type == 'success') {
        this.alertService.success(val.title, val.message)
      } else if (val.type == 'info') {
        this.alertService.info(val.title, val.message)
      } else if (val.type == 'stfawarderror') {
        this.alertService.warning(val.title, val.message)
      } else {
        this.alertService.error(val.title, val.message)
      }
      this.getPhotoEssayDetails()
    })
    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(result => {}, reason => {})
  }

  deletePhotoEssay() {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(PhotoEssayDeleteComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = this.essayDet
    this.modalReference.componentInstance.redirect.subscribe((res: any) => {
      if (res.type == 'success') {
        this.localStorage.setItem('deleteMessage', JSON.stringify(res))
        this._location.back()
        //this.router.navigate(['explore/photo-essays'])
        //////console.log(res)
        //this._dataService.alertData(res)
      }

      // if (res == 'delete') {
      // this.router.navigate(['explore/photo-essays'])
      // let dataAlert = {
      //   type: 'success',
      //   title: 'Saved',
      //   message: 'A new photo has been set as your photo essay cover.'
      // }
      // this._dataService.alertData(dataAlert)
      // this.router.navigate(['profile/' + this.authUserDetails.username])
      // }
    })
    this.modalReference.result.then(
      result => {},
      reason => {
        ////console.log(reason)
        //  this.router.navigate(['explore/photo-essays'])
      }
    )
  }

  openModal(content) {
    this.closeButton = true
    this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(result => {}, reason => {})
  }

  closeModal() {
    this._location.go(this.router.url);
    this.closeButton = false
    if (this.modalReference) {
      this.modalReference.close()
    }
    //this.clearJobzoneCreate();
  }

  showProfile(username) {
    this.modalService.dismissAll()
    this.router.navigate( [ '@' + username])
  }

  nFormatter(num) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'G'
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K'
    }
    return num
  }

  openMasonryModal(content, item, i) {
    this.closeButton = true
    this.modalReference = this.modalService.open(ImageGridModalComponent, {
      windowClass: 'critic-cls popup-shimmer',
      centered: true
    })
    this.modalReference.componentInstance.data = item
    this.modalReference.componentInstance.currentItemKey = i
    this.modalReference.componentInstance.imgDetails = this.userPhotos;
    this._location.go(`photo/${item.share_id}`);
    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      result => {
        this._location.go(this.router.url);
        // ////console.log(result)
        if (this.authUserDetails) {
          this._title.setTitle(this.essayDet.title + ' by ' + this.authUserDetails.first_name +' '+ this.authUserDetails.last_name + ' | Shoot The Frame');
        }
      },
      reason => {}
    )
  }

  likePhotos(item) {
    if (!this.authUserDetails) {
      this.router.navigate(['/sign-up'])
    } else {
      item.like_status = item.like_status == 0 ? 1 : 0
      let data = { upload_id: item.id }
      this.profileService.updateLikeStatus(data).subscribe(
        (response: any) => {
          //this.userPhotos = []
          item.like_count = response.likeCount
        },
        error => {
          item.like_status = item.like_status == 0 ? 0 : 1
        }
      )
    }
  }

  setCollectionCover(id) {
    let data = { upload_id: id, photo_essay_id: this.essayDet.id }
    this.collectionService.setPhotoEssayCover(data).subscribe(
      (response: any) => {
        let dataAlert = {
          type: 'success',
          title: 'Cover photo updated',
          message: 'A new photo has been set as your photo essay cover.'
        }
        this._dataService.alertData(dataAlert)
        this.userPhotos = []
        this.currentPage = 1
        this.getPhotoEssayImages()
      },
      error => {
        let dataAlert = {
          type: 'error',
          title: 'Unable to update cover photo',
          message:
            'There was a problem updating your cover photo, please try again later, or <span class="underline">contact support. </span>'
        }
        this._dataService.alertData(dataAlert)
      }
    )
  }

  removeItem(itemId, i) {
    const doc = document.getElementById('masonry-item-' + i)
    ////console.log(doc)
    if (this._masonry) {
      this._masonry
        .removeItem(doc) // removeItem() expects actual DOM (ng-masonry-grid-item element)
        .subscribe((item: MasonryGridItem) => {
          // item: removed grid item DOM from NgMasonryGrid
          if (item) {
            ////console.log(item)
            let id = item.element.getAttribute('id') // Get id attribute and then find index
            ////console.log(id)
            const index = id.split('-')[2]
            this.userPhotos.splice(index, 1)
            this.removeCollectionPhoto(itemId, i)
          }
        })
    }
  }

  removeCollectionPhoto(id, i) {
    let data = {
      upload_id: id,
      photo_essay_id: this.essayDet.id,
      status: 0
    }

    this.photoEssayService
      .addUploadsEssayData(data)
      .subscribe((response: any) => {
        this.alertService.success(response.title, response.message)
        // this._dataService.alertData(response)
      })
  }

  share() {
    const modalRef = this.modalService.open(ShareModalComponent)
    modalRef.componentInstance.item = this.essayDet
    modalRef.componentInstance.type = 'photo_essay'
    modalRef.result
      .then(result => {})
      .catch(error => {
        // ////console.log(error);
      })
  }

  crticPopup(content, item, i) {
    const modalRef = this.modalService.open(CriticsComponent, {
      windowClass: 'critic-cls popup-shimmer'
    })
    modalRef.componentInstance.modalData = item
    modalRef.componentInstance.currentItemKey = i
    modalRef.componentInstance.imgDetails = this.userPhotos;
    modalRef.componentInstance.removeCritic.subscribe(res => {
      this.removeCriticBtn = item.id ;
    });
    modalRef.result
      .then(result => {})
      .catch(error => {
        ////console.log(error)
      })
  }

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

  updateAdultContent(item) {
    item.adult_content = 0
  }
}
