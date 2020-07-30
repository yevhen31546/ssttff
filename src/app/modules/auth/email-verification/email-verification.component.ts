import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { AlertService } from '../../../_services';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit {
  email: string
  validationErrors: any = []
  commonErrors: any = []
  successalert: boolean = false
  formResponse: any
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
