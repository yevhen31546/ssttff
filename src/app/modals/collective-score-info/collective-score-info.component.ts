import { Component, OnInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-collective-score-info',
  templateUrl: './collective-score-info.component.html',
  styleUrls: ['./collective-score-info.component.scss']
})
export class CollectiveScoreInfoComponent implements OnInit {
  constructor(private modalActiveService: NgbActiveModal) {}

  ngOnInit() {}

  closeModal() {
    this.modalActiveService.close()
  }
}
