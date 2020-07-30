import { ProfileService } from './../../profile/profile.service'
import { LoaderService } from './../../../_services/loader.service'
import { AlertService } from './../../../_services/alert.service'
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';

import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core'
// import * as jspdf from 'jspdf'
import html2canvas from 'html2canvas'
import { Router, ActivatedRoute } from '@angular/router'
import { UserService } from '../user.service'
import { DOCUMENT } from '@angular/platform-browser';
import * as moment from 'moment';

@Component({
  selector: 'app-user-receipt',
  templateUrl: './user-receipt.component.html',
  styleUrls: ['./user-receipt.component.css'],
  providers: [AlertService]
})
export class UserReceiptComponent implements OnInit, AfterViewInit {
  receiptDetails: any
  id: string
  @ViewChild('myId') myId: ElementRef
  constructor(
    @Inject(WINDOW) private window: Window,
    private loaderService: LoaderService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService
  ) {}

  ngOnInit() { //console.log("router")
    this.id = this.route.snapshot.paramMap.get('id')
    this.getReceiptDetails()
  }

  ngAfterViewInit() {
    //////console.log(this.myId.nativeElement);
  }

  /**
   *Fetch Receipt Details
   */
  getReceiptDetails() {
    this.loaderService.display()
    let data = { id: this.id }
    this.userService.getReceiptData(data).subscribe(
      (response: any) => {
        this.loaderService.hide()
        this.receiptDetails = response.orderDetails
        // this.receiptDetails.address = this.receiptDetails.address.split(',')
      },
      error => {
        this.loaderService.hide()

        let response = error.error
        //   this.eventService.loaderVisibility.next(false)
        if (response.status == false) {
          if (response.error) {
            //this.validationErrors = response.error
          } else {
            this.alertService.error(response.title, response.common_error)
          }
        }
      }
    )
  }

  /**
   * redirect to billing page
   */
  backToBilling() {
    this.router.navigate(['/user/account-settings/profile'], {
      queryParams: { selecttab: 'tab-billing' }
    })
  }

  /**
   * convert screen to pdf
   */
  public captureScreen() {
    this.loaderService.display()
    //var data = document.getElementById('contentToConvert')
    // html2canvas(this.myId.nativeElement).then(canvas => {
    //   this.loaderService.hide()
    //   // Few necessary setting options
    //   var imgWidth = 208
    //   var pageHeight = 295
    //   var imgHeight = (canvas.height * imgWidth) / canvas.width
    //   var heightLeft = imgHeight

    //   const contentDataURL = canvas.toDataURL('image/jpeg', 1.0)

    //   let pdf = new jspdf('p', 'mm', 'a4') // A4 size page of PDF
    //   var position = 25
    //   pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)

    //   pdf.save('Shoot-The-Frame-' + this.receiptDetails.invoice_id + '.pdf') // Generated PDF
    // })
  }

  /**
   * Print document
   */
  print(): void {
    let printContents, popupWin
    //var data = document.getElementById('contentToConvert')
    html2canvas(this.myId.nativeElement).then(canvas => {
      this.loaderService.hide()
      // Few necessary setting options
      var imgWidth = 208
      var pageHeight = 295
      var imgHeight = (canvas.height * imgWidth) / canvas.width
      var heightLeft = imgHeight

      const contentDataURL = canvas.toDataURL('image/jpeg', 1.0)

      printContents = "<img src='" + contentDataURL + "'>"
      popupWin = this.window.open(
        '',
        '_blank',
        'top=0,left=0,height=100%,width=auto'
      )
      popupWin.document.open()
      popupWin.document.write(`
        <html>
          <head>
          <title></title>
          </head>
         <body onload="window.print();window.close()">${printContents}</body>
        </html>`)
      popupWin.document.close()
    })
  }

  getDate(data: any) {

    return moment(data).format('MMM, DD YYYY');
  }
}

