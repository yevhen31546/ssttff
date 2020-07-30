import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild, ElementRef , Inject,Optional} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { LoaderService, DataService } from '../../_services'
import { ProfileService } from '../profile/profile.service'
import { NgbTabset } from '@ng-bootstrap/ng-bootstrap'
import { retry } from 'rxjs/internal/operators/retry';
import { map } from 'rxjs/internal/operators/map';
import { catchError } from 'rxjs/internal/operators/catchError';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  profileDetails: any
  userId: any = ''
  searchTerm: string
  searchTermVal: string
  authUserDetails: any
  currentCatPage: number = 1
  categoryList: any = []
  @ViewChild('tabs')
  private tabs: NgbTabset
  selectedTab: any
  showPaginationLoader: boolean = false;
  @ViewChild('focusableSubmit')  focusableSubmit: ElementRef

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private route: ActivatedRoute,
    private loaderService: LoaderService,
    private profileService: ProfileService,
    private router: Router,
    private dataService: DataService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Search | Shoot The Frame');
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.userId = this.authUserDetails.id
    }
    this.dataService.searchData.subscribe(data => {
      this.categoryList = []
      this.currentCatPage = 1
      this.searchTerm = data
      this.getSearchCategories()
    })
    this.searchTermVal = this.route.snapshot.params.keyword; //console.log( this.searchTermVal);
  }

  searchTermFn() { 
    this.searchTermVal = this.searchTerm
    this.tabs.select(this.selectedTab)
    this.dataService.searchService(this.searchTerm)
  }


  getFocusOnSearchBtn(event: any) {
    if (event.keyCode == 13) { 
      this.focusableSubmit.nativeElement.click();
    }
  }

  tabChange(event) {
    this.selectedTab = event.nextId
    if (event.nextId == 'categories') {
      this.getSearchCategories()
    }
  }

  pageChanged() {
    this.currentCatPage = this.currentCatPage + 1
    this.getSearchCategories()
  }

  getSearchCategories() {
    let data = {
      searchKey: this.searchTermVal,
      page: this.currentCatPage,
      per_page: 10,
      userId: this.userId,
      type: 'category'
    }
    this.showPaginationLoader = true
    this.profileService.searchUserData(data).pipe(
      retry(3), // Retry up to 3 times before failing
      map(res => {

        return res;
      })
      //catchError(err => of([]))
    ).subscribe((response: any) => {
      this.categoryList = this.categoryList.concat(response.search_result) // some grid items: items
      this.showPaginationLoader = false;
    })
  }

  routeCategoryList(item) {
    this.router.navigate(['explore/category-details', item.id])
  }
}
