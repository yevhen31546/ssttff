import { Component, OnInit, Input } from '@angular/core'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-critique-component-info',
  templateUrl: './critique-component-info.component.html',
  styleUrls: ['./critique-component-info.component.scss']
})
export class CritiqueComponentInfoComponent implements OnInit {
  @Input() type: string

  constructor(private modalActiveService:NgbActiveModal) {}

  ngOnInit() {}

  closeModal() {
    this.modalActiveService.close()
  }
}
