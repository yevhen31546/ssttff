import { Component, OnInit, Input, ViewChild } from '@angular/core'

@Component({
  selector: 'app-stf-award-logo',
  templateUrl: './stf-award-logo.component.html',
  styleUrls: ['./stf-award-logo.component.css']
})
export class StfAwardLogoComponent implements OnInit {
  @Input() item: any
  @Input() type: any
  @ViewChild('stfWinner') stfWinner: any
  @ViewChild('stfFinalist') stfFinalist: any

  constructor() {}

  ngOnInit() {
  }

  toggleWinner()
  {
    this.stfWinner.toggle();
  }

  toggleFinalist()
  {
    this.stfFinalist.toggle();
  }
}
