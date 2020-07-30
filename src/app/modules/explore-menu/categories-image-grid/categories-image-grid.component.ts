import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { DataService } from './../../../_services/data.service';
import { Title } from '@angular/platform-browser';
import { ExploreMenuService } from './../explore-menu.service'
import { Component, OnInit, Input , Inject,Optional} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Masonry } from 'ng-masonry-grid'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ImageGridModalComponent } from '../../shared/image-grid-modal/image-grid-modal.component'
import { CollectionsListModalComponent } from '../../collections/collections-list-modal/collections-list-modal.component'
import { CriticsComponent } from '../../profile/critics/critics.component'
import { ProfileService } from '../../profile/profile.service'
import { environment } from './../../../../environments/environment'
import { Location } from '@angular/common';

@Component({
  selector: 'app-categories-image-grid',
  templateUrl: './categories-image-grid.component.html',
  styleUrls: ['./categories-image-grid.component.scss']
})
export class CategoriesImageGridComponent implements OnInit {
  currentItemWidth: number = 460
  _masonry: any
  perPage: number = 12
  currentPage: number = 1
  currentPhotosPage: number = 1
  isAuthUser: boolean = false
  authUserDetails: any
  userPhotos: any = []
  @Input() categoryType: any
  @Input() categoryDetails: any
  @Input() selectType: any
  isOwnCollection: any = ''
  categoryId: number
  subjectId: any
  modalReference: any = false
  showPaginationLoader: boolean = false
  showOpacity: any = []
  emptyStatus: boolean = false
  glideLength: number = environment.GLIDE_SIZE
  innerWidth: any
  offset: 100
  defaultImage: 'https://images.unsplash.com/photo-1443890923422-7819ed4101c0?fm=jpg'
  authUserId: any = '';
  closeButton: boolean = false
  cardGroup: any = []
  randomSelectionCount: number = environment.randomSelectionCount;
  removeCriticBtn: Boolean = false;

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private exploreMenuService: ExploreMenuService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private profileService: ProfileService,
    private router: Router,
    private title: Title,
    private dataService: DataService,
    private location: Location
  ) {}

  ngOnInit() { ////console.log(this.selectType,"selectType");
  this.getCards()
    this.showOpacity['1'] = '0'
    this.subjectId = this.route.snapshot.paramMap.get('categoryname')
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.authUserId = this.authUserDetails.id
      this.isAuthUser = true
    }

    if (this.selectType == 'photos') {
      this.getPhotosDetails()
    } else {
      this.getCategoryDetails()
    }


  }

 

  // ngOnChanges() {
  //   this.subjectId = this.route.snapshot.paramMap.get('id')
  //   this.userPhotos = []
  //   if (this.selectType == 'photos') {
  //     this.getPhotosDetails()
  //   } else {
  //     this.getCategoryDetails()
  //   }
  // }

  /** Grid changes */
  addPixel(item) {
    return (item.height / item.width) * 100 + '%'
    // let aspectRatio = item.width / item.height
    // let heightT = this.currentItemWidth / aspectRatio
    // item.current_height = heightT
    //  return heightT + 'px'
  }

  getHeight(height, width, cwidth) {
    let aspectRatio = width / height
    let heightT = cwidth / aspectRatio
    return heightT
  }

  // Get ng masonry grid instance first
  onNgMasonryInit($event: Masonry) {
    this._masonry = $event
    this.showPaginationLoader = true
  }

  completeLayout($event) {
    this.showPaginationLoader = false
    //this._masonry.reloadItems()
    //this.loaderService.hide()
  }

  pageChanged() {
    if (this.selectType == 'photos') {
      this.currentPhotosPage = this.currentPhotosPage + 1
      this.showOpacity[this.currentPhotosPage] = '0'
      this.showPaginationLoader = false
      this.getPhotosDetails()
    } else {
      this.currentPage = this.currentPage + 1
      this.showOpacity[this.currentPage] = '0'
      this.getCategoryDetails()
    }
  }

  openMasonryModal(content, item, i) {
    this.closeButton = true
    this.modalReference = this.modalService.open(ImageGridModalComponent, {
      windowClass: 'critic-cls popup-shimmer',
      centered: true,
      backdrop: 'static'
    })
    this.modalReference.componentInstance.data = item
    this.modalReference.componentInstance.currentItemKey = i
    this.modalReference.componentInstance.imgDetails = this.userPhotos;
    this.modalReference.componentInstance.removeCritic.subscribe(res => {
      this.removeCriticBtn = item.id ;
    });
    this.location.go(`photo/${item.share_id}`);
    this.modalReference.result.then(
      result => {
        this.location.go(this.router.url);
        this.title.setTitle('Explore Photos | Shoot The Frame');
      },
      reason => {}
    )
  }

  closeModal() {
    this.closeButton = false
    this.modalReference.close()
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
  /** Grid changes */

  getPhotosDetails() {
    this.showPaginationLoader = true
    let data = {
      per_page: this.perPage,
      page: this.currentPhotosPage,
      type: this.categoryType,
      user_id: this.authUserId
    }

    this.exploreMenuService.getPhotosData(data).subscribe(
      (response: any) => {
        if (this.userPhotos.length != 0) {
          // Check if Masonry instance exists
          this._masonry.setAddStatus('append') // set status to 'append'
          // some grid items: items
        }
        // Check if Masonry instance exist
        let photos = response.photos
        if (photos.length == 0 && this.currentPhotosPage!=1) {
          this.emptyStatus = true
        }

        for (let i = 0; i < photos.length; ++i) {
          var remainder = this.userPhotos.length % this.randomSelectionCount
          if (remainder == 0 && this.userPhotos.length != 0) {
            var rand = this.cardGroup[
              Math.floor(Math.random() * this.cardGroup.length)
            ];
            if(rand) {
            let randomFile = {
              photo: rand,
              type: 'learn',
              height: '720',
              width: '720',
              page: data.page,
              card: '1'
            };
            this.userPhotos.push(randomFile)

          }
          }
          response.photos[i].page = data.page
          let aspectRatio = response.photos[i].width / response.photos[i].height
          let heightT = this.currentItemWidth / aspectRatio
          response.photos[i].current_height = heightT + 'px'
          response.photos[i].current_image_height = heightT
          response.photos[i].own_photo =
            response.photos[i].user_id == this.authUserId ? 1 : 0
          if (response.photos[i].user_photo == '') {
            // user-default-header
            response.photos[i].user_photo = 'assets/images/temp/user-icon.svg'
          }
          this.userPhotos.push(photos[i])

        }
        setTimeout(() => {
          this.showOpacity[data.page] = '1'
          this.showPaginationLoader = false
        }, 500)
        ////console.log(this.userPhotos)
      },
      error => {}
    )
  }

  getCategoryDetails() {
    this.showPaginationLoader = true
    let data = {
      per_page: this.perPage,
      page: this.currentPage,
      type: this.categoryType,
      type_id: this.subjectId
    }
    this.exploreMenuService.getCategoriesDetailsData(data).subscribe(
      (response: any) => {
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
        for (let i = 0; i < photos.length; ++i) {
          response.photos[i].page = data.page
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
          //this.userPhotos = []
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

  redirectLearn(username) {
    this.router.navigate(['about.shoottheframe.com/stf-awards'])
  }

  updateAdultContent(item) {
    item.adult_content = 0
  }

  getCards() {
    this.profileService.getCardsData().subscribe((response: any) => {
      //this.userPhotos = []
      this.cardGroup = response.cards;
    })
  }
}
