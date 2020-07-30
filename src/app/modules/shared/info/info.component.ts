import { WINDOW } from '@ng-toolkit/universal';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit , Inject} from '@angular/core';
import * as MobileDetect from 'mobile-detect';


@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

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
