import { StripeUpdateService } from './../../_services/stripeUpdate.service';
import { AlertService } from '../../_services/alert.service'
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core'

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  message: any;
  title: any;
  type: any;
  constructor(private alertService: AlertService,
  private stripeUpdateSrv: StripeUpdateService) {}

  ngOnInit() {
    this.getAlertMsg();
  }

  close() {
    this.message = false
    return
  }

  getAlertMsg() {
    this.alertService.getMessage().subscribe(message => {
      if (message !== undefined) {
        //.log(message, 'messag')
        this.message = message.text
        this.title = message.title
        this.type = message.type
        ////console.log(this.type)
      }
      // setTimeout(() => this.close(), 5000);
    });
  }

  triggerUpdateCard() {
    this.stripeUpdateSrv.passStripe();
  }

  triggerCardOnClose() {
    this.stripeUpdateSrv.updateCardExpire().subscribe(res => {
      this.message = false;
    });
  }

  onClick() {
    ////console.log('heeeeeee')
  }
}
