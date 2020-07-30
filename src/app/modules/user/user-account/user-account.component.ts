import { Inject, PLATFORM_ID } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { InfoComponent } from './../../shared/info/info.component';
import { Title } from '@angular/platform-browser';
import { DataService } from './../../../_services/data.service'
import { PhotoUploadService } from './../../photo-upload/photo-upload.service'
import { StripeUpdateService } from './../../../_services/stripeUpdate.service'
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout'
import { AlertService } from './../../../_services/alert.service'
import { UserService } from '../user.service'
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Optional,
  ElementRef
} from '@angular/core'
import { LoaderService } from '../../../_services'
import { ActivatedRoute, Router, UrlSegment } from '@angular/router'
import { NgbTabset, NgbTabChangeEvent, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { environment } from './../../../../environments/environment.prod'
import { Location, isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent implements OnInit, AfterViewInit {
  selectTab: any
  private stripeCheckoutHandler: StripeCheckoutHandler
  @ViewChild('tabs')
  private tabs: NgbTabset

  profileInfo: any
  expire: Boolean = false
  cardDetails: any = []
  userDetails: any = []
  // success: Boolean = false;
  currentTab: any = ''
  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
 @Inject(PLATFORM_ID) private platformId: Object,
    private userservice: UserService,
    private loaderservice: LoaderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private stripeCheckoutLoader: StripeCheckoutLoader,
    private stripeUpdateSrv: StripeUpdateService,
    private photoUploadSvc: PhotoUploadService,
    private dataService: DataService,
    private _title: Title,
    private modalService: NgbModal,
    private location: Location,
    private router: Router

  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
    if (this.localStorage.getItem('currentUser')) {
      this.userDetails = JSON.parse(this.localStorage.getItem('user'))
    }

    this.dataService.change.subscribe(data => {
      let userData   = data
      if(!data.details) {
         userData = JSON.parse(data)
      }
      this.localStorage.setItem('user', JSON.stringify(userData.user))
      this.userDetails = userData.user
    })
  
    this.selectTab =   this.router.url.split('/')[3]; //console.log(' this.selectTab ', this.selectTab )
   
    this.getUserProfile()
    this.stripeUpdateSrv.getStripe().subscribe(message => {
      this.updateCard()
    });
   }
    this._title.setTitle('Account Settings | Shoot The Frame');
  }

  public ngAfterViewInit() {
    this.stripeCheckoutLoader
      .createHandler({
        key: environment.STRIPE_PUBLISH_KEY,
        token: token => {
          const data = token
          //  ////console.log('profile token!', data);
        }
      })
      .then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler
      });
      this.tabs.select( this.selectTab);
  }

  getUserProfile() {
    ////console.log(this.userDetails)
    this.loaderservice.display()
    this.userservice
      .getProfileData(this.userDetails.username)
      .subscribe((response: any) => {
        this.profileInfo = response.user
        if (this.profileInfo.card_id) {
          this.cardDetail()
        } else {
          this.loaderservice.hide()
        }
        // if (this.selectTab) {
        //   this.tabs.activeId = ''
        //   this.tabs.select('billing')
        // }
      })
  }

  beforeChange(event: NgbTabChangeEvent) {
      
      //console.log( this.router.url.split('/').length,"router",this.router.url.split('/'))
    this.currentTab = event.nextId;
    let url: any = this.router.url.split('/').length === 4 ?  this.router.url.replace(this.router.url.split('/')[3], this.currentTab) : this.router.url;
     
//url = `${url}/${this.currentTab}`;
    this.location.go(url);
  }

  updateCard() {
    // this.stripeService.changeData('update');
    const image = 'assets/images/temp/stripe-logo.jpg'
    this.stripeCheckoutHandler
      .open({
        panelLabel: 'Update Card Details',
        label: 'Update Card Details',
        name: 'Shoot the Frame',
        image: image,
        allowRememberMe: false
      })
      .then((token: any) => {
        const data: any = token
        data.stripeToken = token.id
        data.stripeEmail = token.email
        data.cardId = token.card.id
        this.loaderservice.display()
        this.photoUploadSvc.updateCard(data).subscribe(
          res => {
            this.expire = false
            this.cardDetails = res.card
            this.alertService.success(res.title, res.message)
            this.loaderservice.hide()
            this.tabs.select(this.currentTab)
          },
          (error: any) => {
            this.loaderservice.hide()
            this.alertService.error(error.title, error.message)
            this.tabs.select(this.currentTab)
          }
        )
      })
      .catch(err => {
        // Payment failed or was canceled by user...
        if (err !== 'stripe_closed') {
          throw err
        }
      })
  }

  cardDetail() {
    this.userservice.getCardDetails().subscribe(
      (res: any) => {
        ////console.log(res, 'carddetail')
        const isExpiry = res.expires
        if (isExpiry === 0) {
          this.expire = false
        } else if (isExpiry === 1) {
          this.expire = true
          this.alertService.info('Payment card expiring soon', 'updateCard')
        } else {
          this.expire = true
          this.alertService.error('Payment card expired', 'updateCard')
        }
        this.cardDetails = res.card
        this.loaderservice.hide()
      },
      (error: any) => {
        this.loaderservice.hide()
      }
    )
  }

  infoModal() {
    const modalRef = this.modalService.open(InfoComponent)
  }
}
