import { Title } from '@angular/platform-browser';
import { DataService } from './../../../_services/data.service'
// import { LoaderService } from './../../../../../.history/src/app/_services/loader.service_20181105101345'
import { ExploreMenuService } from './../explore-menu.service'
import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { ProfileService } from '../../profile/profile.service'
import { LoaderService } from '../../../_services'

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  perPage: number = 10
  currentPage: number = 1
  categoryList: any = []
  @Input() searchTerm: any
  @Input() userId: any
  emptyStatus: boolean = false
  paginationStatus: boolean = true
  showPaginationLoader: boolean = false

  constructor(
    private exploreMenuService: ExploreMenuService,
    private router: Router,
    private dataservices: DataService,
    private profileService: ProfileService,
    private loaderService: LoaderService,
    private title: Title
  ) {}

  ngOnInit() {
    this.getCategories();
    this.title.setTitle('Explore Categories | Shoot The Frame');
  }

  pageChanged() {
    if (this.paginationStatus == true) {
      this.currentPage = this.currentPage + 1
      this.getCategories()
    }
  }

  getCategories() {
    this.showPaginationLoader = true
    let data = {
      per_page: this.perPage,
      page: this.currentPage,
      type: 'new'
    }
    this.exploreMenuService.getCategoriesData(data).subscribe(
      (response: any) => {
        if (response.categories.length == 0 && this.currentPage != 1) {
          this.emptyStatus = true
        }
        if (response.categories.length == 0) {
          this.paginationStatus = false
        }
        this.categoryList = this.categoryList.concat(response.categories)
        this.showPaginationLoader = false
      },
      error => {
        this.showPaginationLoader = false
      }
    )
  }

  routeCategoryList(item) {
    this.dataservices.setData(item)
    this.router.navigate(['explore/category', item.type_id])
  }
}
