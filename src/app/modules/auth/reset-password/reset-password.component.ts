import { AlertService } from './../../../_services/alert.service'
import { ActivatedRoute, Router } from '@angular/router'
import { AuthenticationService } from './../authentication.service'
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms'
import { Component, OnInit, HostBinding } from '@angular/core'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup
  submitted: boolean = false
  successalert: boolean = false
  warningalert: boolean = false
  validationErrors = []
  commonErrors: any = []
  token: string
  formResponse: any
  @HostBinding('style.width') width: string = "100%";

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private router: Router
  ) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required]]
    })

    this.token = this.route.snapshot.params.token
  }

  changeInput(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password'
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls
  }

  onSubmit() {
    this.warningalert = false
    this.submitted = true

    // stop here if form is invalid
    if (this.resetForm.invalid) {
      return
    }
    //Password match
    if (
      this.resetForm.controls.password.value !==
      this.resetForm.controls.confirm_password.value
    ) {
      this.alertService.error(
        'Hmmm.',
        "These two passwords don't match.Try again."
      )
      return
    }

    let data = {
      token: this.token,
      password: this.resetForm.controls.password.value
    }

    this.authservice.resetPassword(data).subscribe(
      (response: any) => {
        this.alertService.success(response.title, response.message)
        setTimeout(() => {
          this.router.navigate(['/'])
        }, 500)
        // this.successalert = true
        // this.formResponse = response
        //this.router.navigate([this.returnUrl])
      },
      error => {
        ////console.log(error)
        let response = error.error
        //   this.eventService.loaderVisibility.next(false)
        if (error.status == 400) {
          if (response.error) {
            this.validationErrors = response.error
          } else {
            this.alertService.error(response.title, response.common_error)
          }
        }
      }
    )
  }
}
