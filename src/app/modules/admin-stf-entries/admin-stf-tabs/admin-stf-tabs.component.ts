import { Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild
} from '@angular/core'
import { DataService } from './../../../_services/data.service'
import * as MobileDetect from 'mobile-detect'
import { PhotoUploadService } from '../../photo-upload/photo-upload.service'

@Component({
  selector: 'app-admin-stf-tabs',
  templateUrl: './admin-stf-tabs.component.html',
  styleUrls: ['./admin-stf-tabs.component.css']
})
export class AdminStfTabsComponent implements OnInit {
  identifyType: string = 'admin-award-entries'
  award_entries: any = []
  month: any = []
  year: any = []
  categories: any = []
  @Input() selectedYear: any = ''
  @Input() selectedMonth: any = ''
  @Input() selectedCategory: any = ''
  @Input() selectedType: any = ''
  @Input() selectedWinner: any = ''
  @ViewChild('myselect') myselect

  expire: any = false
  success: any = false
  paramYear: any = ''
  paramMonth: any = ''
  paramCategories: any = ''
  showCategory: boolean = false
  winnerListTab: number = 0
  @Input() selectedTab: any
  @Output('filters') filters: EventEmitter<any> = new EventEmitter<any>()
  constructor(@Inject(WINDOW) private window: Window, 
    private photoUploadSvc: PhotoUploadService,
    private dataServices: DataService
  ) {}

  ngOnInit() {
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.selectedYear =
        typeof this.selectedYear === 'undefined' ? '' : this.selectedYear
      this.selectedCategory =
        typeof this.selectedCategory === 'undefined'
          ? ''
          : this.selectedCategory
      this.selectedMonth =
        typeof this.selectedMonth === 'undefined' ? '' : this.selectedMonth
    }
    // this.winnerListTab = this.selectedWinner
    this.getMonthDetails()
    this.getYearDetails()
    this.getCategory()
    //this.getWinners(this.winnerListTab)
    this.filterEntries()
    //this.myselect.select(this.selectedCategory)
  }

  getMonthDetails() {
    this.month[0] = 'Month'
    this.month[1] = 'January'
    this.month[2] = 'February'
    this.month[3] = 'March'
    this.month[4] = 'April'
    this.month[5] = 'May'
    this.month[6] = 'June'
    this.month[7] = 'July'
    this.month[8] = 'August'
    this.month[9] = 'September'
    this.month[10] = 'October'
    this.month[11] = 'November'
    this.month[12] = 'December'
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
    })
  }

  getWinners(curval) {
    this.winnerListTab = curval == 0 ? 1 : 0
    this.filterEntries()
  }

  filterEntries() {
    this.paramYear = this.selectedYear === 'Year' ? '' : this.selectedYear
    this.paramMonth =
      this.selectedMonth === 'Month' || this.selectedMonth === 0
        ? ''
        : this.selectedMonth
    this.paramCategories =
      this.selectedCategory === 'Category' ? '' : this.selectedCategory
    let params = {
      year: this.paramYear,
      month: this.paramMonth,
      category: this.paramCategories,
      type: this.identifyType,
      tab: this.selectedTab,
      winnerListTab: this.winnerListTab,
      filter: true
    }
    this.filters.emit(params)
    this.dataServices.passData(params)
  }
}
