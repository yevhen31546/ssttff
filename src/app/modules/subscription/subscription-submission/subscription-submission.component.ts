import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit , Inject,Optional} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { SubscriptionService } from '../subscription.service'

@Component({
  selector: 'app-subscription-submission',
  templateUrl: './subscription-submission.component.html',
  styleUrls: ['./subscription-submission.component.css']
})
export class SubscriptionSubmissionComponent implements OnInit {
  userDetails: any
  paymentSubmission: any
  type: any
  current_year: any
  current_month: string
  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private router: Router,
    private route: ActivatedRoute,
    private subservice: SubscriptionService
  ) {
    this.paymentSubmission = { one: 1, three: 3, seven: 7 }
    var dateObj = new Date()
    var month = dateObj.getUTCMonth() + 1 //months from 1-12
    var day = 30
    this.current_year = dateObj.getUTCFullYear()
    var date = this.current_year + '-' + month + '-' + day
    var locale = 'en-us'
    this.current_month = dateObj.toLocaleString(locale, { month: 'long' })
  }

  ngOnInit() {
     this.userDetails = JSON.parse(this.localStorage.getItem('user'));
     this.getUserProfile()
    this.type = this.paymentSubmission[this.route.snapshot.queryParams['type']]
  }

  getUserProfile() {
    this.subservice.getProfileData(this.userDetails.username).subscribe((response: any) => {
      this.userDetails = response.user;
    })
  }

  showProfile() {
    this.router.navigate( [ '@' + this.userDetails.username])
  }

  goToUploadPhotos() {
    this.router.navigate(['user/upload-photo'])
  }
}
