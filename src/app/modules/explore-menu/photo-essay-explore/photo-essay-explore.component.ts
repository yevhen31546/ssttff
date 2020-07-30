import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { environment } from './../../../../environments/environment';
import { AlertService } from './../../../_services/alert.service'
import { DataService } from './../../../_services/data.service'
import { Component, OnInit, AfterViewInit , Inject,Optional} from '@angular/core';
import { ExploreMenuService } from '../explore-menu.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { PhotoEssayEditModalComponent } from '../../photo-essay/photo-essay-edit-modal/photo-essay-edit-modal.component'
import { PhotoEssayDeleteComponent } from '../../photo-essay/photo-essay-delete/photo-essay-delete.component'
import { ActivatedRoute, Router } from '@angular/router'
import { ShareModalComponent } from '../../shared/share-modal/share-modal.component'
import { Title } from '@angular/platform-browser'
import { ProfileService } from '../../profile/profile.service'

@Component({
  selector: 'app-photo-essay-explore',
  templateUrl: './photo-essay-explore.component.html',
  styleUrls: ['./photo-essay-explore.component.scss']
})
export class PhotoEssayExploreComponent implements OnInit, AfterViewInit {
  userId: number
  photoEssayDetails: any = []
  showCollectionLoader: number = 0
  showPaginationLoader: boolean = false
  emptyStatus: boolean = false
  perPage: number = 10
  currentPage: number = 1
  modalReference: any = false
  authUserDetails: any
  cardGroup: any = []
  randomSelectionCount: number = environment.randomSelectionCount;
  categoryType: any = 'featured'

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private exploreMenuService: ExploreMenuService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private alertService: AlertService,
    private titleService: Title,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    //this.showCollectionLoader = true
    this.titleService.setTitle('Explore Photo Essays | Shoot The Frame')
  }

  ngAfterViewInit() {
    if (this.localStorage.getItem('deleteMessage')) {
      let val = JSON.parse(this.localStorage.getItem('deleteMessage'))
      this.alertService.success(val.title, val.message)
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
