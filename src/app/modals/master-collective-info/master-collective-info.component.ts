import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'


@Component({
  selector: 'app-master-collective-info',
  templateUrl: './master-collective-info.component.html',
  styleUrls: ['./master-collective-info.component.scss']
})
export class MasterCollectiveInfoComponent implements OnInit {

  constructor(private modalActiveService:NgbActiveModal) { }

  ngOnInit() {
  }

  closeModal() {
    this.modalActiveService.close()
  }
}
