import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit , Inject,Optional} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { SubscriptionService } from '../subscription.service'

@Component({
  selector: 'app-subscription-downgrade',
  templateUrl: './subscription-downgrade.component.html',
  styleUrls: ['./subscription-downgrade.component.css']
})
export class SubscriptionDowngradeComponent implements OnInit {
  plan_type: string
  userDetails: any
  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private route: ActivatedRoute,
    private router: Router,
    private subservice: SubscriptionService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(this.localStorage.getItem('user'));
    this.getUserProfile();

    this.plan_type = this.capitalize(this.route.snapshot.queryParams['type'])
  }

  capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  showProfile() {
    this.router.navigate( [ '@' + this.userDetails.username])
  }

  getUserProfile() {
    this.subservice.getProfileData(this.userDetails.username).subscribe((response: any) => {
      this.userDetails = response.user
    })
  }
}
