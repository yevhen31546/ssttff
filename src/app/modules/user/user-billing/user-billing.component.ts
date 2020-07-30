import { Router } from '@angular/router';
import { LoaderService } from './../../../_services/loader.service';
import { AlertService } from './../../../_services/alert.service';
import { StripeUpdateService } from './../../../_services/stripeUpdate.service';
import { DataService } from './../../../_services/data.service';
import { User } from './../../../_stores/user/user';
import { UserService } from './../user.service';
import { Component, OnInit, Input } from '@angular/core';
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout';
import { PhotoUploadService } from './../../photo-upload/photo-upload.service';
import { environment } from './../../../../environments/environment.prod';
import * as moment from 'moment';

@Component({
  selector: 'app-user-billing',
  templateUrl: './user-billing.component.html',
  styleUrls: ['./user-billing.component.css']
})
export class UserBillingComponent implements OnInit {


  @Input() userDetail: any;
  @Input() cardDetails: any;
  userType: String = '';
  subscriptionPlan: any = '';
  // cardDetails: any = [];
  orderHistory: any = [];
  showHistory: Boolean = false;

  constructor(
    private photoUploadSvc: PhotoUploadService,
    private stripeService: StripeUpdateService,
    private _userService: UserService,
    private alertService: AlertService,
    private loaderService: LoaderService,
   private route: Router ) { }


  ngOnInit() {
      this.loaderService.display();
      this.subscriptionPlan = this.userDetail.subscription_plan;
      this.userType =  this.subscriptionPlan === 3 ? 'Premium' : (this.subscriptionPlan === 2 ? 'Pro' : 'Basic');
     this.getOrderHistory();
     this.loaderService.hide();

  }



  updateCard() {
    // this.stripeService.changeData('update');
    this.stripeService.passStripe();
   }

  getOrderHistory() {
    this._userService.getOrderHistory().subscribe((res: any) => {
        //  ////console.log(res,"history");
        this.orderHistory = res.orderHistory;
    });
  }

  showHistoryTab() {
      this.showHistory = this.showHistory === false ? true : false;
  }

  downgrade() {
    this.route.navigate(['/subscription/plans'], { queryParams: { type: 'downgrade' } });
  }

  getDates(data: any) {

    return moment(data).format('MMM, DD YYYY');
  }

}
