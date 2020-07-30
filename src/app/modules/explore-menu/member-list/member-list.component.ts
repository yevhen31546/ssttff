import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { ExploreMenuService } from './../explore-menu.service'
import { LoaderService } from './../../../_services/loader.service'
import { Component, OnInit, Input, Output, EventEmitter , Inject,Optional} from '@angular/core';
import * as _ from 'lodash'
import { ProfileService } from '../../profile/profile.service'
import { Router } from '@angular/router'
import { DataService } from '../../../_services'

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  currentPage: number = 1
  @Input() userId: number
  memberData: any = []
  @Input() searchTerm: any
  @Input() categoryType: any
  isLogin: boolean = false
  authUserDetails: any
  showPaginationLoader: boolean = true
  emptyStatus: boolean = false
  @Output() loaderClose: EventEmitter<any> = new EventEmitter()
  paginationCheck: boolean = false

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private loaderService: LoaderService,
    private exploreMenuService: ExploreMenuService,
    private profileService: ProfileService,
    private router: Router,
    private dataServices: DataService
  ) {}

  ngOnInit() {
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.isLogin = true
      this.userId = this.authUserDetails.id
    }

    this.dataServices.searchData.subscribe(data => {
      this.memberData = []
      this.currentPage = 1
      this.searchTerm = data
      this.getSearchMemberProfile()
    })
    if (this.searchTerm) {
      this.getSearchMemberProfile()
    } else {
      this.getMemberProfile()
    }
  }

  pageChanged() {
    if (this.paginationCheck == false) {
      this.showPaginationLoader = true
      this.currentPage = this.currentPage + 1
      if (this.searchTerm) {
        this.getSearchMemberProfile()
      } else {
        this.getMemberProfile()
      }
    }
  }

  /**
   * Get Member Profile
   */

  getMemberProfile() {
    // this.loaderService.display()
    let data = {
      page: this.currentPage,
      type: this.categoryType,
      per_page: 10,
      user_id: this.userId
    }
    this.exploreMenuService.getMemberData(data).subscribe((response: any) => {
      // this.loaderService.hide()
      let users = response.users
      if (users.length == 0 && this.currentPage != 1) {
        this.emptyStatus = true
      }
      if (users.length == 0) {
        this.paginationCheck = true
      }
      for (let i = 0; i < users.length; ++i) {
        users[i].page = data.page
        if (users[i].photo_url == '') {
          users[i].localmedia = 'assets/images/temp/user-icon.svg'
        } else {
          users[i].localmedia =
            users[i].localmedia + '--glide?w=48&fit=crop&q=80'
        }
        this.memberData.push(users[i])
      }
      this.loaderClose.emit()
      this.showPaginationLoader = false
      //this.memberData = this.memberData.concat(response.users)
    })
  }

  getSearchMemberProfile() {
    let data = {
      searchKey: this.searchTerm,
      page: this.currentPage,
      per_page: 10,
      userId: this.userId,
      type: 'members'
    }
    this.showPaginationLoader = true
    this.profileService.searchUserData(data).subscribe((response: any) => {
      if (response.search_result.length == 0 && this.currentPage != 1) {
        this.emptyStatus = true
      }
      this.memberData = this.memberData.concat(response.search_result) // some grid items: items
      this.showPaginationLoader = false
    })
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
   * show Profile
   * @param username
   */
  showProfile(username) {
    this.router.navigate( [ '@' + username])
  }

  /**
   *
   * @param userId
   */
  followUser(item) {
    if (this.isLogin == false) {
      this.router.navigate(['sign-up'])
    } else {
      let data = {
        follow_id: item.id
      }
      item.is_follow = item.is_follow == 0 ? 1 : 0
      this.profileService.followUser(data).subscribe(
        (res: any) => {
          // this.memberData = []
          // if (this.searchTerm) {
          //   this.getSearchMemberProfile()
          // } else {
          //   this.getMemberProfile()
          // }
        },
        (error: any) => {}
      )
    }
  }
}
