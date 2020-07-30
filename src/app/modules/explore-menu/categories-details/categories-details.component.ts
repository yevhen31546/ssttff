import { DataService } from './../../../_services/data.service'
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { ExploreMenuService } from '../explore-menu.service'

@Component({
  selector: 'app-categories-details',
  templateUrl: './categories-details.component.html',
  styleUrls: ['./categories-details.component.scss']
})
export class CategoriesDetailsComponent implements OnInit {
  categoryDetails: any
  categoryType: string
  category: any
  expire: any = false;
  success: any = false;
  subjectId: any
  constructor(
    private dataServices: DataService,
    private route: ActivatedRoute,
    private exploreMenuService: ExploreMenuService
  ) {}

  ngOnInit() {

    this.subjectId = this.route.snapshot.paramMap.get('categoryname')
    this.categoryType = 'new'
    this.categoryDetails = this.dataServices.getData()
    this.getCategoryDetails()
  }

  getCategoryDetails() {
    let data = {
      type_id: this.subjectId
    }
    this.exploreMenuService.getEachCategoriesData(data).subscribe(
      (response: any) => {
        this.category = response.category
      },
      error => {}
    )
  }

  tabChange(event: any) {
    this.categoryType = event.nextId
  }
}
