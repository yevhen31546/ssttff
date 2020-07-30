import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { InfoComponent } from './../../shared/info/info.component';
import { ActivatedRoute } from '@angular/router'
import { PhotoUploadService } from './../photo-upload.service'
import { Component, OnInit, OnDestroy , Inject,Optional} from '@angular/core';
import { Router } from '@angular/router'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ShareModalComponent } from './../../shared/share-modal/share-modal.component'
import * as localforage from 'localforage';

@Component({
  selector: 'app-upload-complete',
  templateUrl: './upload-complete.component.html',
  styleUrls: ['./upload-complete.component.css']
})
export class UploadCompleteComponent implements OnInit, OnDestroy {
  userDetails: any
  photoDetails: any
  imageDetails: any
  stf_submission_limit: number
  dailyUploads: number
  stfSuccess: Boolean = false;
  awardsuccess: Boolean = false;

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private photoUploadSvc: PhotoUploadService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.route.params.subscribe(params => {
      if (params['stf-submission']) {
        this.stfSuccess = true;
      }
       if (params['awardsuccess']) {
        this.awardsuccess = true;
      }
    })
  }

  ngOnInit() {
    this.window.scrollTo(0, 0)
    this.userDetails = JSON.parse(this.localStorage.getItem('user'))
    this.photoDetails = JSON.parse(this.localStorage.getItem('storage'));


    this.getDailyUploadLimits()
    this.photoDetailsSubsc();

  }

  showProfile() {
    this.router.navigate( [ '@' + this.userDetails.username])
  }

  photoDetailsSubsc() {
    this.photoUploadSvc
      .getPhotoDetails(this.photoDetails.upload_id)
      .subscribe((response: any) => {
        this.imageDetails = response
      })
    // this.photoUploadSvc.photoDetails$.subscribe((photoDetails: any) => {
    //     ////console.log(photoDetails)
    //   // this.storyDetails.upload_id = photoDetails.id;
    //   // this.storyDetails.title = photoDetails.title;
    //   // this.storyDetails.story = photoDetails.story;
    //   // this.diffObj = this.miscSvc.deepCopy(photoDetails);
    // })
  }

  getDailyUploadLimits() {
    this.photoUploadSvc.dailyUploadLimitService().subscribe((response: any) => {
      this.stf_submission_limit = response.submission
      this.dailyUploads = response.dailyUploads
    })
  }

  share(item, type) {
    const modalRef = this.modalService.open(ShareModalComponent)
    modalRef.componentInstance.item = item
    modalRef.componentInstance.type = type
    modalRef.result
      .then(result => {})
      .catch(error => {
        ////console.log(error)
      })
  }

  infoModal() {
    const modalRef = this.modalService.open(InfoComponent)
  }



  ngOnDestroy(): void {
    localforage.removeItem('currentImage')
    this.localStorage.removeItem('storage')
  }
}
