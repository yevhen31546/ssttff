import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { InfoComponent } from './../../shared/info/info.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit , Inject, Optional} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { SubscriptionService } from '../subscription.service'

@Component({
  selector: 'app-subscription-upgrade',
  templateUrl: './subscription-upgrade.component.html',
  styleUrls: ['./subscription-upgrade.component.css']
})
export class SubscriptionUpgradeComponent implements OnInit {
  plan_type: string
  userDetails: any
  authDetails: any
  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private route: ActivatedRoute,
    private router: Router,
    private subservice: SubscriptionService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.authDetails = JSON.parse(this.localStorage.getItem('user'))
    ////console.log(this.authDetails)
    setTimeout(() => {
      this.getUserProfile()
    }, 2000)
    this.plan_type = this.capitalize(this.route.snapshot.queryParams['type'])
  }

  getUserProfile() {
    this.subservice.getProfileData(this.authDetails.username).subscribe((response: any) => {
      this.userDetails = response.user
    })
  }

  capitalize(name) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  showProfile() {
    this.router.navigate( [ '@' + this.userDetails.username])
  }

  infoModal() {
    const modalRef = this.modalService.open(InfoComponent)
  }
}
