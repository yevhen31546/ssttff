import { Inject } from '@angular/core';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,Optional
} from '@angular/core'
import { ExploreMenuService } from '../explore-menu.service'
import { Router } from '@angular/router'
import { CollectionsEditModalComponent } from '../../collections/collections-edit-modal/collections-edit-modal.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DataService, AlertService } from '../../../_services'
import { CollectionsDeleteComponent } from '../../collections/collections-delete/collections-delete.component'
import { ShareModalComponent } from '../../shared/share-modal/share-modal.component'
import { Title } from '@angular/platform-browser'
import { ProfileService } from '../../profile/profile.service'
import { environment } from './../../../../environments/environment'

@Component({
  selector: 'app-collection-tab',
  templateUrl: './collection-tab.component.html',
  styleUrls: ['./collection-tab.component.scss']
})
export class CollectionTabComponent implements OnInit, AfterViewInit {
  @Input('categoryType') categoryType: any
  userId: number
  collectionList: any = []
  showCollectionLoader: boolean = false
  showPaginationLoader: boolean = true
  perPage: number = 10
  currentPage: number = 1
  modalReference: any = false
  authUserDetails: any
  cardGroup: any = []
  randomSelectionCount: number = environment.randomSelectionCount;
  emptyStatus: boolean = false
  paginationCheck: boolean = false
  @Output() loaderClose: EventEmitter<any> = new EventEmitter()

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private exploreMenuService: ExploreMenuService,
    private router: Router,
    private modalService: NgbModal,
    private _dataService: DataService,
    private alertService: AlertService,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Explore Collections | Shoot The Frame')

    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.userId = this.authUserDetails.id
    }

    this._dataService.alert.subscribe((val: any) => {
      if (val.type == 'success') {
        this.alertService.success(val.title, val.message)
      } else if (val.type == 'info') {
        this.alertService.info(val.title, val.message)
      } else if (val.type == 'stfawarderror') {
        this.alertService.warning(val.title, val.message)
      } else {
        this.alertService.error(val.title, val.message)
      }
    })
    this.getCards()
    this.getCollectionExploreData()
  }

  ngAfterViewInit() {
    //Called after ngOnInit when the component's or directive's content has been initialized.
    //Add 'implements AfterContentInit' to the class.
    if (this.localStorage.getItem('deleteMessage')) {
      let val = JSON.parse(this.localStorage.getItem('deleteMessage'))
      this.alertService.success(val.title, val.message)
      this.cdr.detectChanges()
      this.localStorage.removeItem('deleteMessage')
    }
  }

  paginationItems() {
    if (this.paginationCheck == false) {
      this.showPaginationLoader = true
      this.currentPage++
      this.getCollectionExploreData()
    }
  }

  getCollectionExploreData() {
    let data = {
      per_page: this.perPage,
      page: this.currentPage,
      type: this.categoryType,
      user_id: this.userId
    }
    this.exploreMenuService.getCollectionExploreData(data).subscribe(
      (response: any) => {
        //this.collectionList = this.collectionList.concat(response.collections)
        // this.showCollectionLoader = true
        this.showPaginationLoader = false
        let photos = response.collections
        if (photos.length == 0 && this.currentPage != 1) {
          this.emptyStatus = true
        }
        if (photos.length == 0) {
          this.paginationCheck = true
        }
        for (let i = 0; i < photos.length; ++i) {
          var remainder = this.collectionList.length % this.randomSelectionCount
          if (remainder == 0 && this.collectionList.length != 0) {
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
            }
            this.collectionList.push(randomFile);
          }
          }

          if (photos[i].user_photo == '') {
            // user-default-header
            photos[i].user_photo = 'assets/images/temp/user-icon.svg';
          }

          this.collectionList.push(photos[i])
        }
        this.loaderClose.emit()
      },
      error => {}
    )
  }

  getDetails(id) {
    this.router.navigate(['/collection', id])
  }

  editCollection(item) {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(
      CollectionsEditModalComponent,
      {
        windowClass: 'modal-md'
      }
    )
    this.modalReference.componentInstance.data = item
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
      this.currentPage = 1
      this.collectionList = []
      this.getCollectionExploreData()
    })

    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      result => {
        ////console.log(result)
      },
      reason => {}
    )
  }

  deleteCollectionModal(item) {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(CollectionsDeleteComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = item
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
      this.currentPage = 1
      this.collectionList = []
      this.getCollectionExploreData()
    })

    this.modalReference.result.then(result => {}, reason => {})
  }

  share(item) {
    const modalRef = this.modalService.open(ShareModalComponent)
    modalRef.componentInstance.item = item
    modalRef.componentInstance.type = 'collection'
    modalRef.result
      .then(result => {})
      .catch(error => {
        // ////console.log(error);
      })
  }

  getCards() {
    this.profileService.getCardsData().subscribe((response: any) => {
      //this.userPhotos = []
      this.cardGroup = response.cards
    })
  }

  showProfile(name: any) {
    this.router.navigate( [ '@' + name]);
  }
}
