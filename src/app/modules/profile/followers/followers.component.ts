import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, Input , Inject,Optional} from '@angular/core';
import { ProfileService } from './../profile.service'
import { LoaderService } from '../../../_services'
import { Router } from '@angular/router'
import * as _ from 'lodash'

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css']
})
export class FollowersComponent implements OnInit {
  listData: any = []
  @Input() userId: number
  @Input() profileDetails: any
  authUserDetails: any = []
  loggedUser: any = ''
  isOwnFollowers: boolean = false
  @Input() searchTerm: any
  currentPage: number = 1
  current_page: number = 1
  showPaginationLoader: boolean = false
  paginationStatus: boolean = true
  emptyStatus: boolean = false

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private profileService: ProfileService,
    private loaderService: LoaderService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.loggedUser = this.authUserDetails.id
    }

    this.getFollowers()
  }

  pageChanged() {
    if (this.paginationStatus == true) {
      this.current_page = this.current_page + 1
      this.getFollowers()
    }
  }

  getFollowers() {
    if (this.loggedUser == this.userId) {
      this.isOwnFollowers = true
    }
    this.showPaginationLoader = true
    let data = {
      type: 'follower',
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
  followUser(item) {
    if (!this.authUserDetails) {
      this.router.navigate(['/sign-up'])
    } else {
      let data = {
        follow_id: item.from_user_id
      }
      item.is_follow = item.is_follow == 0 ? 1 : 0
      this.profileService.followUser(data).subscribe(
        (res: any) => {
          // this.listData = res.followings
          // this.getFollowers()
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

  gotoUploadPhotos() {
    this.router.navigate(['user/upload-photo'])
  }

  getLocation(location: string) {
    if (location) {
      const loc = _.split(location, ',')
      return _.last(loc)
    } else {
      return 'The World'
    }
  }
}
