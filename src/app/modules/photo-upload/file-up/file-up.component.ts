import { Inject } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { InfoComponent } from './../../shared/info/info.component'
import { UploadInfoComponent } from './../../../modals/upload-info/upload-info.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { LoaderService } from './../../../_services/loader.service'
import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,Optional
} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FileUploader, FileItem, FileLikeObject } from 'ng2-file-upload'
import { AlertService } from '../../../_services/alert.service'
import { environment as env } from '../../../../environments/environment'
import { PhotoUploadService } from '../photo-upload.service'
import { interval, Observable, Subscription } from 'rxjs'
import { map } from 'rxjs/operators'
import * as localforage from 'localforage'
import Dexie from 'dexie'

@Component({
  selector: 'file-up',
  templateUrl: './file-up.component.html',
  styleUrls: ['./file-up.component.css']
})
export class FileUpComponent implements OnInit {
  uploadUrl: string = env.apiUrl + 'uploadPhoto'
  badFileType: boolean
  daily_upload_limit: number
  stf_submission_limit: number
  _diff: number
  _days: number
  _hours: number
  _minutes: number
  _seconds: number
  current_month: string
  current_year: number
  imageWidth: any
  imageData: any = ''
  width: any
  height: any

  @ViewChild('photoSelect')
  photoSelect: ElementRef

  public photoUploader: FileUploader = new FileUploader({
    url: this.uploadUrl,
    itemAlias: 'media',
    authTokenHeader: 'Authorization',
    allowedMimeType: ['image/jpeg'],
    queueLimit: 1,
    removeAfterUpload: true
  })
  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private router: Router,
    private route: ActivatedRoute,
    public alertService: AlertService,
    private renderer: Renderer2,
    private photoUploadService: PhotoUploadService,
    private loaderService: LoaderService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    //time handling
    this.timeSTFSubmission()
    //time handling
    this.localStorage.removeItem('updateStatus')
    const curUser: any = JSON.parse(this.localStorage.getItem('currentUser'))
    this.photoUploader.authToken = 'Bearer ' + curUser.token
    this.photoUploader.onBeforeUploadItem = file => {
      file.withCredentials = false
    }

    this.photoUploader.onProgressItem = (
      fileItem: FileItem,
      progress: number
    ) => {
      let text = 'Uploading your photo…'
      this.loaderService.display(progress, true, text)
    }

    this.photoUploader.onCompleteItem = (
      item: FileItem,
      response: string,
      status: number,
      headers: any
    ) => {
      const resp: any = JSON.parse(response)
      const subjectId = resp.uploadDetails.id
      this.localStorage.setItem('subjectId', subjectId)
      this.router.navigate(['details'], {
        relativeTo: this.route
      })
      this.loaderService.hide()
    }
    this.photoUploader.onErrorItem = (
      item: FileItem,
      response: string,
      status: number,
      headers: any
    ) => {
      const title = 'Upload Failed !'
      const message =
        'Something went wrong. Your file could not be uploaded.' +
        ' Please try later'
      this.alertService.warning(title, message)
    }

    this.getDailyUploadLimits()
  }

  timeSTFSubmission() {
    let date: any
    //Date Handling
    var dateObj = new Date(); //console.log(dateObj,"objjj")
    date =
      dateObj.getMonth() == 11
        ? new Date(dateObj.getFullYear() + 1, 0, 1)
        : new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1)
    //dateObj.getMonth() == 11 ? 1 : dateObj.getUTCMonth() + 2 //months from 1-12
    ////console.log(date)
    var day = 1
    this.current_year = dateObj.getUTCFullYear()
    // var date = this.current_year + '-' + month + '-' + day
    var locale = 'en-us'
    this.current_month = dateObj.toLocaleString(locale, { month: 'long' })

    interval(1000)
      .pipe(
        map(x => {
          this._diff = date - Date.parse(new Date().toString())
        })
      )
      .subscribe(x => {
        this._diff = this._diff < 0 ? 0 : this._diff
        this._days = this.getDays(this._diff)
        this._hours = this.getHours(this._diff)
        this._minutes = this.getMinutes(this._diff)
      })
    //Date Handling
  }

  getDays(t) {
    return Math.floor(t / (1000 * 60 * 60 * 24))
  }

  getHours(t) {
    return Math.floor((t / (1000 * 60 * 60)) % 24)
  }

  getMinutes(t) {
    return Math.floor((t / 1000 / 60) % 60)
  }

  onPhotoSelect(fileList: any) {
    if (this.badFileType || !fileList.length) {
      return
    }
    const file: File = fileList[0] //  ////console.log(file);

    const fileSize = fileList[0].size * 1e-6 // ////console.log(fileSize);
    const fileType = fileList[0].type
    if (fileType !== 'image/jpeg') {
      const title = 'Incorrect file type.'
      const message =
        'The file you have selected is not a JPG. ' +
        'Please make sure the photo is a <strong>.jpg</strong> or ' +
        '<strong>.jpeg</strong> file. You can read more about file types <u>here.</u>'
      this.alertService.warning(title, message)
      return
    } else if (fileSize < 1) {
      // reject files < 1Mb
      const title = 'File too small.'
      const message =
        'The file you have selected is too small. ' +
        'Please make sure the jpg file is between <strong>1MB</strong> and ' +
        '<strong>5MB</strong>. You can read more about file sizes <u> <a target="_blank" href="https://about.shoottheframe.com/tips/file-sizes/">here.<a></u>'
      this.alertService.warning(title, message)
      return
    } else if (fileSize > 5) {
      // reject files > 5Mb
      const title = 'File too large.'
      const message =
        'The file you have selected is too large. ' +
        'Please make sure the jpg file is between <strong>1MB</strong> and ' +
        '<strong>5MB</strong>. You can read more about file sizes <u>here.</u>'
      this.alertService.warning(title, message)
      return
    }

    this.readBase64(file).then(data => {
      this.width = data.width
      this.height = data.height
      this.photoUploader.onBuildItemForm = (item, form) => {
        form.append('width', this.width)
        form.append('height', this.height)
      }
      if (data.width < 1140) {
        const title = 'Not enough pixels.'
        const message =
          'The file you have selected is too small in pixels. ' +
          'Please make sure the <strong>longest side</strong> of the photo at least <strong>1140px</strong>.' +
          'You can read more about file sizes <u>here.</u>'
        this.alertService.warning(title, message)
        return
      } else {
        this.photoUploader.queue[0].upload()
      }
    })
    // Add in the other upload form parameters.
  }

  readBase64(file): Promise<any> {
    const reader = new FileReader()
    const future = new Promise((resolve, reject) => {
      reader.onload = (event: any) => {
        const image = new Image()
        image.src = event.target.result
        this.imageData = image.src
        localforage.setItem('currentImage', this.imageData)
        image.onload = () => {
          this.width = image.width
          this.height = image.height
          resolve({ width: image.width, height: image.height })
        }
      }
      reader.readAsDataURL(file)
    })
    return future
  }

  getDailyUploadLimits() {
    this.loaderService.display()
    this.photoUploadService
      .dailyUploadLimitService()
      .subscribe((response: any) => {
        this.loaderService.hide()
        this.daily_upload_limit = response.dailyUploads
        this.stf_submission_limit = response.submission
      })
  }

  infoModal() {
    const modalRef = this.modalService.open(InfoComponent)
  }

  infoUploadModal() {
    const modalRef = this.modalService.open(UploadInfoComponent)
  }
}
