import { Inject } from '@angular/core';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { environment } from './../../../../environments/environment';
import { AlertService } from './../../../_services/alert.service'
import { DataService } from './../../../_services/data.service'
import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,Optional
} from '@angular/core'
import { ExploreMenuService } from '../explore-menu.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { PhotoEssayEditModalComponent } from '../../photo-essay/photo-essay-edit-modal/photo-essay-edit-modal.component'
import { PhotoEssayDeleteComponent } from '../../photo-essay/photo-essay-delete/photo-essay-delete.component'
import { ActivatedRoute, Router } from '@angular/router'
import { ShareModalComponent } from '../../shared/share-modal/share-modal.component'
import { Title } from '@angular/platform-browser'
import { ProfileService } from '../../profile/profile.service'
import { Location } from '@angular/common';

@Component({
  selector: 'app-photo-essay-tab',
  templateUrl: './photo-essay-tab.component.html',
  styleUrls: ['./photo-essay-tab.component.scss']
})
export class PhotoEssayTabComponent implements OnInit {
  userId: number
  photoEssayDetails: any = []
  showCollectionLoader: boolean = false
  showPaginationLoader: boolean = false
  emptyStatus: boolean = false
  paginationCheck: boolean = false
  perPage: number = 10
  currentPage: number = 1
  modalReference: any = false
  authUserDetails: any
  cardGroup: any = [];
  randomSelectionCount: number = environment.randomSelectionCount;
  @Input('categoryType') categoryType: any;
  @Output() loaderClose: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private exploreMenuService: ExploreMenuService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute,
    private _dataService: DataService,
    private alertService: AlertService,
    private titleService: Title,
    private profileService: ProfileService,
    private location: Location
  ) {}

  ngOnInit() {
    this.paginationCheck = false
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.userId = this.authUserDetails.id;
    }
    this.getCards()
    this.getPhotoEssayDetails()
   
    this.titleService.setTitle('Explore Photo Essays | Shoot The Frame');
  }

  paginationItems() {
    if (this.paginationCheck == false) {
      this.showPaginationLoader = true
      this.currentPage++;
      this.getPhotoEssayDetails()
    }
  }

  getPhotoEssayDetails() {
    this.showPaginationLoader = true
    let data = {
      per_page: this.perPage,
      page: this.currentPage,
      type: this.categoryType,
      user_id: this.userId
    }
    this.exploreMenuService.getPhotoEssayExploreData(data).subscribe(
      (response: any) => {
        this.showPaginationLoader = false
        let photos = response.essays
        if (photos.length == 0) {
          this.paginationCheck = true
        }
        if (photos.length == 0 && this.currentPage != 1) {
          this.emptyStatus = true
        }
        for (let i = 0; i < photos.length; ++i) {
          var remainder =
            this.photoEssayDetails.length % this.randomSelectionCount
          if (remainder == 0 && this.photoEssayDetails.length != 0) {
            var rand = this.cardGroup[
              Math.floor(Math.random() * this.cardGroup.length)
            ];
          if( rand) {
            let randomFile = {
              photo: rand,
              type: 'learn',
              height: '720',
              width: '720',
              page: data.page,
              card: '1'
            }
            this.photoEssayDetails.push(randomFile);
           }
          }
          if (photos[i].user_photo == '') {
            // user-default-header
            photos[i].user_photo = 'assets/images/temp/user-icon.svg';
          }
          this.photoEssayDetails.push(photos[i])
        }

        this.loaderClose.emit()

        // this.photoEssayDetails = this.photoEssayDetails.concat(response.essays)
      },
      error => {}
    )
  }

  editPhoto(item) {
    this.modalService.dismissAll()
    this.modalReference = this.modalService.open(PhotoEssayEditModalComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = item
    this.modalReference.componentInstance.alert.subscribe(val => {
      this.showPaginationLoader = true
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
      this.photoEssayDetails = []
      this.getPhotoEssayDetails()
    })

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
      this.photoEssayDetails = []
      this.getPhotoEssayDetails()
    })

    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(result => {}, reason => {})
  }

  getDetails(id) {
    this.router.navigate(['/photo-essay', id])
  }

  share(item) { //console.log(item)
    const modalRef = this.modalService.open(ShareModalComponent)
    modalRef.componentInstance.item = item
    modalRef.componentInstance.type = 'photo_essay';
    this.location.go(`photo/${item.share_id}`);

    modalRef.result
      .then(result => {
        this.location.go(this.router.url);
      })
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
