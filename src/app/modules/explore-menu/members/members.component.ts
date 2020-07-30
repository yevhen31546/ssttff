import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, Input , Inject, Optional} from '@angular/core';
import { AlertService, LoaderService } from './../../../_services'
import { ExploreMenuService } from './../explore-menu.service'
import { Route, Router } from '@angular/router'
import * as _ from 'lodash'
import { ProfileService } from '../../profile/profile.service'
import { Title } from '@angular/platform-browser'

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  memberData: any = []
  currentPage: number = 1
  authUserDetails: any
  isLogin: boolean = false
  showMemberLoader: number=0

  userId: any = ''
  categoryType:any="featured"

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private exploreMenuService: ExploreMenuService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private profileService: ProfileService,
    private router: Router,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.titleService.setTitle('Explore Members | Shoot The Frame')
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.isLogin = true
      this.userId = this.authUserDetails.id
    }
    this.getMemberProfile()
  }

  pageChanged() {
    this.currentPage = this.currentPage + 1
    this.getMemberProfile()
  }

  /**
   * Get Member Profile
   */

  getMemberProfile() {
    let data = { page: this.currentPage, per_page: 10, user_id: this.userId }
    this.exploreMenuService.getMemberData(data).subscribe((response: any) => {
      this.loaderService.hide()
      this.memberData = this.memberData.concat(response.users)
      //this.showMemberLoader = 0
    })
  }

  /**
   * show Profile
   * @param username
   */
  showProfile(username) {
    this.router.navigate( [ '@' + username])
  }

  getLocation(location: string) {
    if (location) {
      const loc = _.split(location, ',')
      return _.last(loc)
    } else {
      return 'The World'
    }
  }

  /**
   *
   * @param userId
   */
  followUser(item) {
    if (this.isLogin == false) {
      this.router.navigate(['/sign-up'])
    } else {
      let data = {
        follow_id: item.id
      }
      item.is_follow = item.is_follow == 0 ? 1 : 0

      this.profileService
        .followUser(data)
        .subscribe((res: any) => {}, (error: any) => {})
    }
  }

  tabChange(event: any) {
    this.categoryType = event.nextId
  }

  loaderClose() {
    this.showMemberLoader = 1
  }
}
