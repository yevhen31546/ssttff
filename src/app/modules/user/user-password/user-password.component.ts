import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AlertService } from '../../../_services'
import { UserService } from '../user.service'

@Component({
  selector: 'app-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class UserPasswordComponent implements OnInit {
  passwordForm: FormGroup
  submitted: boolean = false
  validationErrors: any = []
  commonErrors: any = []

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userservice: UserService
  ) {}

  ngOnInit() {
    this.passwordForm = this.formBuilder.group({
      old_password: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.passwordForm.controls
  }

  onSubmit() {
    ////console.log(this.passwordForm.value)
    this.submitted = true
    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      ////console.log(this.passwordForm)
      return
    }

    this.userservice.updatePassword(this.passwordForm.value).subscribe(
      (response: any) => {
        ////console.log(response)
        this.validationErrors = []
        this.alertService.success(response.title, response.message)
      },
      error => {
        ////console.log(error)
        let response = error.error
        //   this.eventService.loaderVisibility.next(false)
        if (error.status == 400) {
          if (response.status == false) {
            if (response.error) {
              this.validationErrors = response.error
            } else {
              this.validationErrors=[]
              this.alertService.error(response.title, response.common_error)
            }
          }
        }
      }
    )
  }
}
