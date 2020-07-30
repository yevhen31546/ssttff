import { WINDOW } from '@ng-toolkit/universal';
import { DataService } from './../../../_services/data.service'
import { Component, OnInit , Inject} from '@angular/core';
import * as MobileDetect from 'mobile-detect'
import { PhotoUploadService } from '../../photo-upload/photo-upload.service'

@Component({
  selector: 'app-home-stf-award-entries',
  templateUrl: './home-stf-award-entries.component.html',
  styleUrls: ['./home-stf-award-entries.component.scss']
})
export class HomeStfAwardEntriesComponent implements OnInit {
  identifyType: string = 'award-entries'
  award_entries: any = []
  month: any = []
  year: any = []
  categories: any = []
  selectedYear: any = ''
  selectedCategory: any = ''
  selectedMonth: any = ''
  expire: any = false
  success: any = false
  paramYear: any = ''
  paramMonth: any = ''
  paramCategories: any = ''
  showCategory: boolean = false
  winnerListTab: number = 0

  constructor(@Inject(WINDOW) private window: Window, 
    private photoUploadSvc: PhotoUploadService,
    private dataServices: DataService
  ) {}

  ngOnInit() {
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) { //console.log("mobile")
      this.selectedYear = 'Year'
      this.selectedCategory = 'Category'
      this.selectedMonth = 'Month'
    } else { //console.log("web")
      this.selectedYear = 'Year'
      this.selectedCategory = 'Category (Award)'
      this.selectedMonth = 'Month'
    }
    this.getMonthDetails()
    this.getYearDetails()
    this.getCategory()
  }

  getMonthDetails() {
    // this.month[0] = 'Month'
    this.month[0] = 'January'
    this.month[1] = 'February'
    this.month[2] = 'March'
    this.month[3] = 'April'
    this.month[4] = 'May'
    this.month[5] = 'June'
    this.month[6] = 'July'
    this.month[7] = 'August'
    this.month[8] = 'September'
    this.month[9] = 'October'
    this.month[10] = 'November'
    this.month[11] = 'December'
  }

  getYearDetails() {
    var currentYear = new Date().getFullYear(),
      years = []
    let startYear = 2012
    while (startYear <= currentYear) {
      years.push(startYear++)
    }
    this.year = years
  }

  getCategory() {
    this.photoUploadSvc.getStfCategories().subscribe((res: any) => {
      this.categories = res.categories
      ////console.log(this.categories)
    })
  }

  getWinners(curval) {
    this.winnerListTab = curval == 0 ? 1 : 0
    this.filterEntries()
  }

  filterEntries() { //console.log(this.selectedCategory,"selectedCategory", this.selectedMonth,"monyth", this.selectedYear)
    this.paramYear = this.selectedYear == 'Year' ? '' : this.selectedYear
    this.paramMonth =
      this.selectedMonth == 'Month' 
        ? ''
        : parseInt(this.selectedMonth) + 1
    this.paramCategories =
      this.selectedCategory == 'Category (Award)' || this.selectedCategory == 'Category'  ? '' : this.selectedCategory
    let params = {
      year: this.paramYear,
      month: this.paramMonth,
      category: this.paramCategories,
      type: this.identifyType,
      winnerListTab: this.winnerListTab
    }
    this.dataServices.passData(params)
  }
}
