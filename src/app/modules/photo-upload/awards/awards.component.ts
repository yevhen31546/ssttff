import { SubscriptionService } from './../../subscription/subscription.service'
import { InfoComponent } from './../../shared/info/info.component'
import { AlertService } from './../../../_services/alert.service'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { LoaderService } from './../../../_services/loader.service'
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ElementRef
} from '@angular/core'
import { interval, Observable, Subscription, Observer } from 'rxjs'
import { map } from 'rxjs/operators'
import { PhotoUploadService } from '../photo-upload.service'
import { Router, ActivatedRoute } from '@angular/router'
import { environment as env } from '../../../../environments/environment'
import {
  HttpRequest,
  HttpEventType,
  HttpClient,
  HttpResponse
} from '@angular/common/http'
import * as localforage from 'localforage'
import * as _ from 'lodash'
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout'
import { Location } from '@angular/common'

@Component({
  selector: 'app-awards',
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.css']
})
export class AwardsComponent implements OnInit, AfterViewInit {
  private stripeCheckoutHandler: StripeCheckoutHandler

  _diff: number
  _days: number
  _hours: number
  _minutes: number
  _seconds: number
  current_month: string
  current_year: number
  percentDone: number
  publishData: boolean = false
  upload_id: number
  expanded: boolean
  imageData: any
  success: Boolean = false
  @Output()
  public deactivateGuard: EventEmitter<boolean> = new EventEmitter()
  @Input() imageDetails: any = []
  @Input() editAward: boolean
  submissionLimit: any = 0
  @Input() subjectImg: any = []
  @Input() stfAwardHtml: any
  category: any = 0
  continue: Boolean = false
  // modalRef: NgbModalRef;
  submissionType: String = ''
  imageToShow: any

  test = false
  stfCategory: any = false
  stfAward: any = true
  categories: any = []
  submissionPlans: any = []
  @ViewChild('stfSubmissionContent')
  stfSubmissionContent
  title = ''
  message = ''
  showTerms: Boolean
  showCondition: Boolean = false
  media: any
  @ViewChild('imageTag') imageTag: ElementRef
  isDisabled=false

  constructor(
    private photoUploadSvc: PhotoUploadService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private loaderService: LoaderService,
    private modalService: NgbModal,
    private stripeCheckoutLoader: StripeCheckoutLoader,
    public alertService: AlertService,
    private subservice: SubscriptionService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loaderService.display()
    if (this.stfAwardHtml) {
      this.expanded = true
    }

    ////console.log(this.expanded, this.submissionLimit, 'before')
    this.getCategories()
    this.stfSumbissionCategories()
    this.timeSTFSubmission()
    this.getDailyUploadLimits()
    this.photoUploadSvc.photoDetails$.subscribe((photoDetails: any) => {
      if (
        photoDetails.title == '' ||
        photoDetails.story == '' ||
        photoDetails.tags.length == 0 ||
        photoDetails.category_id == null ||
        photoDetails.photo_essay == null
      ) {
        this.router.navigate(['../category'], { relativeTo: this.route })
      }

      ////console.log(photoDetails)
      this.upload_id = photoDetails.id
      this.media = photoDetails.media
      ////console.log(this.media)
    })
    const _that = this
    localforage.getItem('currentImage').then(function(value) {
      _that.imageData = value
    })
  }

  public ngAfterViewInit() {
    this.stripeCheckoutLoader
      .createHandler({
        key: env.STRIPE_PUBLISH_KEY,
        token: token => {
          // Do something with the token...
          const data = token
          ////console.log('Payment successful!', data)
        }
      })
      .then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler
      })
  }

  imageLoaded(event) {
    this.loaderService.hide()
    // this.getBase64ImageFromURL(this.subjectImg).subscribe(base64data => {
    //   ////console.log(base64data)
    //   // this is the image as dataUrl
    //   this.imageData = 'data:image/jpg;base64,' + base64data
    // })
    // ////console.log(this.subjectImg)
    //this.toDataURL(this.subjectImg)
    //this.getImageFromService()
  }

  submitStfPayment(data: any) { //console.log("jdjdjjd")
    // this.location.go('shoottheframe.com/upload-photo/details/success/subscription/upgrade?type=premium')
    this.allowTemplate('cancel')
    data.submissionType = this.submissionType
    ////console.log(data)
    this.photoUploadSvc.stfSubmissionPurchase(data).subscribe((res: any) => {
      
      this.submissionLimit = res.submission_count
      this.title = res.title
      this.message = res.message
      this.stfAward = true
      this.alertService.success(this.title, this.message)
      this.success = true
      this.loaderService.hide();
    })
  }

  timeSTFSubmission() {
    let date: any
    //Date Handling
    var dateObj = new Date()
    date =
      dateObj.getMonth() == 11
        ? new Date(dateObj.getFullYear() + 1, 0, 1)
        : new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1)
    var day = 1
    this.current_year = dateObj.getUTCFullYear()
    var locale = 'en-us'
    this.current_month = dateObj.toLocaleString(locale, { month: 'long' })

    interval(1000)
      .pipe(
        map(x => {
          this._diff = date - Date.parse(new Date().toString())
        })
      )
      .subscribe(x => {
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

  publishPhoto() {
    this.isDisabled=true
    const formData: FormData = new FormData()
    formData.append('media', this.imageData)
    this.publishData = true
    formData.append('publish', '1')
    formData.append('upload_id', this.imageDetails.id)
    if (this.imageData) {
      const req = new HttpRequest(
        'POST',
        env.apiUrl + 'updateUploadPhotoDetails',
        formData,
        {
          reportProgress: true
        }
      )

      this.http.request(req).subscribe((event: any) => {
        // Via this API, you get access to the raw event stream.
        // Look for upload progress events.
        if (event.type === HttpEventType.UploadProgress) {
          // This is an upload progress event. Compute and show the % done:
          this.percentDone = Math.round((100 * event.loaded) / event.total)
          let text = 'Publishing your photo…'
          this.loaderService.display(this.percentDone, true, text)
        } else if (event instanceof HttpResponse) {
          if (event.status === 200) {
            const media = event.body.uploadDetails.localmedia
            this.photoUploadSvc.getGlide(media)
            this.photoUploadSvc
              .backGroupApi(this.imageDetails.id)
              .subscribe((res: any) => {})
          }

          this.loaderService.hide()
          this.deactivateGuard.emit(true)

          this.router.navigate(['/user/upload-photo/complete'])
        }
      })
    }
  }

  expand(value: boolean) {
    //////console.log(this.expanded, "before");
    this.expanded = value
    ////console.log(this.expanded, this.category)
    ////console.log(this.expanded, 'after')
    if (value === false) {
      ////console.log(value)
      this.showTerms = true
      this.setCategory('')
      this.continue = false
    } else {
      this.showCondition = false
    }
  }

  setCategory(val: any) {
    this.showCondition = true

    const _that = this
    this.showTerms = false
    _.map(this.categories, function(value: any, key: any) {
      ////console.log(key, value)
      if (value.id === val) {
        _that.category = val
      } else {
        _that.category = val
      }
    })
    this.continue = true
    ////console.log(_that.category)
  }

  stfInfoModal() {
    const modalRef = this.modalService.open(InfoComponent)

    modalRef.result
      .then(result => {})
      .catch(error => {
        ////console.log(error)
      })
  }

  purchaseAwardSubmission(type, price = 0, stfType) {
    
    ////console.log(type, stfType, price, 'hdsgfhksdgkhfdsjf')
    this.submissionType = stfType
    const desc = ''
    if (type === 'premium') {
      const desc = 'Premium Membership - Monthly'
    } else {
      const desc = type + ' submissions into  STF Awards'
    }
    const image = 'assets/images/temp/stripe-logo.jpg'
    this.stripeCheckoutHandler
      .open({
        amount: price * 100,
        currency: 'USD',
        name: 'Shoot the Frame',
        description: desc,
        image: image
      })
      .then(token => {
        const data: any = token
        if (type === 'premium') {
          data.stripeToken = token.id
          data.planType = 3
          data.planTypeName = type
          data.planInterval = 'monthly'
          data.stripeEmail = token.email
          // data.cardId = token.card.id;
          this.loaderService.display()
          this.upgradePayment(data);
        } else {
          data.stripeToken = token.id
          data.plan_type = type
          data.stripeEmail = token.email
          data.submissionType = this.submissionType;
          this.loaderService.display()

          this.submitStfPayment(data)
        }
      })
      .catch(err => {
        // Payment failed or was canceled by user...
        if (err !== 'stripe_closed') {
          throw err
        }
      })
  }

  upgradePayment(data) {
    this.subservice.upgradeStripePayment(data).subscribe(
      (response: any) => {
        //console.log(response)
        this.stfAward = true
        this.allowTemplate('cancel');
        this.title = response.title
        this.message = response.message
        setTimeout(() => {
          
          this.alertService.success( this.title,  this.message)
        }, 0);
        this.success = true
        
        
        this.submissionLimit = response.submission_count
        this.loaderService.hide();
        
        
      },
      error => {
        this.loaderService.hide()
        this.alertService.error(
          'Error',
          'Something went wrong.Please try again'
        )
      }
    )
  }

  capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  allowTemplate(type: any) {
    this.loaderService.display();
    this.stfAward = type === 'cancel' ||  type === 'success' ? true : false;
    this.success = type === 'success' ?  false : false;
    this.stfCategory = type === 'stf' ? true : false;
    // if (type == 'removeCancel') {
    //   this.removeCancel = true;
    // }
    this.loaderService.hide();

  }
  getCategories() {
    this.photoUploadSvc.getStfCategories().subscribe((res: any) => {
      this.categories = res.categories
    })
  }

  awardSubmission() {
    this.isDisabled=true
    const formData: FormData = new FormData()
    formData.append('media', this.imageData)
    formData.append('publish', '1')
    formData.append('upload_id', this.imageDetails.id)
    formData.append('award_category_id', this.category)

    const req = new HttpRequest(
      'POST',
      env.apiUrl + 'awardSubmission',
      formData,
      {
        reportProgress: true
      }
    )

    this.http.request(req).subscribe((event: any) => {
      // Via this API, you get access to the raw event stream.
      // Look for upload progress events.
      if (event.type === HttpEventType.UploadProgress) {
        // This is an upload progress event. Compute and show the % done:
        this.percentDone = Math.round((100 * event.loaded) / event.total)
        let text = 'Publishing your photo…'
        this.loaderService.display(this.percentDone, true, text)
      } else if (event instanceof HttpResponse) {
        ////console.log(event.body['awardDetails']['media'])
        if (event.status === 200) {
          const media = event.body.awardDetails.localmedia
          ////console.log(media)
          this.photoUploadSvc.getGlide(media) // api to call glide to resize image
          this.photoUploadSvc
            .backGroupApi(this.imageDetails.id)
            .subscribe((res: any) => {})
        }
        this.loaderService.hide()
        this.deactivateGuard.emit(true)
        if(!this.stfAwardHtml) {
        this.router.navigate([
          'user/upload-photo/complete',
          { 'stf-submission': 'true' }
        ]);
      } else {
        this.router.navigate([
          `user/upload-photo/submit-stf-awards/${this.imageDetails.id}/complete`,
          { awardsuccess: 'true' }
        ]);

      }
      }
    })
  }

  stfSumbissionCategories() {
    this.photoUploadSvc.getstfSumbissionCategories().subscribe((res: any) => {
      this.submissionPlans = res.plans
      ////console.log(res, 'plans')
    })
  }

  getDailyUploadLimits() {
    this.photoUploadSvc.dailyUploadLimitService().subscribe((response: any) => {
      this.submissionLimit = response.submission
    })
  }

  // getBase64ImageFromURL(url: string) {
  //   return Observable.create((observer: Observer<string>) => {
  //     // create an image object
  //     let img = new Image()
  //     img.crossOrigin = 'Anonymous'
  //     img.src = url
  //     if (!img.complete) {
  //       // This will call another method that will create image from url
  //       img.onload = () => {
  //         observer.next(this.getBase64Image(img))
  //         observer.complete()
  //       }
  //       img.onerror = err => {
  //         observer.error(err)
  //       }
  //     } else {
  //       observer.next(this.getBase64Image(img))
  //       observer.complete()
  //     }
  //   })
  // }

  // getBase64Image(img: HTMLImageElement) {
  //   // We create a HTML canvas object that will create a 2d image
  //   var canvas = document.createElement('canvas')
  //   canvas.width = img.width
  //   canvas.height = img.height
  //   var ctx = canvas.getContext('2d')
  //   // This will draw image
  //   ctx.drawImage(img, 0, 0)
  //   // Convert the drawn image to Data URL
  //   var dataURL = canvas.toDataURL('image/png')
  //   return dataURL.replace(/^data:image\/(png|jpg);base64,/, '')
  // }

  // toDataURL(url) {
  //   var xhr = new XMLHttpRequest()
  //   xhr.open('GET', url)
  //   xhr.responseType = 'blob'
  //   xhr.onload = () => {
  //     var reader = new FileReader()

  //     reader.onloadend = () => {
  //       this.imageData = reader.result
  //       ////console.log(this.imageData)
  //       ////console.log(reader.result)
  //     }
  //     reader.readAsDataURL(xhr.response)
  //   }
  //   xhr.send()
  // }
}
// }
