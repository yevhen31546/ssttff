import { Component, OnInit, Input } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-insight-info',
  templateUrl: './insight-info.component.html',
  styleUrls: ['./insight-info.component.scss']
})
export class InsightInfoComponent implements OnInit {
  @Input() type: string

  constructor(private modalActiveService: NgbActiveModal) {}

  ngOnInit() {}

  closeModal() {
    this.modalActiveService.close()
  }
}
