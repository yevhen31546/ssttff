import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, Input , Inject,Optional} from '@angular/core';
import { ProfileService } from './../profile.service'
import { LoaderService } from '../../../_services'
import { Router } from '@angular/router'
import * as _ from 'lodash'

@Component({
  selector: 'app-followings',
  templateUrl: './followings.component.html',
  styleUrls: ['./followings.component.css']
})
export class FollowingsComponent implements OnInit {
  listData: any = []
  userDetails: any
  @Input() userId: number
  @Input() profileDetails: any
  isOwnFollowings: Boolean = false
  loggedUser: any = ''
  current_page: number = 1
  showPaginationLoader: boolean = false
  paginationStatus: boolean = true
  emptyStatus: boolean = false
  authUserDetails: any

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private profileService: ProfileService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.localStorage.getItem('currentUser')) {
      this.userDetails = JSON.parse(this.localStorage.getItem('currentUser'))
      ////console.log(this.userDetails)
      this.loggedUser = this.userDetails.user.id
    }
    this.getFollowings()
  }

  pageChanged() {
    if (this.paginationStatus == true) {
      this.current_page = this.current_page + 1
      this.getFollowings()
    }
  }

  /**
   *Get Following List
   */
  getFollowings() {
    ////console.log(this.userId + '--' + this.loggedUser)
    if (this.loggedUser == this.userId) {
      this.isOwnFollowings = true
    }
    this.showPaginationLoader = true
    let data = {
      type: 'following',
      per_page: 10,
      user_id: this.userId,
      page: this.current_page
    }
    this.profileService.listFriends(data).subscribe(
      (res: any) => {
        if (res.followings.length == 0 && this.current_page != 1) {
          this.emptyStatus = true
        }
        if (res.followings.length == 0) {
          this.paginationStatus = false
        }
        this.listData = this.listData.concat(res.followings)
        this.showPaginationLoader = false
      },
      (error: any) => {
        this.showPaginationLoader = false
      }
    )
  }

  /**
   *
   * @param userId
   */
  unFollowUser(item, index) {
    if (!this.userDetails) {
      this.router.navigate(['/sign-up'])
    } else {
      let data = {
        follow_id: item.to_user_id
      }
      item.is_follow = item.is_follow == 0 ? 1 : 0
      if (item.is_follow == 0 && this.isOwnFollowings == true) {
        this.listData.splice(index, 1)
      }
      this.profileService.followUser(data).subscribe(
        (res: any) => {
          ////console.log(this.listData)
          //this.listData = res.followings
          //this.getFollowings()
        },
        (error: any) => {
          // this.loaderservice.hide()
        }
      )
    }
  }

  /**
   * Show Profle
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

  featuredMembersNavigate() {
    this.router.navigate(['explore/members']);
  }
}
