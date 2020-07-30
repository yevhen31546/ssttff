import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit , Inject} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as MobileDetect from 'mobile-detect';


@Component({
  selector: 'app-upload-info',
  templateUrl: './upload-info.component.html',
  styleUrls: ['./upload-info.component.scss']
})
export class UploadInfoComponent implements OnInit {

  modalReference: any = false
  mobile: Boolean = false;

  constructor(@Inject(WINDOW) private window: Window, private modalActiveService: NgbActiveModal) {}

  ngOnInit() {

    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true;
    }
  }

  closeModal() {
    this.modalActiveService.close()
  }
}
