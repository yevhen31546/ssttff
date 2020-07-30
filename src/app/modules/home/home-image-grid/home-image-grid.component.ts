import { Inject } from '@angular/core';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { environment } from './../../../../environments/environment';
import {
  Component,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,Optional
} from '@angular/core'
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'
import { HomeService } from '../home.service'
import { ProfileService } from '../../profile/profile.service'
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CollectionsListModalComponent } from '../../collections/collections-list-modal/collections-list-modal.component'
import { CriticsComponent } from '../../profile/critics/critics.component'
import { ImageGridModalComponent } from '../../shared/image-grid-modal/image-grid-modal.component'
import { Location } from '@angular/common';

@Component({
  selector: 'app-home-image-grid',
  templateUrl: './home-image-grid.component.html',
  styleUrls: ['./home-image-grid.component.scss']
})
export class HomeImageGridComponent implements OnInit, OnChanges {
  currentItemWidth: number = 360
  _masonry: any
  currentPage: number = 1
  currentPageFeeds: number = 1
  currentPageAwards: number = 1
  userPhotos: any = []
  @Input() identifyType: string
  @Input() authUserDetails: any
  @Input() selectedYear: any
  @Input() selectedCategory: any
  @Input() selectedMonth: any;
  @Input() redirectUrl: string = '';
  @Output('isDisplay') isDisplay: EventEmitter<any> = new EventEmitter()
  isOwnCollection: any = false
  modalReference: any = false
  isAuthUser: boolean = false
  showPaginationLoader: boolean = false
  showOpacity: any = []
  user_id: number
  closeButton: boolean = false
  cardGroup: any = []
  randomSelectionCount: number = environment.randomSelectionCount;
  emptyStatus: boolean = false;

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private homeService: HomeService,
    private profileService: ProfileService,
    private router: Router,
    private modalService: NgbModal,
    private location: Location
  ) {}

  ngOnInit() { //console.log(this.redirectUrl,"sdsdds")
    this.showOpacity['1'] = '0'
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.isAuthUser = true
      this.user_id = this.authUserDetails.id
    }
    this.getCards()
    if (this.identifyType == 'dailyfeeds') {
      this.getDailyFeeds()
    } else {
      this.getStfAwardEntries()
    }
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

  ngOnChanges() {
    if (this.identifyType != 'dailyfeeds') {
      this.userPhotos = []
      this.currentPageAwards = 1
      this.getStfAwardEntries()
    }
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

  pageChanged() {
    if (this.identifyType == 'dailyfeeds') {
      this.currentPageFeeds = this.currentPageFeeds + 1
      this.showOpacity[this.currentPageFeeds] = '0'
      this.getDailyFeeds()
    } else {
      this.currentPageAwards = this.currentPageAwards + 1
      this.showOpacity[this.currentPageAwards] = '0'
      this.getStfAwardEntries()
    }
  }

  getDailyFeeds() {
    this.showPaginationLoader = true
    let data = {
      user_id: this.user_id,
      per_page: 10,
      page: this.currentPageFeeds
    }
    this.homeService.getDailyFeedsData(data).subscribe(
      (response: any) => {
        if (this.userPhotos.length != 0) {
          // Check if Masonry instance exists
          this._masonry.setAddStatus('append') // set status to 'append'
          // some grid items: items
        }
        // Check if Masonry instance exist
        let photos = response.photos

        if (photos.length == 0 && this.currentPageFeeds != 1) {
          this.emptyStatus = true
        }

        for (let i = 0; i < photos.length; ++i) {
          var remainder = this.userPhotos.length % this.randomSelectionCount
          if (remainder == 0 && this.userPhotos.length != 0) {
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
            this.userPhotos.push(randomFile)
          }
          response.photos[i].page = data.page
          response.photos[i].own_photo =
            response.photos[i].user_id == this.user_id ? 1 : 0
          if (response.photos[i].user_photo == '') {
            response.photos[i].user_photo = 'assets/images/temp/user-icon.svg'
          }
          this.userPhotos.push(photos[i])
        }
        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 500)
        if (this.userPhotos) {
          this.isDisplay.emit(true)
        }
      },
      error => {}
    )
  }

  getStfAwardEntries() {
    this.showPaginationLoader = true
    let data = {
      page: this.currentPageAwards,
      per_page: 10,
      year:
        this.selectedYear === 'Year' || this.selectedYear === 0
          ? ''
          : this.selectedYear,
      month:
        this.selectedMonth === 'Month' || this.selectedMonth == 0
          ? ''
          : this.selectedMonth,
      category_id:
        this.selectedCategory === 'Category' || this.selectedCategory === 0
          ? ''
          : this.selectedCategory
    }

    this.homeService.getStfAwardEntriesData(data).subscribe(
      (response: any) => {
        if (this.userPhotos.length != 0) {
          // Check if Masonry instance exists
          this._masonry.setAddStatus('append') // set status to 'append'
          // some grid items: items
        }
        // Check if Masonry instance exist
        let photos = response.photos

        if (photos.length == 0 && this.currentPageAwards != 1) {
          this.emptyStatus = true
        }

        for (let i = 0; i < photos.length; ++i) {
          response.photos[i].page = data.page
          response.photos[i].own_photo =
            response.photos[i].user_id == this.user_id ? 1 : 0
          this.userPhotos.push(photos[i])
        }
        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 500)
      },
      error => {}
    )
  }

  /**
   * Like Photos
   */
  likePhotos(item) {
    if (this.isAuthUser == false) {
      this.router.navigate(['/sign-in'])
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

  /**
   *collection
   */
  addCollections(item) {
    if (!this.authUserDetails) {
      this.router.navigate(['/sign-in'])
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

  crticPopup(content, item, i) {
    this.closeButton = true
    const modalRef = this.modalService.open(CriticsComponent, {
      windowClass: 'critic-cls popup-shimmer'
    })
    modalRef.componentInstance.modalData = item
    modalRef.componentInstance.currentItemKey = i
    modalRef.componentInstance.imgDetails = this.userPhotos
    modalRef.result
      .then(result => {})
      .catch(error => {
        ////console.log(error)
      })
  }

  closeModal() {
    this.closeButton = false
    this.modalService.dismissAll()
  }

  openMasonryModal(content, item, i) {
    this.closeButton = true
    this.modalReference = this.modalService.open(ImageGridModalComponent, {
      windowClass: 'critic-cls popup-shimmer',
      centered: true
    })
    this.modalReference.componentInstance.data = item
    this.modalReference.componentInstance.currentItemKey = i
    this.modalReference.componentInstance.imgDetails = content;
    this.location.go(`photo/${item.share_id}`);
    this.modalReference.result.then(
      result => {
        this.location.go(this.redirectUrl);
      },
      reason => {}
    )
  }

  updateAdultContent(item) {
    item.adult_content = 0
  }

  getCards() {
    this.profileService.getCardsData().subscribe((response: any) => {
      //this.userPhotos = []
      this.cardGroup = response.cards
    })
  }


  showProfile(username) {
    this.router.navigate( [ '@' + username])
  }
}
