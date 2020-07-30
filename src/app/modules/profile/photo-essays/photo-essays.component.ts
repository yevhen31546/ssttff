import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-photo-essays',
  templateUrl: './photo-essays.component.html',
  styleUrls: ['./photo-essays.component.css']
})
export class PhotoEssaysComponent implements OnInit {
  constructor() {}

  ngOnInit() {
    this.getPhotoEssays()
  }

  getPhotoEssays() {}
}
