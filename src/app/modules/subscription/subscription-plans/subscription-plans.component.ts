import { Inject, Optional } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Title } from '@angular/platform-browser';
import { environment } from './../../../../environments/environment'
import { AlertService } from './../../../_services/alert.service'
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout'

import { SubscriptionService } from './../subscription.service'
import { LoaderService, DataService } from '../../../_services'
import { Router, ActivatedRoute } from '@angular/router'
import { AuthenticationService } from '../../auth/authentication.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { InfoComponent } from '../../shared/info/info.component';
import { StfModalComponent } from '../../shared/stf-modal/stf-modal.component';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.css']
})
export class SubscriptionPlansComponent implements OnInit, AfterViewInit {
  private stripeCheckoutHandler: StripeCheckoutHandler
  isLogin: boolean = false
  activetab: string
  profileDetails: any
  activePlan: number
  modalReference: any = false
  selectedItem: any
  paymentStruct: any = {}
  paymentSubmission: any = {}
  isDownGrade: boolean = false
  image: string = 'assets/images/temp/stripe-logo.jpg'
  username: string
  userDetails: any
  modalTitle: string
  modalBody: string
  currentPlan: string

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private fb: FormBuilder,
    private subservice: SubscriptionService,
    private loaderservice: LoaderService,
    private alertService: AlertService,
    private dataService: DataService,
    private router: Router,
    private stripeCheckoutLoader: StripeCheckoutLoader,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private title: Title
  ) {

  }

  ngOnInit() {
    //this.card.on('tok_1DVbi0HcC6p6sp09fvhq3T6C')
    if (this.route.snapshot.queryParams['type'] == 'downgrade') {
      this.isDownGrade = true
    }
    if (this.localStorage.getItem('currentUser')) {
      let currentUser: any = JSON.parse(this.localStorage.getItem('currentUser'))
      this.userDetails = JSON.parse(this.localStorage.getItem('user'))
      this.isLogin = true
      this.username = currentUser.user.username
      this.getProfile()
    }
    this.activetab = 'monthly'
    this.paymentStruct = { basic: 1, pro: 2, premium: 3 }
    this.paymentSubmission = { one: 1, three: 3, seven: 7 };
    this.title.setTitle('Pricing | Shoot The Frame');
  }

  public ngAfterViewInit() {
    this.stripeCheckoutLoader
      .createHandler({
        key: environment.STRIPE_PUBLISH_KEY,
        token: token => {
          // Do something with the token...
          ////console.log('Payment successful!', token)
        }
      })
      .then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler

        if (
          this.localStorage.getItem('currentUser') &&
          this.localStorage.getItem('selected_plan')
        ) {
          let data = JSON.parse(this.localStorage.getItem('selected_plan'))
          if (data.interval == '') {
            this.purchaseAwardSubmission(data.type, data.price)
          } else if (data.type != 'basic') {
            this.upgradeStripeAccount(data.type, data.interval, data.price)
          }
          this.localStorage.removeItem('selected_plan')
        }
      })
  }

  /**
   * get user profile
   */
  public getProfile() {
    this.subservice
      .getProfileData(this.userDetails.username)
      .subscribe((response: any) => {
        this.profileDetails = response.user
        ////console.log(this.currentPlan)
        if (this.profileDetails.subscription_plan == 1) {
          this.currentPlan = 'Basic'
          this.activePlan =
            this.profileDetails.subscription_interval == 'monthly' ||
            this.profileDetails.subscription_interval == 'yearly'
              ? 1
              : 0
        } else if (this.profileDetails.subscription_plan == 2) {
          this.currentPlan = 'Pro'
          this.activePlan =
            this.profileDetails.subscription_interval == 'monthly' ? 2 : 5
        } else if (this.profileDetails.subscription_plan == 3) {
          this.currentPlan = 'Premium'
          this.activePlan =
            this.profileDetails.subscription_interval == 'monthly' ? 3 : 6
        }
      })
  }

  upgradeStripeAccount(type, interval, price = 0) {
    let desc =
      this.capitalize(type) + ' Membership -' + this.capitalize(interval)
    if (type != 'basic') {
      this.stripeCheckoutHandler
        .open({
          amount: price,
          currency: 'USD',
          name: 'Shoot the Frame',
          description: desc,
          image: this.image,
          closed: function() {
            this.localStorage.removeItem('selected_plan')
          }
        })
        .then((token: any) => {
          let data: any = token
          data.stripeToken = token.id
          data.planType = this.paymentStruct[type]
          data.planTypeName = type
          data.planInterval = interval
          data.stripeEmail = token.email
          data.cardId = token.card.id
          ////console.log(data, 'update')
           this.upgradePayment(data)
          this.localStorage.removeItem('selected_plan')
          // Do something with the token...
        })
        .catch(err => {
          // Payment failed or was canceled by user...
          if (err !== 'stripe_closed') {
            this.alertService.error(
              'Error',
              'Stripe payment failed.Please try again'
            )
          }
        })
    } else {
      let data: any = {}
      data.planType = this.paymentStruct[type]
      data.planTypeName = type
      data.planInterval = interval
      this.upgradePayment(data)
    }
  }

  /**
   *
   * @param type Downgrade Stripe account
   * @param interval
   * @param price
   */
  downgradeStripeAccount(type, interval, price = 0) {
    let desc =
      this.capitalize(type) + ' Membership -' + this.capitalize(interval)
    if (type != 'basic') {
      this.stripeCheckoutHandler
        .open({
          amount: price,
          currency: 'USD',
          name: 'Shoot the Frame',
          description: desc,
          image: this.image,
          closed: function() {
            this.localStorage.removeItem('selected_plan')
          }
        })
        .then((token: any) => {
          let data: any = token
          data.stripeToken = token.id
          data.planType = this.paymentStruct[type]
          data.planTypeName = type
          data.planInterval = interval
          data.stripeEmail = token.email
          data.cardId = token.card.id
          this.downgradePayment(data)
          this.localStorage.removeItem('selected_plan')
          // Do something with the token...
        })
        .catch(err => {
          // Payment failed or was canceled by user...
          if (err !== 'stripe_closed') {
            this.alertService.error(
              'Error',
              'Stripe payment failed.Please try again'
            )
          }
        })
    } else {
      let data: any = {}
      data.planType = this.paymentStruct[type]
      data.planTypeName = type
      data.planInterval = interval
      ////console.log(data)
      this.downgradePayment(data)
    }
  }

  openModal(content, type, interval, price = 0) {
    this.modalTitle = 'Downgrade to ' + this.capitalize(type)
    if (type == 'basic') {
      this.modalBody =
        'Are you sure you want to downgrade to ' +
        this.capitalize(type) +
        '? You will lose access to the ' +
        this.currentPlan +
        ' features. '
    } else {
      this.modalBody =
        'Are you sure you want to downgrade to  ' +
        this.capitalize(type) +
        '? You will no longer have access to the ' +
        this.currentPlan +
        ' features. '
    }

    this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      result => {
        this.downgradeStripeAccount(type, interval, price)
      },
      reason => {}
    )
  }

  closeModal() {
    if (this.modalReference) {
      this.modalReference.close()
    }
    //this.clearJobzoneCreate();
  }

  purchaseAwardSubmission(type, price = 0) {
    let desc = this.paymentSubmission[type] + ' submission into STF Awards'

    this.stripeCheckoutHandler
      .open({
        amount: price,
        currency: 'USD',
        name: 'Shoot the Frame',
        description: desc,
        image: this.image
      })
      .then((token: any) => {
        let data: any = token
        data.stripeToken = token.id
        data.submissionType = type
        data.stripeEmail = token.email
        data.cardId = token.card.id
        this.loaderservice.display()
        this.subservice.submissionPayment(data).subscribe(
          (response: any) => {
            this.loaderservice.hide()
            this.router.navigate(['subscription/submission'], {
              queryParams: { type: type }
            })
            // this.router.navigate(['subscription/upgrade'], {
            //   queryParams: { type: data.planTypeName }
            // })
          },
          error => {
            this.loaderservice.hide()
            this.alertService.error(
              'Error',
              'Something went wrong.Please try again'
            )
          }
        )
      })
      .catch(err => {
        // Payment failed or was canceled by user...
        if (err !== 'stripe_closed') {
          this.alertService.error(
            'Error',
            'Stripe payment failed.Please try again'
          )
          //throw err
        }
      })
  }

  upgradePayment(data) { //console.log("upgrafeeee")
    this.loaderservice.display()
    this.subservice.upgradeStripePayment(data).subscribe(
      (response: any) => {
        this.loaderservice.hide()
        ////console.log(this.paymentStruct[data.planType])
        this.router.navigate(['subscription/success/upgrade'], {
          queryParams: { type: data.planTypeName }
        })
      },
      error => {
        this.loaderservice.hide()
        this.alertService.error(
          'Error',
          'Something went wrong.Please try again'
        )
      }
    )
  }

  downgradePayment(data) {
    this.loaderservice.display()
    this.subservice.downgradeStripePayment(data).subscribe(
      (response: any) => {
        this.loaderservice.hide()
        this.router.navigate(['subscription/downgrade'], {
          queryParams: { type: data.planTypeName }
        })
      },
      error => {
        this.loaderservice.hide()
        this.alertService.error(
          'Error',
          'Something went wrong.Please try again'
        )
      }
    )
  }

  redirect(type, interval, price) {
    if (this.isLogin == false) {
      let data = { type: type, interval: interval, price: price }
      this.localStorage.setItem('selected_plan', JSON.stringify(data))
      this.router.navigate(['/sign-up'])
    }
  }

  // redirectSignup() {
  //   this.router.navigate(['/sign-up'], {
  //     queryParams: { returnUrl: 'subscription/plans' }
  //   })
  // }

  changeTab(tab) {
    if (this.isLogin == true) {
      this.getProfile()
    }
    this.activetab = tab
  }

  capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  showActive(activeIcon) {
    if (this.selectedItem != activeIcon) {
      this.selectedItem = activeIcon
    } else {
      this.selectedItem = ''
    }
  }

  /**
   * scroll down
   * @param $element
   */
  scrollToElement($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    })
  }

  infoModal() {
    const modalRef = this.modalService.open(InfoComponent)
  }

  stfModal() {
    const modalRef = this.modalService.open(StfModalComponent)
  }

}
