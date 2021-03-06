import { Component, OnInit } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-critique-info',
  templateUrl: './critique-info.component.html',
  styleUrls: ['./critique-info.component.scss']
})
export class CritiqueInfoComponent implements OnInit {
  constructor(private modalActiveService: NgbActiveModal) {}

  ngOnInit() {}

  closeModal() {
    this.modalActiveService.close()
  }
}
