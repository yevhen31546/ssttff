import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router'
import { DataService } from './../../_services/data.service'
import { Component, OnInit , Inject, Optional} from '@angular/core';
import { LikesService } from './likes.service'
import { ProfileService } from './../profile/profile.service'
import { Masonry, MasonryGridItem } from 'ng-masonry-grid'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CriticsComponent } from './../profile/critics/critics.component'
import { CollectionsListModalComponent } from '../collections/collections-list-modal/collections-list-modal.component'
import { ImageGridModalComponent } from './../shared/image-grid-modal/image-grid-modal.component'
import { Location } from '@angular/common';

@Component({
  selector: 'app-likes',
  templateUrl: './likes.component.html',
  styleUrls: ['./likes.component.scss']
})
export class LikesComponent implements OnInit {
  userPhotos: any = []
  currentItemWidth: number = 360
  _masonry: Masonry
  masonryItems: any
  currentPage: number = 1
  authUserDetails: any
  modalReference: any = false
  likePhoto: Boolean = false
  showPaginationLoader: Boolean = false
  emptyStatus: Boolean = false
  showOpacity: any = []

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private likesService: LikesService,
    private profileService: ProfileService,
    private modalService: NgbModal,
    private _dataService: DataService,
    private router: Router,
    private title: Title,
    private location: Location
  ) {}

  ngOnInit() {
    this.title.setTitle('Likes | Shoot The Frame');
    this.showOpacity['1'] = '0'

    // this._dataService.getToLikeData().subscribe((val: any) => {
    //   alert("hahah");
    //   this.removeItem(val)
    // });
    // this._dataService.likeData.subscribe((val: any) => {
    //   alert('jhhaha')
    //   this.removeItem(val)
    // })

    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
    }

    this.getLikedPhotos()
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
    this.currentPage = this.currentPage + 1
    this.showOpacity[this.currentPage] = '0'
    this.getLikedPhotos()
  }

  getLikedPhotos() {
    this.showPaginationLoader = true
    let data = { per_page: 10, page: this.currentPage }
    this.likesService.getLikedPhotosData(data).subscribe((response: any) => {
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
      //this._masonry.reloadItems()
    })
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

  /**
   * Like Photos
   */
  likePhotos(i, item) {
    ////console.log(i)
    item.like_status = item.like_status == 0 ? 1 : 0
    let data = { upload_id: item.id }
    this.profileService.updateLikeStatus(data).subscribe(
      (response: any) => {
        //this.userPhotos = []
        // item.like_count = response.likeCount;
        let id = document.getElementById('masonry-item-' + i)
        this.currentPage = 1 // Get id attribute and then find index
        let index = i
        ////console.log(id)
        this.removeItem(id)
      },
      error => {
        item.like_status = item.like_status == 0 ? 0 : 1
      }
    )
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
          }
        })
    }
  }

  crticPopup(content, item, i) {
    const modalRef = this.modalService.open(CriticsComponent, {
      windowClass: 'critic-cls popup-shimmer'
    })
    modalRef.componentInstance.modalData = item
    modalRef.componentInstance.currentItemKey = i
    modalRef.componentInstance.imgDetails = this.userPhotos
    modalRef.result
      .then(result => {
        // ////console.log(result,"modalresult");
      })
      .catch(error => {
        // ////console.log(error)
      })
  }

  /**
   *collection
   */
  addCollections(item) {
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

  openMasonryModal(content, item, i) {
    this.modalReference = this.modalService.open(ImageGridModalComponent, {
      windowClass: 'critic-cls popup-shimmer',
      centered: true
    })
    this.modalReference.componentInstance.data = item
    this.modalReference.componentInstance.currentItemKey = i
    this.modalReference.componentInstance.catType = 'like'
    this.modalReference.componentInstance.imgDetails = this.userPhotos
    this.modalReference.componentInstance.like.subscribe(val => {
      let id = document.getElementById('masonry-item-' + val)
      ////console.log(val, 'valll', id)
      this.removeItem(id)
    });
    this.location.go(`photo/${item.share_id}`);
    this.modalReference.result.then(
      result => {
        this.location.go(this.router.url);

      },
      reason => {
        ////console.log(reason)
        // this.getLikedPhotos()
      }
    )
    ////console.log(this.modalService)
  }

  showProfile(username) {
    this.router.navigate( [ '@' + username])
  }
}
