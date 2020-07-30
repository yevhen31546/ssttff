import { Inject } from '@angular/core';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { AlertService } from './../../../_services/alert.service'
import { ShareModalComponent } from './../share-modal/share-modal.component'
import { CriticsComponent } from './../../profile/critics/critics.component'
import { LoaderService } from './../../../_services/loader.service'
import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  HostListener,Optional
} from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { LayoutLoaderService } from '../../../_services/layout-loader.service'
import { Masonry, MasonryGridItem } from 'ng-masonry-grid' // import necessary datatypes
import { ProfileService } from '../../profile/profile.service'
import { ImageGridModalComponent } from './../image-grid-modal/image-grid-modal.component'
import { PhotoEssayAddModalComponent } from './../../photo-essay/photo-essay-add-modal/photo-essay-add-modal.component'
import { ActivatedRoute, Router } from '@angular/router'
import { PhotoEssayListModalComponent } from '../../photo-essay/photo-essay-list-modal/photo-essay-list-modal.component'
import { CollectionsListModalComponent } from '../../collections/collections-list-modal/collections-list-modal.component'
import { PhotoEssayService } from '../../photo-essay/photo-essay.service'
import { DataService } from '../../../_services'
import { CollectionsService } from '../../collections/collections.service'
import { CritiquesService } from '../../critiques/critiques.service'
import { StfAwardEntriesService } from '../../stf-awards-entries/stf-award-entries.service'
import { HomeService } from '../../home/home.service'
import { AwardHistoryComponent } from '../award-history/award-history.component'
import { interval } from 'rxjs'
import { map } from 'rxjs/internal/operators/map'
import * as moment from 'moment';
import { environment } from './../../../../environments/environment';
import * as  MobileDetect from 'mobile-detect';
import { Location } from '@angular/common'


@Component({
  selector: 'app-image-grid',
  templateUrl: './image-grid.component.html',
  styleUrls: []
})
export class ImageGridComponent implements OnInit {
  imageSlides: any
  nextImage: any
  currentImage: any
  currentItem: any
  preImage: any
  modalReference: any = false
  currentItemKey: number
  isShowNext: boolean = true
  isShowPre: boolean = true
  _masonry: Masonry
  masonryItems: any
  modalShow: boolean = false
  isStlFinalist: boolean = true
  isStfFinalist: boolean = true
  isStwFinalist: boolean = true
  isStwWinner: boolean = true
  isStfWinner: boolean = true
  isStlWinner: boolean = true
  finalistLimit: number = 9
  winnerLimit: number = 1
  deleteId: any = ''
  _diff: any = ''
  _minutes: any = ''
  _hrs: any = ''
  maxHrs = 2
  maxMins = 0
  emptyStatus: boolean = false
  viewType: any = '';
  mobile: Boolean = false


  imgDetails: any = []
  @Input() identifyType: string
  @Input() awards: Boolean
  @Input() identifyDetails: any
  @Input() profileDetails: any
  @Input() selectedYear: any
  @Input() selectedMonth: any
  @Input() selectedCategory: any
  @Input() selectedType: any
  @Input() searchTermVal: any
  @Input() selectedWinner: any
  @Input() selectedTab: any
  closeButton: Boolean = false
  authUserDetails: any
  isAuthUser: boolean = false
  offset: number = 100
  containerWidth: number
  currentItemWidth: number = 360
  innerWidth: number
  critiques: any
  currentOwnAwardPage: number = 1
  currentAllAwardPage: number = 1
  critiquePageNumber: number = 1
  indx: number = 0
  currentCrtiqPage: number = 1
  cardGroup: any = []
  randomSelectionCount: number = environment.randomSelectionCount;
  isFilter: Boolean = false;
  showPaginationLoader: boolean = false
  paginationStatus: boolean = true
  @Output() appendAlert = new EventEmitter()
  @Output() showMessage = new EventEmitter()
  showOpacity: any = []
  user_id: any
  private _serviceSubscription
  ratioVal: any = '';

  @ViewChild('container')
  public container: ElementRef

  // @HostListener('window:resize', ['$event']);
  @ViewChild('delereCritique') delereCritique: ElementRef
  onResize(event) {
    this.containerWidth = this.window.innerWidth
    ////console.log(this.containerWidth)
  }

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private modalService: NgbModal,
    private layoutLoaderService: LayoutLoaderService,
    private loaderService: LoaderService,
    private profileService: ProfileService,
    private photoEssayService: PhotoEssayService,
    private critiqueService: CritiquesService,
    private awardService: StfAwardEntriesService,
    private collectionService: CollectionsService,
    private homeService: HomeService,
    private router: Router,
    private dataServices: DataService,
    private stfAwardEntriesService: StfAwardEntriesService,
    private alertService: AlertService,
    private location: Location
  ) {}

  ngOnInit() {
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true;
    }
    this.imgDetails = []
    this._serviceSubscription = this.dataServices.reload.subscribe(
      (val: any) => { //console.log(val, '-------reloadval')
        this.imgDetails = []
        this.selectedCategory = val.category
        this.selectedMonth = val.month
        this.selectedYear = val.year
        this.selectedType = val.tab
        this.selectedWinner = val.winnerListTab
        this.searchTermVal = val.searchItem
        this.isFilter = val.filter
        if (val.type == 'own-award-entries') {
          this.currentOwnAwardPage = 1
          this.getOwnAwardEntries()
        } else if (val.type == 'award-entries') {
          this.currentAllAwardPage = 1
          this.getAllStfAwardEntries()
        } else if (val.type == 'admin-award-entries') {
          this.currentAllAwardPage = 1
          this.getAdminAwardEntries()
        } else if (
          val.type == 'tags' ||
          val.type == 'location' ||
          val.type == 'camera'
        ) {
          this.currentAllAwardPage = 1
          this.getImages()
        }
      }
    )

    this.showOpacity['1'] = '0'

    this.containerWidth = this.window.innerWidth
    this.getCards()

    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.user_id = this.authUserDetails.id
    }
    if (this.identifyType == 'critique-given') {
      this.viewType = 'given';
      this.getCritiques(this.viewType)
    } else if (this.identifyType == 'critique-received') {
      this.viewType = 'received';
      this.getCritiques(this.viewType)
    } else if (this.identifyType == 'own-award-entries') {
      this.getOwnAwardEntries()
    } else if (this.identifyType == 'award-entries') {
      this.getAllStfAwardEntries()
    } else if (this.identifyType == 'admin-award-entries') {
      this.currentAllAwardPage = 1
      this.getAdminAwardEntries()
    } else if (
      this.identifyType == 'tags' ||
      this.identifyType == 'location' ||
      this.identifyType == 'camera'
    ) {
      this.currentAllAwardPage = 1
      this.getImages()
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._serviceSubscription.unsubscribe()
  }


  addPixel(item) {
    let imageRatio = item.width / item.height;
    this.ratioVal = (imageRatio) < 1.8 ? '360px' : Math.round((imageRatio*360)/1.8)+'px' ;
    return (item.height / item.width) * 100 + '%'

    // let aspectRatio = width / height
    // let heightT = this.currentItemWidth / aspectRatio
    // return heightT + 'px'
  }

  // Get ng masonry grid instance first
  onNgMasonryInit($event: Masonry) {
    this._masonry = $event
  }
  completeLayout($event,$items) {
    //this._masonry.reloadItems()
    //this.loaderService.hide()
  }

  getOwnAwardEntries(event: any = '') {
    //this.loaderService.display()
    this.showPaginationLoader = true

    let data = {
      page: this.currentOwnAwardPage,
      per_page: 10,
      year: this.selectedYear,
      month: this.selectedMonth,
      category_id: this.selectedCategory,
      winner: this.selectedWinner
    }
    // this.showYear = this.selectedYear == 0 ? true : false;
    // this.showMonth = this.selectedMonth == 0 ? true : false;
    // this.showCategory = this.selectedCategory == 0 ? true : false;
    this.awardService.getStfAwardData(data).subscribe((response: any) => {
      if (this.imgDetails.length != 0) {
        // Check if Masonry instance exists
        this._masonry.setAddStatus('append') // set status to 'append'
        // some grid items: items
      }
      // Check if Masonry instance exist
      let photos = response.awardEntries
      if (photos.length == 0 && this.currentOwnAwardPage != 1) {
        this.emptyStatus = true
      }
      if (photos.length == 0) {
        this.paginationStatus = false
      }
      if (photos.length == 0 && this.currentOwnAwardPage != 1) {
        this.emptyStatus = true
      }

      for (let i = 0; i < photos.length; ++i) {
        photos[i].page = data.page
        photos[i].own_photo = photos[i].user_id == this.user_id ? 1 : 0
        if (photos[i].user_photo == '') {
          photos[i].user_photo = 'assets/images/temp/user-icon.svg'
        }
        this.imgDetails.push(photos[i])
      }
      setTimeout(() => {
        this.showOpacity[data.page] = '1'
        this.showPaginationLoader = false
      }, 500)

      //this.award_entries = response.awardEntries
      // this.currentPage = this.currentPage + 1
      //this.loaderService.hide()
    })
  }

  getAdminAwardEntries() {
    this.showPaginationLoader = true
    let data = {
      page: this.currentAllAwardPage,
      per_page: 10,
      year: this.selectedYear,
      month: this.selectedMonth,
      category_id: this.selectedCategory,
      filter_type: this.selectedType,
      winner: this.selectedWinner
    }

    this.homeService.getAdminAwardEntriesData(data).subscribe(
      (response: any) => {
        // Check if Masonry instance exist
        let photos = response.awardEntries

        if (photos.length == 0 && this.currentAllAwardPage != 1) {
          this.emptyStatus = true
        }
        if (photos.length == 0) {
          this.paginationStatus = false
        }

        // ////console.log('first', this.currentAllAwardPage)
        // ////console.log(response)
        // ////console.log(photos)
        // ////console.log(this.imgDetails, this.imgDetails.length);
        this.checkButtonDisable(response.category_values);

        if((this.imgDetails.length == 0 && this.currentAllAwardPage==1) || (this.imgDetails[this.imgDetails.length-1].page != this.currentAllAwardPage)) {
          for (let i = 0; i < photos.length; i++) {
            photos[i].page = data.page;
            photos[i].own_photo = photos[i].user_id == this.user_id ? 1 : 0;
            this.imgDetails.push(photos[i]);
          }
        }

        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 1000)
        //this._serviceSubscription.unsubscribe()
      },
      error => {}
    )
  }

  checkButtonDisable(val) {
    for (let i = 0; i < val.length; ++i) {
      if (val[i].category == 1) {
        if (val[i].finalist >= this.finalistLimit) {
          this.isStfFinalist = false
        } else {
          this.isStfFinalist = true
        }
        if (val[i].winner >= this.winnerLimit) {
          this.isStfWinner = false
        } else {
          this.isStfWinner = true
        }
      }
      if (val[i].category == 2) {
        if (val[i].finalist >= this.finalistLimit) {
          this.isStlFinalist = false
        } else {
          this.isStlFinalist = true
        }
        if (val[i].winner >= this.winnerLimit) {
          this.isStlWinner = false
        } else {
          this.isStlWinner = true
        }
      }
      if (val[i].category == 3) {
        if (val[i].finalist >= this.finalistLimit) {
          this.isStwFinalist = false
        } else {
          this.isStwFinalist = true
        }
        if (val[i].winner >= this.winnerLimit) {
          this.isStwWinner = false
        } else {
          this.isStwWinner = true
        }
      }
    }
  }

  getImages() {
    this.showPaginationLoader = true
    let data = {
      searchKey: this.searchTermVal,
      page: this.currentAllAwardPage,
      per_page: 10,
      type: this.identifyType,
      userId: this.user_id,
      tab_type: this.selectedTab
    }
    this.showPaginationLoader = true

    this.profileService.searchUserData(data).subscribe(
      (response: any) => {
        // Check if Masonry instance exist
        let photos = response.search_result
        if (photos.length == 0 && this.currentAllAwardPage != 1) {
          this.emptyStatus = true
        }
        if (photos.length == 0) {
          this.paginationStatus = false
        }

        for (let i = 0; i < photos.length; ++i) {
          photos[i].page = data.page
          photos[i].own_photo = photos[i].user_id == this.user_id ? 1 : 0
          this.imgDetails.push(photos[i])
        }
        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 1000)
      },
      error => {}
    )
  }

  getAllStfAwardEntries() {
    this.showPaginationLoader = true;
    this.paginationStatus = true;

    let data = {
      page: this.currentAllAwardPage,
      per_page: 10,
      year: this.selectedYear,
      month: this.selectedMonth,
      category_id: this.selectedCategory,
      winner: this.selectedWinner
    }

    this.homeService.getStfAwardEntriesData(data).subscribe(
      (response: any) => { // console.log(response.awardEntries,"awardEntries");
        if (this.imgDetails.length != 0) {
          // Check if Masonry instance exists
          this._masonry.setAddStatus('append') // set status to 'append'
          // some grid items: items
        }
        // Check if Masonry instance exist
        let photos = response.awardEntries
        if (photos.length == 0 && this.currentAllAwardPage != 1) {
          this.emptyStatus = true
        }
        if (photos.length == 0) { // console.log(photos.length, '----lemgth')
          this.paginationStatus = false
        }

        for (let i = 0; i < photos.length; ++i) {
          var remainder = this.imgDetails.length % this.randomSelectionCount
          if (remainder == 0 && this.imgDetails.length != 0) {
            var rand = this.cardGroup[
              Math.floor(Math.random() * this.cardGroup.length)
            ]
            let randomFile = {
              photo: rand,
              type: 'learn',
              height: '720',
              width: '720',
              page: data.page,
              card: '1'
            }
            this.imgDetails.push(randomFile)
          }
          photos[i].page = data.page
          photos[i].own_photo = photos[i].user_id == this.user_id ? 1 : 0
          this.imgDetails.push(photos[i])
        }
       // console.log(this.paginationStatus, "paginationt=status")
        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 1000)
      },
      error => {}
    )
  }

  getCritiques(type,page: any = '') {
    this.showPaginationLoader = true
    let data = {
      page: page? page :this.critiquePageNumber,
      per_page: 10,
      type: type
    };
    this.critiqueService.getCritiqueData(data).subscribe((response: any) => {
      // if (this.imgDetails.length != 0) {
      //   // Check if Masonry instance exists
      //   this._masonry.setAddStatus('append') // set status to 'append'
      //   // some grid items: items
      // }
      // Check if Masonry instance exist;
      this.location.go(this.router.url);

      let photos = response.uploads;
      if (photos.length == 0 && this.critiquePageNumber != 1) {
        this.emptyStatus = true
      }
      if (photos.length == 0) {
        this.paginationStatus = false
      }

      for (let i = 0; i < photos.length; ++i) {
        photos[i].page = data.page
        photos[i].own_photo = photos[i].user_id == this.user_id ? 1 : 0
        if (photos[i].critique) {
          const critiqueTime = photos[i].critique[0].updated_at
          // ////console.log(critiqueTime)
          let date: any
          let currentTime: any
          //Date Handling
          date = moment.utc(critiqueTime)
          currentTime = moment.utc()
          interval(1000)
            .pipe(
              map(x => {
                //this._diff = currentTime - date
              })
            )
            .subscribe(x => {
              var endTime = moment.utc(critiqueTime).add(2, 'hours')
              var startTime = moment.utc()
              var duration: any = moment.duration(endTime.diff(startTime))
              photos[i]._hrs =
                duration.asHours() < 0 ? 0 : parseInt(duration.asHours())
              photos[i]._minutes =
                duration.asMinutes() < 0
                  ? 0
                  : parseInt(duration.asMinutes()) % 60
              // photos[i]._hrs = 2 - photos[i]._hrs
              // photos[i]._minutes = (120 - photos[i]._minutes) % 60

              photos[i].time_remaining =
                photos[i]._hrs + ':' + photos[i]._minutes
            })
        }
        // const time =  this.timeEditCritique(updatedAt);
        this.imgDetails.push(photos[i])
      }
      setTimeout(() => {
        this.showOpacity[data.page] = '1'
        this.showPaginationLoader = false
      }, 500)
    })
  }

  openModal(content, item, i) {
    this.showPaginationLoader = false;
    this.closeButton = true
    this.modalReference = this.modalService.open(ImageGridModalComponent, {
      windowClass: 'critic-cls popup-shimmer',
      centered: true
    })
    this.modalReference.componentInstance.data = item
    this.modalReference.componentInstance.currentItemKey = i
    this.modalReference.componentInstance.imgDetails = this.imgDetails;
    this.location.go(`photo/${item.share_id}`);
    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      result => {
        // this.getCritiques(this.viewType, 1); to avoid duplication of images
         this.location.go(this.router.url);
      },
      reason => {}
    );

  }
  /**Modal Box Functionality */

  closeModal() {
    this.closeButton = false
    if (this.modalReference) {
      this.modalReference.close()
    }
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

  removeEssayPhoto(id) {
    let data = {
      upload_id: id,
      photo_essay_id: this.identifyDetails.id,
      status: 0
    }
    this.photoEssayService
      .addUploadsEssayData(data)
      .subscribe((response: any) => {
        this.dataServices.alertData(response)
      })
  }
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

  removeCollectionPhoto(id) {
    let data = {
      upload_id: id,
      collection_id: this.identifyDetails.id,
      status: 0
    }
    ////console.log(data)
    this.collectionService
      .addUploadsCollectionData(data)
      .subscribe((response: any) => {
        this.dataServices.alertData(response)
      })
  }
  /**
   * End collection
   */

  getUserImageDetails(imageId) {
    this.layoutLoaderService.display()
    let data = { id: imageId }
    this.profileService.getUserImageData(data).subscribe((response: any) => {
      this.layoutLoaderService.hide()
      this.currentItem = response.uploadDetails
    })
  }

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

  /**
   * Add set cover
   * @param id
   */
  setEssayCover(id) {
    this.layoutLoaderService.display()
    let data = { upload_id: id, photo_essay_id: this.identifyDetails.id }
    this.photoEssayService.setEssayCover(data).subscribe(
      (response: any) => {
        this.layoutLoaderService.hide()
        let dataAlert = {
          type: 'success',
          title: 'Saved',
          message: 'A new photo has been set as your photo essay cover.'
        }
        this.dataServices.alertData(dataAlert)
      },
      error => {
        let dataAlert = {
          type: 'error',
          title: 'Unable to update cover photo',
          message:
            'There was a problem updating your cover photo, please try again later, or <span class="underline">contact support. </span>'
        }
        this.dataServices.alertData(dataAlert)
      }
    )
  }

  setCollectionCover(id) {
    let data = { upload_id: id, collection_id: this.identifyDetails.id }
    this.collectionService.setCollectionCover(data).subscribe(
      (response: any) => {
        let dataAlert = {
          type: 'success',
          title: 'Saved',
          message: 'A new photo has been set as your photo essay cover.'
        }
        this.dataServices.alertData(dataAlert)
      },
      error => {
        let dataAlert = {
          type: 'error',
          title: 'Unable to update cover photo',
          message:
            'There was a problem updating your cover photo, please try again later, or <span class="underline">contact support. </span>'
        }
        this.dataServices.alertData(dataAlert)
      }
    )
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

  crticPopup(content, item, i, type) {
    this.critiquePageNumber = 1
    this.closeButton = true
    const modalRef = this.modalService.open(CriticsComponent, {
      windowClass: 'critic-cls popup-shimmer'
    })
    modalRef.componentInstance.modalData = item
    modalRef.componentInstance.currentItemKey = i
    modalRef.componentInstance.imgDetails = this.imgDetails
    modalRef.componentInstance.criticDetails = content
    modalRef.componentInstance.criticDetails = content
    modalRef.componentInstance.edit = type == 'edit' ? true : false
    modalRef.componentInstance.view = type == 'view' ? true : false
    modalRef.result
      .then(result => {
        // this.imgDetails = [];
      //  this.critiquePageNumber = 1;
      //  this.getCritiques('given',1); //commented to avoid duplicate images
      })
      .catch(error => {
        // this.imgDetails = [];
       // this.critiquePageNumber = 1;
      //  this.getCritiques('given',1)
      })
  }

  /**
   * Emit for pagination
   */
  appendItems() { // console.log(this.identifyType, "identifyType")
    if (this.paginationStatus == true) {
      if (this.identifyType == 'critique-given') {
        this.critiquePageNumber = this.critiquePageNumber + 1; ////console.log(this.critiquePageNumber, "appenditems")
        this.showOpacity[this.critiquePageNumber] = '0'
        this.getCritiques('given')
      } else if (this.identifyType == 'critique-received') {
        this.critiquePageNumber = this.critiquePageNumber + 1
        this.showOpacity[this.critiquePageNumber] = '0'
        this.getCritiques('received')
      } else if (this.identifyType == 'own-award-entries') {
        this.currentOwnAwardPage = this.currentOwnAwardPage + 1
        this.showOpacity[this.currentOwnAwardPage] = '0'
        this.getOwnAwardEntries()
      } else if (this.identifyType == 'award-entries') {
        this.currentAllAwardPage = this.currentAllAwardPage + 1
        this.showOpacity[this.currentAllAwardPage] = '0'
        this.getAllStfAwardEntries()
      } else if (this.identifyType == 'admin-award-entries') {
        this.currentAllAwardPage = this.currentAllAwardPage + 1
        this.showOpacity[this.currentAllAwardPage] = '0'
        this.getAdminAwardEntries()
      }
    }
  }

  close() {
    this.modalService.dismissAll()
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

  submitStfAwards(item: any) {
    this.modalService.dismissAll()
    this.router.navigate(['user/upload-photo/submit-stf-awards', item.id])
  }

  addWinner(item, index) {
    if (
      (item.award_category_id == 1 && this.isStfWinner == true) ||
      (item.award_category_id == 2 && this.isStlWinner == true) ||
      (item.award_category_id == 3 && this.isStwWinner == true) ||
      item.winner == 1
    ) {
      item.winner = item.winner == 0 ? 1 : 0

      let data = {
        award_id: item.award_id,
        year: this.selectedYear,
        month: this.selectedMonth
      }
      this.stfAwardEntriesService.addWinnerData(data).subscribe(
        (response: any) => {
          if (
            item.finalist == 0 &&
            item.winner == 0 &&
            this.selectedType == 'winner'
          ) {
            let id = document.getElementById('masonry-item-' + index)
            this.removeItem(id)
          }
          this.checkButtonDisable(response.category_values)
        },
        error => {
          item.winner = item.winner == 1 ? 0 : 1
        }
      )
    }
  }

  addFinalist(item, index) {
    if (
      (item.award_category_id == 1 && this.isStfFinalist == true) ||
      (item.award_category_id == 2 && this.isStlFinalist == true) ||
      (item.award_category_id == 3 && this.isStwFinalist == true) ||
      item.finalist == 1
    ) {
      item.finalist = item.finalist == 0 ? 1 : 0
      let data = {
        award_id: item.award_id,
        year: this.selectedYear,
        month: this.selectedMonth
      }
      this.stfAwardEntriesService.addFinalistData(data).subscribe(
        (response: any) => {
          //this.dataService.refreshData()
          //item.finalist = item.finalist == 1 ? 0 : 1

          if (
            item.finalist == 0 &&
            item.winner == 0 &&
            this.selectedType == 'finalist'
          ) {
            let id = document.getElementById('masonry-item-' + index)
            this.removeItem(id)
          }
          this.checkButtonDisable(response.category_values)
          //item.finalist = item.finalist == 0 ? 0 : 1
        },
        error => {
          item.finalist = item.finalist == 0 ? 1 : 0
        }
      )
    }
  }

  addShortList(item, index) {
    // if (item.finalist == 0 && item.winner == 0) {
    item.shortlist = item.shortlist == 0 ? 1 : 0
    let data = { award_id: item.award_id }

    this.stfAwardEntriesService.addShortlistData(data).subscribe(
      (response: any) => {
        if (item.shortlist == 0 && this.selectedType == 'shortlist') {
          let id = document.getElementById('masonry-item-' + index)
          this.removeItem(id)
        }
      },
      error => {
        item.shortlist = item.shortlist == 0 ? 1 : 0
      }
    )
    //}
  }

  removeItem(id) {
    if (this._masonry) {
      ////console.log(id, 'remove item')
      this._masonry
        .removeItem(id) // removeItem() expects actual DOM (ng-masonry-grid-item element)
        .subscribe((item: MasonryGridItem) => {
          // item: removed grid item DOM from NgMasonryGrid
          if (item) {
            let id = item.element.getAttribute('id') // Get id attribute and then find index
            let index = id.split('-')[2]
            // remove grid item from Masonry binding using index (because actual Masonry items order is different from this.masonryItems items)
            this.imgDetails.splice(index, 1)
          }
        })
    }
  }

  updateAdultContent(item) {
    item.adult_content = 0
  }

  awardHistoryModal(item) {
    this.modalReference = this.modalService.open(AwardHistoryComponent, {
      centered: true
    })
    this.modalReference.componentInstance.historyId = item.id
    this.modalReference.result.then(result => {}, reason => {})
  }

  removeCritique(item, index) {
    // Remove critique from given
    this.closeButton = true
    this.deleteId = item
    ////console.log(item)
    this.indx = index
    const modalRef = this.modalService.open(this.delereCritique, {
      // windowClass: 'critic-cls popup-shimmer'
    })
    modalRef.result
      .then(result => {
        ////console.log('close')
      })
      .catch(error => {
        ////console.log(error)
      })
  }

  deleteCritique() {
    const data = {
      upload_id: this.deleteId.id
    }
    this.critiqueService.deleteCritique(data).subscribe(
      (res: any) => {
        let id = document.getElementById('masonry-item-' + this.indx)
        this.removeItem(id)
        // this.getCritiques('given')
        this.modalService.dismissAll()
        res.type = 'success'
        ////console.log(this.indx)
        this.showMessage.emit(res)
      },
      error => {
        error.type = 'error'
        this.showMessage.emit(error);
        this.modalService.dismissAll()
      }
    )
  }

  viewCritique(imgDetails, item: any, i, type) {
    const data = {
      upload_id: item.id,
      user_id: this.user_id
    }
    this.critiqueService.getCritiqueDetails(data).subscribe((res: any) => {
      ////console.log(res)
      this.crticPopup(res.uploads.critique[0], item, i, type)
    })
  }

  timeEditCritique(critiqueDate) {
    ////console.log(Date.parse(new Date().toString()))
    let date: any
    //Date Handling
    date = Date.parse(new Date(critiqueDate).toString())
    ////console.log(date)

    interval(1000)
      .pipe(
        map(x => {
          this._diff = Date.parse(new Date().toString()) - date
        })
      )
      .subscribe(x => {
        this._minutes = this.getMinutes(this._diff)
        this._hrs = this.getHours(this._diff)
        return this._hrs + ':' + this._minutes
      })
    //Date Handling
  }

  getMinutes(t) {
    return Math.floor((t / 1000 / 60) % 60)
  }

  getHours(t) {
    return Math.floor((t / (1000 * 60 * 60)) % 24)
  }

  getCards() {
    this.profileService.getCardsData().subscribe((response: any) => {
      //this.userPhotos = []
      this.cardGroup = response.cards
    })
  }

 
}
