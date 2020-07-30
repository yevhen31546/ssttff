import { Observable } from 'rxjs/Observable'
import { LoaderService } from './../../_services/loader.service'
import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  showLoader: Boolean = false;
  percentage: any
  isPublish: boolean
  text:string
  constructor(public loaderService: LoaderService) {
 this.getData()
  }

  ngOnInit() {
   
  }

  public getData() { //console.log("val")
    this.loaderService.status$.subscribe((val: any[]) => { //console.log(val)
      this.showLoader = val[0]
      this.percentage = val[1]
      this.isPublish = val[2]
      this.text = val[3]
    })
  }
}
