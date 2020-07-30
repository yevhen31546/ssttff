import { LOCAL_STORAGE, WINDOW } from "@ng-toolkit/universal";
import { AlertService } from "./../../../_services/alert.service";
import { UserService } from "./../../user/user.service";
import { Component, OnInit, Inject, PLATFORM_ID ,Optional, HostBinding} from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { AuthenticationService } from "../authentication.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from "angular-6-social-login";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OnboardComponent } from "./../../../modals/onboard/onboard.component";
import { DataService } from "../../../_services";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-registration",
  templateUrl: "./registration.component.html",
  styleUrls: ["./registration.component.css"]
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  submitted: boolean = false;
  showPassword: boolean = false;
  formvalue: {};
  validationErrors = [];
  commonErrors = [];
  returnUrl: string;
  redirectUrl: string;
  successalert: boolean = false;
  warningalert: boolean = false;
  couponTextShow: boolean = false;
  email: string;
  name: string;
  plan: string;
  interval: string;
  socialAfterSignup: boolean = false;
  voucherCode: any = "";
  modalReference: any = false;
  isBrowser: boolean;
  @HostBinding('style.width') width: string = "100%";

  constructor(
    @Inject(WINDOW) private window: Window,
    @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) platformId: Object,
    private formBuilder: FormBuilder,
    private authservice: AuthenticationService,
    private userservice: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private socialAuthService: AuthService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private dataservice: DataService
  ) {
    this.router.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };

    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });



    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.registerForm = this.formBuilder.group({
      first_name: [
        "",
        [Validators.required, Validators.pattern("^[A-Za-z -]+$")]
      ],
      last_name: [
        "",
        [Validators.required, Validators.pattern("^[A-Za-z -]+$")]
      ],
      username: [
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[A-Za-z0-9_]{1,15}$")
        ])
      ],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      voucher_code: [""]
      //  name: [true]
    });

    if (this.localStorage.getItem("currentUser")) {
      //////console.log(localStorage.getItem('currentUser'))
      let userDetails: any = JSON.parse(
        this.localStorage.getItem("currentUser")
      );

      this.registerForm.patchValue({
        email: userDetails.user.email,
        first_name: userDetails.user.first_name,
        last_name: userDetails.user.last_name
      });
    }

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"]; //console.log(   this.returnUrl,"   this.returnUrl")
    this.plan = this.route.snapshot.queryParams["plan"];
    this.interval = this.route.snapshot.queryParams["interval"];
  }


  getInnerHeight() {
    return document.documentElement.clientHeight-30;
  }
  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  changeInput(input: any): any {
    input.type = input.type === "password" ? "text" : "password";
  }

  onSubmit() {
    //console.log("registera")
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    ////console.log(this.registerForm.value)
    if (this.localStorage.getItem("currentUser")) {
      // this.registerForm.value.user.name = `${this.registerForm.value.first_name} ${this.registerForm.value.last_name}`;
      this.userservice.editProfile(this.registerForm.value).subscribe(
        (response: any) => {
          var updatedUser = response.user;
          //localStorage.setItem('currentUser', JSON.stringify(response.user))

          var currentUserDetails = JSON.parse(
            this.localStorage.getItem("currentUser")
          );
          currentUserDetails.user.username = updatedUser.username;
          currentUserDetails.user.last_name = updatedUser.last_name;
          currentUserDetails.user.first_name = updatedUser.first_name;
          this.localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUserDetails)
          ); //put the object back
          this.dataservice.changeData(currentUserDetails);
          if (this.localStorage.getItem("selected_plan")) {
            this.router.navigate(["/pricing"]);
          } else {
            //console.log("account redirect")

            this.router.navigate(["user/account-settings/profile"]);
          }
          this.modalReference = this.modalService.open(OnboardComponent, {
            windowClass: "modal-md onboarding-popup",
            centered: true,
            backdrop: "static"
          });
          //this.alertService.success(response.title, response.message)
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
                this.alertService.error(response.title, response.common_error);
              }
            }
          }
        }
      );
    } else {
      this.authservice.register(this.registerForm.value).subscribe(
        (response: any) => {
          this.redirectUrl =
            "/signup-verification/" + this.registerForm.controls.email.value;
          this.router.navigate([this.redirectUrl]);
        },
        error => {
          let response = error.error;
          //   this.eventService.loaderVisibility.next(false)
          if (error.status == 400) {
            if (response.status == false) {
              if (response.error) {
                this.validationErrors = response.error;
              } else {
                this.alertService.error(response.title, response.common_error);
              }
            }
          }
        }
      );
    }
  }

  //Social Registration
  socialSignIn(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform == "facebook") {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform == "google") {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(userData => {
      //console.log(userData,"uiserdata")
      this.authservice.socialSignin(userData).subscribe(
        (response: any) => {
          if (response.data.user.username === null) {
            //console.log("truueeee")
            this.socialAfterSignup = true;
            this.router.navigate(["sign-up"]);
          } else {
            if (this.localStorage.getItem("selected_plan")) {
              this.router.navigate(["subscription/plans"]);
            } else {
              this.router.navigate(["user/account-settings/profile"]);
            }
          }
        },
        error => {
          //this.warningalert = true
          let response = error.error;
          //   this.eventService.loaderVisibility.next(false)
          if (error.status == 400) {
            if (response.status == false) {
              if (response.error) {
                this.validationErrors = response.error;
              } else {
                // if (response.type == 'authentication_error') {
                //   this.alertService.error(response.title, response.common_error)
                // } else {
                this.alertService.error(response.title, response.common_error);
                //}
              }
            }
          }
        }
      );

      // Now sign-in with userData
      // ...
    });
    return false;
  }

  checkCoupon() {
    const data = {
      voucher_code: this.registerForm.value.voucher_code
    };

    this.userservice.checkCouponCode(data).subscribe((res: any) => {
      if (res.status === true) {
        this.alertService.success(res.title, res.message);
      } else {
        this.alertService.error(res.title, res.message);
      }
    });
  }

  enableCoupon() {
    this.couponTextShow = this.couponTextShow == true ? false : true;
  }
}
