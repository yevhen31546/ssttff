import { Inject,Optional } from '@angular/core';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { PhotoUploadService } from './../photo-upload.service'
import { PhotoUploadComponent } from './../photo-upload.component'
import {
  Component,
  OnInit,
  ElementRef,
  Input,
  ViewChild,
  OnDestroy
} from '@angular/core'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { Router, ActivatedRoute } from '@angular/router'
import { NgbTabChangeEvent, NgbTabset } from '@ng-bootstrap/ng-bootstrap'
import { Observable } from 'rxjs'
import * as localforage from 'localforage'
import Dexie from 'dexie'
import { LoaderService } from '../../../_services'

@Component({
  selector: 'app-upload-tabs',
  templateUrl: './upload-tabs.component.html',
  styleUrls: ['./upload-tabs.component.css']
})
export class UploadTabsComponent implements OnInit, OnDestroy {
  deletealert: ElementRef
  modalRef: NgbModalRef
  subjectImg: any
  subjectId: string
  detailsactive: boolean = true
  awardactive: boolean = true
  categoryactive: boolean = true
  deactivateGuard: boolean = false
  imageDetails: any = []
  stf_submission_limit: Number = 0
  isEdit: boolean = false
  type: any

  @ViewChild('tabs')
  private tabs: NgbTabset

  @ViewChild('content')
  content

  @ViewChild('contentEdit')
  contentEdit

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private modalService: NgbModal,
    private photoUploadSvc: PhotoUploadService,
    private route: ActivatedRoute,
    private router: Router,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.loaderService.display()
    const _that = this
    _that.subjectImg = ''
    localforage.getItem('currentImage').then(function(value) {
      _that.subjectImg = value
    })
    this.subjectId = this.localStorage.getItem('subjectId') //this.route.snapshot.paramMap.get('subjectId')
    if (this.localStorage.getItem('updateStatus') == '1') {
      this.isEdit = true
    }
    this.photoUploadSvc
      .getPhotoDetails(this.subjectId)
      .subscribe(uploadDetails => {
        if (Object.getOwnPropertyNames(uploadDetails).length > 0) {
          this.imageDetails = uploadDetails
          if (uploadDetails.media) {
            _that.subjectImg = uploadDetails.media
          }
          this.imageDetails.adult_content =
            uploadDetails.adult_content == 1 ? true : false
          if (uploadDetails.title != null && uploadDetails.story != null) {
            this.detailsactive = false
          }
          if (uploadDetails.tags.length > 0 && this.detailsactive == false) {
            this.categoryactive = false
          }
          if (
            uploadDetails.category_id != null &&
            uploadDetails.photo_essay != null &&
            this.detailsactive == false &&
            this.categoryactive == false
          ) {
            this.awardactive = false
          }
          this.localStorage.setItem('storage', JSON.stringify({}))
        } else {
          this.deactivateGuard = true
          this.router.navigate(['user/upload-photo'])
        }
      })
  }

  ngOnDestroy(): void {}

  allowDeactivate($event) {
    ////console.log($event)
    this.deactivateGuard = $event
  }

  //    arrayBufferToBlob(buffer, type) {
  //   //  return new Blob([buffer], {type: 'MIME'});

  //   var arrayBufferView = new Uint8Array(buffer);
  //   var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } ); ////console.log(blob, "blob");
  //   var urlCreator = window.URL || window.webkitURL;
  //   var imageUrl = urlCreator.createObjectURL( blob );
  // ////console.log(imageUrl,""imageurl);

  //   }

  activeTabs($event, activeTab) {
    ////console.log($event, 'eventssss', activeTab)
    this.allowDeactivate($event)
    if (activeTab == 'detailsActive') {
      this.detailsactive = false
      this.tabs.activeId = 'tab-details'
      this.tabs.select('tab-details')
      ////console.log(this.tabs, 'tabs')
    }
    if (activeTab == 'categoryActive') {
      this.categoryactive = false
      this.tabs.activeId = 'tab-category'
      this.tabs.select('tab-category')
      ////console.log(this.tabs, 'tabs')
    }
    if (activeTab == 'awardActive') {
      this.awardactive = false
      this.tabs.activeId = 'tab-award'
      this.tabs.select('tab-award')
    }
  }

  imageLoaded() {
    this.loaderService.hide()
  }

  canDeactivate() {
    if (this.deactivateGuard == true) {
      return true
    }
    let promise = new Promise((resolve, reject) => {
      if (this.isEdit) {
        this.modalRef = this.modalService.open(this.contentEdit)
      } else {
        this.modalRef = this.modalService.open(this.content)
      }

      this.modalRef.result.then(
        result => {
          this.deactivateGuard = true
          if (!this.isEdit) {
            this.photoUploadSvc
              .deletePhotoDetails(this.subjectId)
              .subscribe(res => {})
          } else {
            this.localStorage.removeItem('storage')
          }
          this.localStorage.removeItem('updateStatus')
          resolve(true)
        },
        reason => {
          this.deactivateGuard = false
          resolve(false)
        }
      )
    })
    return promise
  }

  afterChange(event: any) {
    ////console.log(event, 'after')
  }
}
