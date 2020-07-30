import { Component, OnInit, Input, ViewChild } from '@angular/core'
import { DataService } from '../../_services'

@Component({
  selector: 'app-admin-stf-entries',
  templateUrl: './admin-stf-entries.component.html',
  styleUrls: ['./admin-stf-entries.component.css']
})
export class AdminStfEntriesComponent implements OnInit {
  selectedTab: any = 'all'
  selectedYear: any = 'Year'
  selectedMonth: any = 'Month'
  selectedCategory: any = 'Category'
  selectedWinner: any

  constructor(private dataServices: DataService) {}

  ngOnInit() {
    // this.dataServices.reload.subscribe((val: any) => {
    //   ////console.log(val)
    //   this.selectedCategory = val.category
    //   this.selectedMonth = val.month == '' ? 0 : val.month
    //   this.selectedYear = val.year
    //   this.selectedWinner = val.winnerListTab
    // })
  }

  tabChange(event) {
    this.selectedTab = event.nextId
  }


  selectedItems(val) {
    this.selectedCategory = val.category
    this.selectedMonth = val.month == '' ? 0 : val.month
    this.selectedYear = val.year
    this.selectedWinner = val.winnerListTab
  }
}
