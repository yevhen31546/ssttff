import { AlertService } from './../../../_services/alert.service'
import { AuthenticationService } from './../authentication.service'
import { ActivatedRoute } from '@angular/router'
import { Component, OnInit, HostBinding } from '@angular/core'

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {
  email: string
  validationErrors: any = []
  commonErrors: any = []
  successalert: boolean = false
  formResponse: any
  @HostBinding('style.width') width: string = "100%";

  constructor(
    private route: ActivatedRoute,
    private authservice: AuthenticationService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.params.emailcode
  }

  resendEmail() {
    let data = { email: this.email }
    this.authservice.resendEmail(data).subscribe(
      (response: any) => {
        this.alertService.success(response.title, response.message)
      },
      error => {
        let response = error.error
        if (error.status == 400) {
          if (response.status == false) {
            if (response.error) {
              this.validationErrors = response.error
            } else {
              this.alertService.error(response.title, response.common_error)
            }
          }
        }
      }
    )
  }
}
