import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'photo-upload',
  templateUrl: './photo-upload.component.html',
  styles: ['./photo-upload.component.css']
})
export class PhotoUploadComponent implements OnInit {
  hasHeading:boolean
  constructor(private title: Title) {}
  ngOnInit() {
    this.title.setTitle('Upload Photo | Shoot The Frame');
  }
}
