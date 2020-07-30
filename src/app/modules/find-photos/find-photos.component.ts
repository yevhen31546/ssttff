import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-find-photos',
  templateUrl: './find-photos.component.html',
  styleUrls: ['./find-photos.component.css']
})
export class FindPhotosComponent implements OnInit {
  tag_name: any
  identifyType: any;
  selectedTab: any = '';
  constructor(private route: ActivatedRoute,private title: Title) {}

  ngOnInit() {
    this.title.setTitle('Tags | Shoot The Frame');
    ////console.log(this.route.snapshot.params.type)
    this.tag_name = this.route.snapshot.params.search
    this.identifyType = this.route.snapshot.params.type
  }

  tabChange($event) {
    this.selectedTab = $event.nextId;
  }
}
