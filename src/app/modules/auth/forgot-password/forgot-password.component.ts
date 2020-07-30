import { AlertService } from "./../../../_services/alert.service";
import { AuthenticationService } from "./../authentication.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Component, OnInit, PLATFORM_ID, Inject, HostBinding } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"]
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  submitted: boolean = false;
  successalert: boolean = false;
  warningalert: boolean = false;
  validationErrors = [];
  commonErrors = [];
  formResponse: any;
  browser: any;
  @HostBinding('style.width') width: string = "100%";

  constructor(
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
    private authservice: AuthenticationService,
    private alertService: AlertService
  ) {
    this.browser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.forgotForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]]
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.forgotForm.invalid) {
      return;
    }

    this.authservice.forgotPassword(this.forgotForm.value).subscribe(
      (response: any) => {
        this.formResponse = response;
        this.alertService.success(response.title, response.message);
      },
      error => {
        ////console.log(error)
        let response = error.error;
        //   this.eventService.loaderVisibility.next(false)
        if (error.status == 400) {
          if (response.status == false) {
            if (response.error) {
              this.validationErrors = response.error;
            } else {
              this.alertService.warning(response.title, response.common_error);
            }
          }
        }
      }
    );
  }
}
