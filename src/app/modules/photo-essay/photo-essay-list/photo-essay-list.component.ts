import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { ShareModalComponent } from './../../shared/share-modal/share-modal.component'
import { DataService } from './../../../_services/data.service'
import { Component, OnInit, Input, Output, EventEmitter , Inject,Optional} from '@angular/core';
import { PhotoEssayService } from '../photo-essay.service'
import { PhotoEssayEditModalComponent } from '../photo-essay-edit-modal/photo-essay-edit-modal.component'
import { PhotoEssayDeleteComponent } from '../photo-essay-delete/photo-essay-delete.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Router } from '@angular/router'
import { ProfileService } from '../../profile/profile.service'
import { PhotoEssayAddModalComponent } from '../photo-essay-add-modal/photo-essay-add-modal.component'

@Component({
  selector: 'app-photo-essay-list',
  templateUrl: './photo-essay-list.component.html',
  styleUrls: ['./photo-essay-list.component.css']
})
export class PhotoEssayListComponent implements OnInit {
  essayList: any = []
  @Input() userId: number
  @Input() photoEssayDetails: any = []
  @Input() searchTerm: any
  @Input() name: any
  modalReference: any = false
  @Output() paginationAlert = new EventEmitter()
  showPaginationLoader: boolean = true
  paginationStatus: boolean = true
  currentPage: number = 1
  authUserDetails: any = []
  loggedUser: any = ''
  isOwnPhotoEssay: boolean = false
  emptyStatus: boolean = false
  showCreateModal: boolean = false

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private photoEssayService: PhotoEssayService,
    private profileService: ProfileService,
    private modalService: NgbModal,
    private _dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.loggedUser = this.authUserDetails.id
    }
    //this.essayList = this.photoEssayDetails
    this._dataService.refresh.subscribe((val: any) => {
      this.essayList = []
      this.currentPage = 1
      this.getUserPhotoEssays()
    })

    this._dataService.searchData.subscribe(data => {
      this.essayList = []
      this.currentPage = 1
      this.searchTerm = data
      this.getSearchUserPhotoEssays()
    })

    if (this.searchTerm) {
      this.getSearchUserPhotoEssays()
    } else {
      this.getUserPhotoEssays()
    }
  }

  // ngOnChanges(): void {
  //   //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   //Add '${implements OnChanges}' to the class.
  //   if (this.searchTerm) {
  //     this.essayList = []
  //     this.currentPage = 1
  //     this.getSearchUserPhotoEssays()
  //   }
  // }

  pageChanged() {
    if (this.paginationStatus == true) {
      this.currentPage = this.currentPage + 1
      if (this.searchTerm) {
        this.getSearchUserPhotoEssays()
      } else {
        this.getUserPhotoEssays()
      }
    }
  }

  getUserPhotoEssays() {
    if (this.loggedUser == this.userId) {
      this.isOwnPhotoEssay = true
    }
    let data = {
      user_id: this.userId,
      per_page: 10,
      page: this.currentPage,
      logged_id: this.loggedUser
    }
    this.showPaginationLoader = true
    this.photoEssayService
      .getUserPhotoEssay(data)
      .subscribe((response: any) => {
        if (response.essays.length == 0 && this.currentPage != 1) {
          this.emptyStatus = true
        }
        if (response.essays.length == 0) {
          this.paginationStatus = false
        }
        this.essayList = this.essayList.concat(response.essays)
        this.showPaginationLoader = false
      })
  }

  getSearchUserPhotoEssays() {
    if (this.loggedUser == this.userId) {
      this.isOwnPhotoEssay = true
    }
    let data = {
      searchKey: this.searchTerm,
      page: this.currentPage,
      per_page: 10,
      userId: this.userId,
      type: 'essays'
    }
    this.showPaginationLoader = true

    this.profileService.searchUserData(data).subscribe((response: any) => {
      if (response.search_result.length == 0 && this.currentPage != 1) {
        this.emptyStatus = true
      }
      if (response.search_result.length == 0) {
        this.paginationStatus = false
      }
      this.essayList = this.essayList.concat(response.search_result) // some grid items: items
      this.showPaginationLoader = false
    })
  }

  editPhoto(item) {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(PhotoEssayEditModalComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = item

    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      result => {
        ////console.log(result)
      },
      reason => {}
    )
  }

  deletePhoto(item) {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(PhotoEssayDeleteComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = item
    this.modalReference.result.then(result => {}, reason => {})
  }

  getDetails(id) {
    this.router.navigate(['/photo-essay', id])
  }

  share(item) {
    ////console.log(item)
    const modalRef = this.modalService.open(ShareModalComponent)
    modalRef.componentInstance.item = item
    modalRef.componentInstance.type = 'photo_essay'
    modalRef.result
      .then(result => {})
      .catch(error => {
        // ////console.log(error);
      })
  }

  createModal() {
    //this.modalData = this.data
    //this.showCreateModal = true.
    this.modalReference = this.modalService.open(PhotoEssayAddModalComponent, {
      windowClass: 'modal-md'
    })
    // this.modalReference.componentInstance.data = this.essayDet
    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      result => {
        this.getUserPhotoEssays()
      },
      reason => {
        this.getUserPhotoEssays()
      }
    )
  }

  cancelModal() {
    //this.getPhotoEssayList()
    this.showCreateModal = false
  }

  showProfile(name: any) {
    this.router.navigate( [ '@' + name]);
  }
}
