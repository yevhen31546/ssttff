import { Observable } from 'rxjs/Observable'
import { LayoutLoaderService } from './../../_services/layout-loader.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-layout-loader',
  templateUrl: './layout-loader.component.html',
  styleUrls: ['./layout-loader.component.css']
})
export class LayoutLoaderComponent implements OnInit {
  showLoader: any
  constructor(private layoutLoaderService: LayoutLoaderService) {}

  ngOnInit() {
    this.getData()
  }

  public getData() {
    this.layoutLoaderService.status$.subscribe((val: any) => {
     // alert(val)
      this.showLoader = val
    })
  }
}
