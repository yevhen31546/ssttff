import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { ProfileService } from './../../profile/profile.service'
import { Component, OnInit, Input , Inject,Optional} from '@angular/core';
import { HomeService } from '../home.service'
import { Masonry } from 'ng-masonry-grid'
import { ExploreMenuService } from '../../explore-menu/explore-menu.service'
import { Router } from '@angular/router'
import * as _ from 'lodash'

@Component({
  selector: 'app-home-daily-feeds',
  templateUrl: './home-daily-feeds.component.html',
  styleUrls: ['./home-daily-feeds.component.scss']
})
export class HomeDailyFeedsComponent implements OnInit {
  authUserDetails: any
  userPhotos: any = []
  isAuthUser: boolean = false
  currentPage: number = 1
  _masonry: any
  identifyType: string = 'dailyfeeds'
  currentItemWidth: number = 360
  currentMemberPage: number = 1
  memberData: any = []
  displayMembers: boolean = false
  userData: any = []
  userId: ''
  userName: string;
  @Input() redirectUrl;

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private homeService: HomeService,
    private exploreMenuService: ExploreMenuService,
    private router: Router,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    ////console.log(this.userData, 'userssss')
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      ////console.log(this.authUserDetails)
      this.userId = this.authUserDetails.id
      this.userName = this.authUserDetails.username
      this.isAuthUser = true
    }
    this.getProfile()
    this.getMemberProfile()
  }

  getMemberProfile() {
    let data = {
      type: 'featured',
      page: this.currentMemberPage,
      per_page: 10,
      user_id: this.userId
    }
    this.exploreMenuService.getMemberData(data).subscribe((response: any) => {
      this.memberData = response.users
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

  isDisplayNonMembers(event) {
    this.displayMembers = true
  }

  pageChanged() {
    this.currentMemberPage = this.currentMemberPage + 1
    this.getMemberProfile()
  }

  followUser(item) {
    const data = {
      follow_id: item.id
    }
    item.is_follow = item.is_follow == 0 ? 1 : 0
    this.profileService
      .followUser(data)
      .subscribe((res: any) => {}, (error: any) => {})
  }

  getProfile() {
    const data = {
      user_id: this.userId,
      username: this.userName
    }
    this.profileService.getProfileData(data).subscribe((res: any) => {
      this.userData = res.user
      this.displayMembers = this.userData.follow_count === 0 ? true : false
    })
  }
}
