import { Inject,Optional } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import {
  Component,
  OnInit,
  AfterViewInit,
  AfterContentInit,
  ChangeDetectorRef
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
  selector: 'app-collection-explore',
  templateUrl: './collection-explore.component.html',
  styleUrls: ['./collection-explore.component.scss']
})
export class CollectionExploreComponent implements OnInit, AfterViewInit {
  userId: number
  collectionList: any = []
  showCollectionLoader: number = 0
  showPaginationLoader: boolean = false
  perPage: number = 10
  currentPage: number = 1
  modalReference: any = false
  authUserDetails: any
  cardGroup: any = []
  randomSelectionCount: number = environment.randomSelectionCount;
  emptyStatus: boolean = false
  categoryType: any='featured'

  constructor(@Optional() 
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

  tabChange(event: any) {
    this.categoryType = event.nextId
  }

  loaderClose() {
    this.showCollectionLoader = 1
  }
}
