import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit , Inject} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as MobileDetect from 'mobile-detect';

@Component({
  selector: 'app-stf-modal',
  templateUrl: './stf-modal.component.html',
  styleUrls: ['./stf-modal.component.css']
})
export class StfModalComponent implements OnInit {

  closeButton: boolean = false;
  modalReference: any = false
  mobile: Boolean = false;


  constructor(@Inject(WINDOW) private window: Window,  public activeModal: NgbActiveModal) { }

  ngOnInit() {
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true;
    }
  }

  closeModal() {
    this.closeButton = false

    if (this.modalReference) {
      this.modalReference.close()
    }
  }

}
