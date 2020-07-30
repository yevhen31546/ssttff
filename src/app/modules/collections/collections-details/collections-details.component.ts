import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Title } from '@angular/platform-browser'
import { CriticsComponent } from './../../profile/critics/critics.component'
import { CollectionsListModalComponent } from './../collections-list-modal/collections-list-modal.component'
import { ShareModalComponent } from './../../shared/share-modal/share-modal.component'
import { Component, OnInit, Input , Inject,Optional} from '@angular/core';
import { CollectionsService } from '../collections.service'
import { ActivatedRoute, Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CollectionsEditModalComponent } from '../collections-edit-modal/collections-edit-modal.component'
import { CollectionsDeleteComponent } from '../collections-delete/collections-delete.component'
import { DataService, AlertService } from '../../../_services'
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'
import { ImageGridModalComponent } from '../../shared/image-grid-modal/image-grid-modal.component'
import { Location } from '@angular/common'
import { ProfileService } from '../../profile/profile.service'
@Component({
  selector: 'app-collections-details',
  templateUrl: './collections-details.component.html',
  styleUrls: ['./collections-details.component.scss']
})
export class CollectionsDetailsComponent implements OnInit {
  collectionDet: any
  collectionId: any
  userPhotos: any = []
  identifyType: any = 'collection_details'
  modalReference: any = false
  authUserDetails: any
  isOwnCollection: boolean = false
  currentItemWidth: number
  _masonry: Masonry
  masonryItems: any
  currentPage: number = 1
  showLoader: any = false
  isAlert: any = false
  @Input() shareCollection: any = false
  showPaginationLoader: boolean = true
  showOpacity: any = []
  userId: any
  closeButton: boolean = false
  emptyStatus: boolean = false
  paginationStatus: boolean = true
  @Input() shareCollectionId: any = '';
  removeCriticBtn: Number = 0;

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private collectionsService: CollectionsService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private _dataService: DataService,
    private alertService: AlertService,
    private _location: Location,
    private profileService: ProfileService,
    private _title: Title
  ) {}

  ngOnInit() {
    this.showOpacity[this.currentPage] = '0'
    // this.showLoader = true
    this.collectionId = this.shareCollectionId
      ? this.shareCollectionId
      : this.route.snapshot.params.id
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.userId = this.authUserDetails.id
    }

    this._dataService.alert.subscribe((val: any) => {
      this.isAlert = true
      if (val.type == 'success') {
        this.alertService.success(val.title, val.message)
      } else {
        this.alertService.error(val.title, val.message)
      }
    //  this.getCollectionImages()
   //   this.getCollectionDetails()
    })

    this._dataService.reload.subscribe((val: any) => {
      this.collectionId = val // ////console.log(val, 'shatreval')
      this.userPhotos = []
      this.currentPage = 1
      this.getCollectionImages()
      this.getCollectionDetails()
    })

    if (!this.isAlert) {
      this.getCollectionDetails()
      this.getCollectionImages()
    }
  }

 

  addPixel(item) {
    return (item.height / item.width) * 100 + '%'
    // let aspectRatio = item.width / item.height
    // let heightT = this.currentItemWidth / aspectRatio
    // item.current_height = heightT
    //  return heightT + 'px'
  }

  // Get ng masonry grid instance first
  onNgMasonryInit($event: Masonry) {
    this._masonry = $event
    //this.showPaginationLoader = true
  }

  completeLayout($event) {
    //this.showPaginationLoader = false
    //this._masonry.reloadItems()
    //this.loaderService.hide()
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

  getCollectionDetails() {
    let data = { collection_id: this.collectionId }
    this.collectionsService
      .getCollectionDetails(data)
      .subscribe((response: any) => {
        this.showLoader = false
        this.collectionDet = response.collections
      console.log(this.collectionDet)
        this._title.setTitle(
          this.collectionDet.title +
            ' by ' +
             this.collectionDet.name +
            // this.authUserDetails.first_name +
            // this.authUserDetails.last_name +
            ' | Shoot The Frame'
        )
        if (
          this.authUserDetails &&
          this.authUserDetails.id == this.collectionDet.user_id
        ) {
          this.isOwnCollection = true
        }
      })
  }

  getCollectionImages() {
    this.showPaginationLoader = true;
    this.paginationStatus = true;
    let data = {
      collection_id: this.collectionId,
      per_page: 10,
      page: this.currentPage
    }
    this.collectionsService
      .getCollectionImages(data)
      .subscribe((response: any) => {
        console.log( response.photos,this.userPhotos)
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
        for (let i = 0; i < photos.length; ++i) {
          response.photos[i].page = data.page
          response.photos[i].own_photo =
            response.photos[i].user_id == this.userId ? 1 : 0
          this.userPhotos.push(photos[i])
        }
        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 500)
      },
      error => {
        this.showPaginationLoader = false
      })
  }

  pageChanged() {
    if (this.paginationStatus == true) {
      this.currentPage = this.currentPage + 1
      this.showOpacity[this.currentPage] = '0'
      this.getCollectionImages()
    }
  }

  editCollection() {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(
      CollectionsEditModalComponent,
      {
        windowClass: 'modal-md'
      }
    )
    this.modalReference.componentInstance.data = this.collectionDet
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
      this.getCollectionDetails()
    })
    this.modalReference.result.then(
      result => {
        ////console.log(result)
      },
      reason => {}
    )
  }

  deleteCollection() {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(CollectionsDeleteComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = this.collectionDet
    this.modalReference.componentInstance.redirect.subscribe((res: any) => {
      this.localStorage.setItem('deleteMessage', JSON.stringify(res))
      this._location.back()
      //this.router.navigate(['explore/collections'])
      // if (res == 'delete') {
      //   this.router.navigate(['profile/' + this.authUserDetails.username])
      // }
    })
    this.modalReference.result.then(
      result => {},
      reason => {
        // this.router.navigate(['explore/collections'])
      }
    )
  }

  openModal(content) {
    this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(result => {}, reason => {})
  }

  openMasonryModal(content, item, i) {
    this.showLoader = false;
    this.showPaginationLoader = false;
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

        if (this.authUserDetails) {
          this._title.setTitle(
            this.collectionDet.title +
              ' by ' +
              this.authUserDetails.first_name +
              this.authUserDetails.last_name +
              ' | Shoot The Frame'
          )
        }
      },
      reason => {}
    )

  }

  closeModal() {
    this.closeButton = false

    if (this.modalReference) {
      this.modalReference.close()
    }
  }

  showProfile(username) {
    this.modalService.dismissAll()

    this.router.navigate( [ '@' + username])
  }

  setCollectionCover(id) {
    let data = { upload_id: id, collection_id: this.collectionDet.id }
    this.collectionsService.setCollectionCover(data).subscribe(
      (response: any) => {
        let dataAlert = {
          type: 'success',
          title: 'Cover photo updated',
          message: 'A new photo has been set as your collection cover.'
        }
        this._dataService.alertData(dataAlert)
       this.userPhotos = []
       this.currentPage = 1
       this.getCollectionImages()
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

  removeCollectionPhoto(id, i) {
    let data = {
      upload_id: id,
      collection_id: this.collectionDet.id,
      status: 0
    }
    ////console.log(data)
    this.collectionsService
      .addUploadsCollectionData(data)
      .subscribe((response: any) => {
        ////console.log()
        response.type = 'success'
        // this._dataService.alertData(response);
        // this.spliceData(i);
        this.alertService.success(response.title, response.message)
      })
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
            let index = id.split('-')[2]
            this.userPhotos.splice(index, 1)
            this.removeCollectionPhoto(itemId, i)
            this.getCollectionDetails()
          }
        })
    }
  }

  share() {
    const modalRef = this.modalService.open(ShareModalComponent)
    modalRef.componentInstance.item = this.collectionDet
    modalRef.componentInstance.type = 'collection'
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
      this.modalReference.componentInstance.data = item
      this.modalReference.result.then(
        result => {
          ////console.log(result)
        },
        reason => {
          ////console.log(reason)
        }
      )
    }
  }
  crticPopup(content, item, i) {
    const modalRef = this.modalService.open(CriticsComponent, {
      windowClass: 'critic-cls popup-shimmer'
    })
    modalRef.componentInstance.modalData = item
    modalRef.componentInstance.currentItemKey = i;
    modalRef.componentInstance.removeCritic.subscribe(res => {
      this.removeCriticBtn = item.id ;
    });
    modalRef.result
      .then(result => {})
      .catch(error => {
        ////console.log(error)
      })
    modalRef.componentInstance.modalData = item
    modalRef.componentInstance.currentItemKey = i
    modalRef.result
      .then(result => {})
      .catch(error => {
        ////console.log(error)
      })
  }

  editPhoto(id: any) {
    this.localStorage.setItem('subjectId', id)
    this.router.navigate(['user/upload-photo/details'])
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

  updateAdultContent(item) {
    item.adult_content = 0
  }
}
