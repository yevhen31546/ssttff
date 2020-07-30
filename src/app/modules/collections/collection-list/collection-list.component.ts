import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { ShareModalComponent } from './../../shared/share-modal/share-modal.component'
import { DataService } from './../../../_services/data.service'
import { Component, OnInit, Input , Inject, Optional} from '@angular/core';
import { CollectionsService } from '../collections.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CollectionsEditModalComponent } from '../collections-edit-modal/collections-edit-modal.component'
import { CollectionsDeleteComponent } from '../collections-delete/collections-delete.component'
import { Router } from '@angular/router'
import { ProfileService } from '../../profile/profile.service'
import { CollectionsAddModalComponent } from '../collections-add-modal/collections-add-modal.component'
// import { PhotoEssayService } from '../photo-essay.service'

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.css']
})
export class CollectionListComponent implements OnInit {
  collectionList: any = []
  @Input() userId: number
  @Input() searchTerm: any
  modalReference: any = false
  currentPage: number = 1
  showPaginationLoader: boolean = true
  emptyStatus: boolean = false
  authUserDetails: any = ''
  loggedUser: any = ''
  isOwnCollection: boolean = false
  @Input() name: any
  paginationStatus: boolean = true

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private collectionsService: CollectionsService,
    private profileservice: ProfileService,
    private modalService: NgbModal,
    private router: Router,
    private _dataService: DataService
  ) {}

  ngOnInit() {
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.loggedUser = this.authUserDetails.id
    }
    this._dataService.refresh.subscribe((val: any) => {
      this.collectionList = []
      this.currentPage = 1
      this.getUserCollections()
    })

    this._dataService.searchData.subscribe(data => {
      this.collectionList = []
      this.currentPage = 1
      this.searchTerm = data

      this.getSearchUserCollections()
    })
    if (this.searchTerm) {
      this.getSearchUserCollections()
    } else {
      this.getUserCollections()
    }
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // if (this.searchTerm) {
    //   this.collectionList=[]
    //   this.currentPage = 1
    //   this.getSearchUserCollections()
    // }
  }

  pageChanged() {
    if (this.paginationStatus == true) {
      this.currentPage = this.currentPage + 1
      if (this.searchTerm) {
        this.getSearchUserCollections()
      } else {
        this.getUserCollections()
      }
    }
  }

  getUserCollections() {
    if (this.loggedUser == this.userId) {
      this.isOwnCollection = true
    }
    this.showPaginationLoader = true
    let data = {
      user_id: this.userId,
      per_page: 10,
      page: this.currentPage,
      logged_id: this.loggedUser
    }
    this.collectionsService
      .getUserCollections(data)
      .subscribe((response: any) => {
        this.showPaginationLoader = false
        if (response.collections.length == 0 && this.currentPage != 1) {
          this.emptyStatus = true
        }
        if (response.collections.length == 0) {
          this.paginationStatus = false
        }
        this.collectionList = this.collectionList.concat(response.collections)
      })
  }

  getSearchUserCollections() {
    let data = {
      searchKey: this.searchTerm,
      page: this.currentPage,
      per_page: 10,
      userId: this.userId,
      type: 'collections'
    }
    this.showPaginationLoader = true

    this.profileservice.searchUserData(data).subscribe((response: any) => {
      if (response.search_result.length == 0 && this.currentPage != 1) {
        this.emptyStatus = true
      }
      // if (response.collections.length == 0) {
      //   this.paginationStatus = false
      // }
      this.collectionList = this.collectionList.concat(response.search_result) // some grid items: items
      this.showPaginationLoader = false
    })
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
    this.modalReference.result.then(result => {}, reason => {})
  }

  getDetails(id) {
    this.router.navigate(['/collection', id])
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

  createModal() {
    //this.modalData = this.data
    //this.showCreateModal = true.
    this.modalReference = this.modalService.open(CollectionsAddModalComponent, {
      windowClass: 'modal-md'
    })
    // this.modalReference.componentInstance.data = this.essayDet
    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      result => {
        this.getUserCollections()
      },
      reason => {
        this.getUserCollections()
      }
    )
  }

  showProfile(name: any) {
    this.router.navigate( [ '@' + name]);
  }
}
