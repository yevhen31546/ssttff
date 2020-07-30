import { Component, OnInit } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { AlertService } from '../../../_services'
import { UserService } from '../user.service'

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.css']
})
export class UserNotificationComponent implements OnInit {
  notificationForm: FormGroup
  submitted: boolean = false
  validationErrors: any = []
  commonErrors: any = []

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userservice: UserService
  ) {}

  ngOnInit() {
    this.notificationForm = this.formBuilder.group({
      direct_message: [false],
      member_follows: [false],
      member_critiques: [false],
      member_mentions: [false],
      member_comments: [false]
    })
    this.getNotification()
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.notificationForm.controls
  }

  onSubmit() {
    let data: any
    //let formData: FormData = new FormData()
    let d_message = this.notificationForm.value.direct_message == true ? 1 : 0
    let m_follows = this.notificationForm.value.member_follows == true ? 1 : 0
    let m_critiques =
      this.notificationForm.value.member_critiques == true ? 1 : 0
    let m_mentions = this.notificationForm.value.member_mentions == true ? 1 : 0
    let m_comments = this.notificationForm.value.member_comments == true ? 1 : 0

    data = {
      direct_message: d_message.toString(),
      member_follows: m_follows.toString(),
      member_critiques: m_critiques.toString(),
      member_mentions: m_mentions.toString(),
      member_comments: m_comments.toString()
    }
    ////console.log(this.notificationForm.value)
    this.submitted = true
    // stop here if form is invalid
    if (this.notificationForm.invalid) {
      ////console.log(this.notificationForm)
      return
    }

    this.userservice.updateNotification(data).subscribe(
      (response: any) => {
        this.alertService.success(response.title, response.message)
      },
      error => {
        ////console.log(error)
        let response = error.error
        //   this.eventService.loaderVisibility.next(false)
        if (error.status == 400) {
          if (response.status == false) {
            this.validationErrors = response.error
          }
        }
        if (error.status == 401) {
          this.commonErrors = response
          this.alertService.success(response.title, response.message)
          // this.alertService.error(response)
        }
      }
    )
  }

  checkboxChange(event, params) {
    let val = event.currentTarget.checked == true ? '1' : '0'
    ////console.log(val)
    if (params == 'direct_message') {
      this.notificationForm.value.direct_message = val
    } else if (params == 'member_follows') {
      this.notificationForm.value.member_follows = val
    } else if (params == 'member_critiques') {
      this.notificationForm.value.member_critiques = val
    } else if (params == 'member_mentions') {
      this.notificationForm.value.member_mentions = val
    } else if (params == 'member_comments') {
      this.notificationForm.value.member_comments = val
    }
  }

  getNotification() {
    this.userservice.getNotificationData().subscribe(
      (response: any) => {
        ////console.log(response)
        // this.notificationForm.patchValue(response.settings)
        if (response.settings) {
          let d_message = response.settings.direct_message == true ? 1 : 0
          let m_follows = response.settings.member_follows == true ? 1 : 0
          let m_critiques = response.settings.member_critiques == true ? 1 : 0
          let m_mentions = response.settings.member_mentions == true ? 1 : 0
          let m_comments = response.settings.member_comments == true ? 1 : 0

          this.notificationForm.patchValue({
            direct_message: d_message,
            member_follows: m_follows,
            member_critiques: m_critiques,
            member_mentions: m_mentions,
            member_comments: m_comments
          })
        }
        //this.alertService.success(response.title, response.message)
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
              this.alertService.error(response.title, response.common_error)
            }
          }
        }
      }
    )
  }
}
