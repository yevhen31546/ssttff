import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { NotificationService } from './../../../_services/notification.service';
import { ProfileService } from './../../profile/profile.service'
import { AlertService } from './../../../_services/alert.service'
import { Router, ActivatedRoute } from '@angular/router'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { Component, OnInit , Inject, PLATFORM_ID,Optional, HostListener, HostBinding} from '@angular/core';
import { AuthenticationService } from '../authentication.service'
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login'
import { LoaderService } from '../../../_services'
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  submitted: boolean = false
  showPassword: boolean = false
  formvalue: {}
  validationErrors = []
  commonErrors: any = []
  returnUrl: string
  token: string
  username: string
  status: string
  error: string
  redirectId: any = ''
  screenHeight: string;
  screenWidth: string;
  @HostBinding('style.width') width: string = "100%";

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
  @Inject(PLATFORM_ID) private platformId: Object,
    private formBuilder: FormBuilder,
    private authservice: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private socialAuthService: AuthService,
    private alertService: AlertService,
    private loaderservice: LoaderService,
    private profileService: ProfileService,
    private notificationService: NotificationService
  ) {
    this.getScreenSize()
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false
    }
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.redirectId = params['id']
      this.error = params['error']
      this.token = params['token']
      this.status = params['status']
      this.username = params['username'];
      if (this.error !== undefined) {
        this.alertService.error(params['title'], params['common_error'])
      }
    })

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
    this.returnUrl =
    this.route.snapshot.queryParams['returnUrl'] || '/';
    if (this.token !== undefined && this.username !== undefined) {
      this.verifyEmailUser();
    }

  }


  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          this.screenHeight = window.innerHeight+'px';
    }
   getInnerHeight() {
    return (document.documentElement.clientHeight-20)+'px';
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls
  }

  changeInput(input: any): any {
    input.type = input.type === 'password' ? 'text' : 'password'
  }

  verifyEmailUser() {
    let data = {
      username: this.username,
      token: this.token,
      status: this.status
    }

    this.profileService.verifyEmail(data).subscribe(
      (response: any) => {})
    
    }

  onSubmit() {
    //this.loaderservice.display()
    this.submitted = true
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return
    }

    let username = this.loginForm.controls.email.value
    let password = this.loginForm.controls.password.value
    this.authservice.login(username, password).subscribe(
      (response: any) => { //console.log(response,"login")
    if (isPlatformBrowser(this.platformId)) {

        this.notificationService.requestPermission(response.data.user.id);
    }
        //this.loaderservice.hide()
        if (this.localStorage.getItem('selected_plan')) {
          this.router.navigate(['/pricing'])
        } else {
          // this.router.navigate([this.returnUrl])
          this.redirect(response)
        }
      },
      error => {
        //this.loaderservice.hide()
        let response = error.error
        //   this.eventService.loaderVisibility.next(false)
        if (error.status == 400) {
          if (response.status == false) {
            if (response.error) {
              this.validationErrors = response.error
            } else {
              if (response.type == 'authentication_error') {
                let message =
                  response.common_error +
                  " Have you <a href='/forgot-password'>forgotten your password?</a>"
                ////console.log(message)
                this.alertService.error(response.title, message)
              } else {
                this.alertService.error(response.title, response.common_error)
              }
              //}
            }
          }
        }
      }
    )
  }

  forgotPasswordLink() {
    this.router.navigate(['/forgot-password'])
  }

  //Social Registration
  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider
    if (socialPlatform == 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID
    } else if (socialPlatform == 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      //this.userData=userData
      this.authservice.socialSignin(userData).subscribe(
        (response: any) => {
          ////console.log(response.data.user.username)
          if (response.data.user.username === null) {
            this.router.navigate(['sign-up'])
          } else {
            this.router.navigate([this.returnUrl])
          }
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
                // if (response.type == 'authentication_error') {
                //   this.alertService.error(response.title, response.common_error)
                // } else {
                this.alertService.error(response.title, response.common_error)
                //}
              }
            }
          }
        }
      )

      // Now sign-in with userData
      // ...
    })
    return false
  }

  redirect(data: any) {
    if (this.redirectId) {
      this.router.navigate(['/photo/' + this.redirectId], {
        queryParams: { tab: 'comment-tab' }
      })
    } else {
      this.router.navigate([this.returnUrl])
    }
  }
}
