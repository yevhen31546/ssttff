import { Inject } from '@angular/core';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Title } from '@angular/platform-browser';
import { environment } from './../../../../environments/environment'
import { AwardHistoryComponent } from './../../shared/award-history/award-history.component'
import { ShareModalComponent } from './../../shared/share-modal/share-modal.component'
import { CriticsComponent } from './../../profile/critics/critics.component'
import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  HostListener,
  ChangeDetectorRef,
  OnDestroy,Optional
} from '@angular/core'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Masonry, MasonryGridItem, MasonryOptions } from 'ng-masonry-grid' // import necessary datatypes
import { ProfileService } from '../../profile/profile.service'
import { PhotoEssayAddModalComponent } from './../../photo-essay/photo-essay-add-modal/photo-essay-add-modal.component'
import { ActivatedRoute, Router } from '@angular/router'
import { PhotoEssayListModalComponent } from '../../photo-essay/photo-essay-list-modal/photo-essay-list-modal.component'
import { CollectionsListModalComponent } from '../../collections/collections-list-modal/collections-list-modal.component'
import { PhotoEssayService } from '../../photo-essay/photo-essay.service'
import { DataService } from '../../../_services'
import { CollectionsService } from '../../collections/collections.service'
import { ImageGridModalComponent } from '../../shared/image-grid-modal/image-grid-modal.component'
import { NgxMasonryOptions } from 'ngx-masonry'
import { Location } from '@angular/common';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  public myOptions: NgxMasonryOptions = {
    transitionDuration: '0.8s'
  }
  modalReference: any = false
  currentItemKey: number
  isShowNext: boolean = true
  isShowPre: boolean = true
  _masonry: Masonry
  masonryItems: any
  modalShow: boolean = false
  closeButton: Boolean = false
  authUserDetails: any
  isAuthUser: boolean = false
  offset: number = 100
  containerWidth: number
  currentItemWidth: number = 360
  innerWidth: number
  currentPage: number = 1
  currentSearchPage: number = 1
  emptyStatus: boolean = false;
  openImageModal: Boolean = false;

  userPhotos: any = []
  @Input() userId: any
  @Input() name: any
  @Input() searchTerm: any;
  showPaginationLoader: boolean = false
  paginationStatus: boolean = true
  isShowDropdown: Boolean = false
  showGrid: Boolean = false
  showOpacity: any = []
  glideLength: number = environment.GLIDE_SIZE;
  removeCritic: Number = 0;

  @ViewChild('container')
  public container: ElementRef
  OwnPhotos: boolean;
  redirectUrl : string;
  ratioVal: any;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.containerWidth = this.window.innerWidth
    ////console.log(this.containerWidth)
  }
  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private profileservice: ProfileService,
    private modalService: NgbModal,
    private modalActiveService: NgbActiveModal,
    private profileService: ProfileService,
    private photoEssayService: PhotoEssayService,
    private collectionService: CollectionsService,
    private router: Router,
    private dataServices: DataService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private location: Location
  ) {
    this.redirectUrl = this.router.url
  }

  ngOnInit() { //console.log(this.redirectUrl,"redirectyurl")

    
    this.showOpacity['1'] = '0'

    this.dataServices.alert.subscribe((val: any) => {
      if (val.id) {
        let id = document.getElementById('masonry-item-' + val.index)
        this.removeItem(id)
      }
    })

    this.dataServices.removeCriticBtn.subscribe((val: any) => {
        this.removeCritic = val;
    })

    this.dataServices.searchData.subscribe(data => {
      this.userPhotos = []
      this.currentPage = 1
      this.searchTerm = data
      this.getSearchUserPhotos()
    })
    this.containerWidth = this.window.innerWidth

    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.OwnPhotos = this.authUserDetails.id == this.userId ? true : false;



    }
    if (this.searchTerm) {
      this.getSearchUserPhotos()
    } else {
      if(!this.openImageModal) { //console.log("AGAIN")
      this.getUserPhotos()
      }
    }
  }


  

  // ngOnChanges(): void {
  //   //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   //Add '${implements OnChanges}' to the class.
  //   if (this.searchTerm) {
  //     this.userPhotos = []
  //     this.currentPage = 1
  //     this.getSearchUserPhotos()
  //   }
  // }

  callEvent() {
    this.getUserPhotos()
  }

  getUserPhotos() {
    let data = {
      page: this.currentPage,
      per_page: 10,
      userId: this.userId,
      currentUser: this.authUserDetails ? this.authUserDetails.id : ''
    }
    if(!this.openImageModal) {
    this.showPaginationLoader = true;
    }

    this.profileservice.getUserUploadPhotos(data).subscribe((response: any) => {
      // Append items to NgMasonryGrid

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
        if (response.photos[i].user_photo == '') {
          response.photos[i].user_photo = 'assets/images/temp/user-icon.svg'
        }
        this.userPhotos.push(photos[i])
      }
      setTimeout(() => {
        this.showOpacity[data.page] = '1'
        this.showPaginationLoader = false
      }, 500)

      //
      // this.userPhotos = this.userPhotos.concat(response.photos)

      //this.userPhotos = this.userPhotos.concat(response.photos)
    })
  }

  getSearchUserPhotos() {
    let data = {
      searchKey: this.searchTerm,
      page: this.currentPage,
      per_page: 10,
      userId: this.userId,
      type: 'photo'
    }
    this.showPaginationLoader = true

    this.profileservice.searchUserData(data).subscribe((response: any) => {
      // Append items to NgMasonryGrid
      if (this._masonry) {
        // Check if Masonry instance exists

        let photos = response.search_result
        if (photos.length == 0 && this.currentPage != 1) {
          this.emptyStatus = true
        }

        if (photos.length == 0) {
          this.paginationStatus = false
        }

        for (let i = 0; i < photos.length; ++i) {
          photos[i].page = data.page
          if (photos[i].user_photo == '') {
            photos[i].user_photo = 'assets/images/temp/user-icon.svg'
          }
          this.userPhotos.push(photos[i])
        }
        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 500)
        // this._masonry.setAddStatus('append') // set status to 'append'
        // this.userPhotos = this.userPhotos.concat(response.search_result) // some grid items: items
        this._masonry.reloadItems()
      }
      this.showPaginationLoader = false;
    })
  }

  removeItem(id) {
    ////console.log(id, 'remove item')

    if (this._masonry) {
      this._masonry
        .removeItem(id) // removeItem() expects actual DOM (ng-masonry-grid-item element)
        .subscribe((item: MasonryGridItem) => {
          // item: removed grid item DOM from NgMasonryGrid
          if (item) {
            let id = item.element.getAttribute('id') // Get id attribute and then find index
            let index = id.split('-')[2]
            // remove grid item from Masonry binding using index (because actual Masonry items order is different from this.masonryItems items)
            this.userPhotos.splice(index, 1)
            //this._masonry.reloadItems()
          }
        })
      setTimeout(() => this._masonry.reOrderItems(), 500)

      // this._masonry.reloadItems()

      // this._masonry.reOrderItems()
    }
  }

  addPixel(item) {
    let imageRatio = item.width / item.height;
    this.ratioVal = (imageRatio) < 1.8 ? '360px' : Math.round((imageRatio*360)/1.8)+'px' ;
    return (item.height / item.width) * 100 + '%'
  }

  getAspectHeight(height, width) {
    let aspectRatio = width / height
    let heightT = this.currentItemWidth / aspectRatio
    return heightT >= 540 ? 500 : heightT
  }

  // Get ng masonry grid instance first
  onNgMasonryInit($event: Masonry) {
    this._masonry = $event
  }

  completeLayout($event) {}

  pageChanged() {
    //this._masonry.setAddStatus('append') // set status to 'append'
    if (this.paginationStatus == true) {
      this.currentPage = this.currentPage + 1
      if (this.searchTerm) {
        this.getSearchUserPhotos()
      } else {
        this.showOpacity[this.currentPage] = '0'
        this.getUserPhotos()
      }
    }
  }

  doSomething(a) {

  }

  openModal(content, item, i) { //console.log(item,"image");
    this.openImageModal = true;
    this.showPaginationLoader = false;

    this.closeButton = true
    this.modalReference = this.modalService.open(ImageGridModalComponent, {
      windowClass: 'critic-cls popup-shimmer',
      centered: true,
      backdrop: 'static'
    })
    this.modalReference.componentInstance.data = item
    this.modalReference.componentInstance.currentItemKey = i
    this.modalReference.componentInstance.imgDetails = this.userPhotos;

    
    this.location.go(`photo/${item.share_id}`);
    
    this.modalReference.result.then(
      result => {
        this.location.go(this.redirectUrl);
        this.openImageModal = false;
      if (this.authUserDetails) {
        this.titleService.setTitle(
          this.authUserDetails.first_name +
            ' ' +
            this.authUserDetails.last_name +
            ' | Shoot The Frame'
        );
      }
        // ////console.log(result)
      },
      reason => {}
    )
    ////console.log(this.modalService)
  }
  /**Modal Box Functionality */

  closeModal() { //console.log(this.redirectUrl,"this.redirectUrl")
  this.location.go(this.redirectUrl);
  this.closeButton = false
  this.modalService.dismissAll()
  this.modalReference.close();
    //this.modalActiveService.dismiss()
    //this.clearJobzoneCreate();
  }

  /**
   *
   * Photo Essay
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

  // removeEssayPhoto(id) {
  //   let data = {
  //     upload_id: id,
  //     photo_essay_id: this.identifyDetails.id,
  //     status: 0
  //   }
  //   this.photoEssayService
  //     .addUploadsEssayData(data)
  //     .subscribe((response: any) => {
  //       this.dataServices.alertData(response)
  //     })
  // }
  /**
   *
   * Photo Essay
   */

  /**
   *collection
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

  // removeCollectionPhoto(id) {
  //   let data = {
  //     upload_id: id,
  //     collection_id: this.identifyDetails.id,
  //     status: 0
  //   }
  //   ////console.log(data)
  //   this.collectionService
  //     .addUploadsCollectionData(data)
  //     .subscribe((response: any) => {
  //       this.dataServices.alertData(response)
  //     })
  // }
  /**
   * End collection
   */

  // getUserImageDetails(imageId) {
  //   this.layoutLoaderService.display()
  //   let data = { id: imageId }
  //   this.profileService.getUserImageData(data).subscribe((response: any) => {
  //     this.layoutLoaderService.hide()
  //     this.currentItem = response.uploadDetails
  //   })
  // }

  /**
   * Like Photos
   */
  likePhotos(item) {
    if (!this.authUserDetails) {
      this.router.navigate(['/sign-up'])
    } else {
      item.like_status = item.like_status == 0 ? 1 : 0
      let data = { upload_id: item.id }
      this.profileService.updateLikeStatus(data).subscribe(
        (response: any) => {
          item.like_count = response.likeCount
        },
        error => {
          item.like_status = item.like_status == 0 ? 0 : 1
        }
      )
    }
  }

  showProfile(username) {
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

  crticPopup(content, item, i) {
    this.closeButton = true

    const modalRef = this.modalService.open(CriticsComponent, {
      windowClass: 'critic-cls popup-shimmer',
      backdrop: 'static'
    })
    modalRef.componentInstance.modalData = item
    modalRef.componentInstance.currentItemKey = i
    modalRef.componentInstance.imgDetails = this.userPhotos;
    modalRef.componentInstance.removeCritic.subscribe(res => {
      this.removeCritic = res.id ;
    });
    modalRef.result
      .then(result => {
        //console.log(result,"erwsulttt")
      })
      .catch(error => {
        ////console.log(error)
      })
  }

  /**
   * Emit for pagination
   */
  // appendItems() {
  //   this.appendAlert.emit()
  // }

  close() {
    this.modalService.dismissAll()
  }

  // submitStfAwards(item: any) {
  //   this.modalService.dismissAll()
  //   this.router.navigate(['user/upload-photo/submit-stf-awards', item.id])
  // }

  /**
   * Submit StF Awards
   */
  submitStfAwards(data: any) {
    // this.modalService.dismissAll();
    if (data.finalist > 0) {
      const error = {
        title: 'Photo already submitted',
        message: 'The photo is currently submitted',
        type: 'stfawarderror'
      }
      this.dataServices.alertData(error)
    }
    if (data.stf_entry > 0 && data.finalist == 0 && data.winner == 0) {
      const error = {
        title: 'Photo already submitted',
        message:
          'The photo is currently submitted into the STF Awards. You are not able to submit a photo twice in the same month.',
        type: 'stfawarderror'
      }
      this.dataServices.alertData(error)
    } else if (data.finalist > 0) {
      const error = {
        title: 'Unable to submit photo',
        message:
          'You are not able to submit this photo into the STF Awards because it has previous been a finalist or a winner.',
        type: 'stfawarderror'
      }
      this.dataServices.alertData(error)
    } else {
      this.router.navigate(['user/upload-photo/submit-stf-awards', data.id])
    }
  }

  share(imageDetails, item, i, type) {
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

  awardHistoryModal(item) {
    this.modalReference = this.modalService.open(AwardHistoryComponent, {
      centered: true
    })
    this.modalReference.componentInstance.historyId = item.id
    this.modalReference.result.then(result => {}, reason => {})
  }

  showDropDown() {
    this.isShowDropdown = true
  }

  updateAdultContent(item) {
    item.adult_content = 0
  }

  uploadSection() {
    this.router.navigate(['user/upload-photo'])
  }
}
