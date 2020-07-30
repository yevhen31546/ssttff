import { LOCAL_STORAGE, WINDOW } from "@ng-toolkit/universal";
import { NotificationService } from "./../../_services/notification.service";
import { MessagesComponent } from "./../messages/messages.component";
import { DataService } from "./../../_services/data.service";
import { AlertService } from "./../../_services/alert.service";
import { ProfileService } from "./profile.service";
import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  PLATFORM_ID,Optional
} from "@angular/core";
import {
  ActivatedRoute,
  Router,
  NavigationEnd,
  ParamMap
} from "@angular/router";
import { NgbModal, NgbTabset } from "@ng-bootstrap/ng-bootstrap";
import { LoaderService } from "../../_services";
import { CriticsComponent } from "./critics/critics.component";
import { PhotoUploadService } from "./../photo-upload/photo-upload.service";
import { StripeUpdateService } from "./../../_services/stripeUpdate.service";
import { environment } from "./../../../environments/environment.prod";
import {
  StripeCheckoutLoader,
  StripeCheckoutHandler
} from "ng-stripe-checkout";
import { UserService } from "./../user/user.service";
import { HostListener, Inject } from "@angular/core";
import { MessagesService } from "../messages/messages.service";
import { MessageListComponent } from "../messages/message-list/message-list.component";
import { Location, isPlatformBrowser } from "@angular/common";
import { ReportComponent } from "./report/report.component";
import { OnboardComponent } from "./../../modals/onboard/onboard.component";
import { Title } from "@angular/platform-browser";
import { MasterCollectiveInfoComponent } from "./../../modals/master-collective-info/master-collective-info.component";
import { map } from "rxjs/operators";
// import { GoogleTagManagerService } from 'angular-google-tag-manager';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit, AfterViewInit {
  private stripeCheckoutHandler: StripeCheckoutHandler;
  @ViewChild("tabs")
  public tabs: NgbTabset;
  profileDetails: any = [];
  modalReference: any = false;
  username: string;
  token: string;
  name: string;
  status: string;
  validationErrors: any = [];
  userPhotos: any;
  expire: Boolean = false;
  cardDetails: any = [];
  authUserDetails: any = "";
  isAuthUser: boolean = true;
  currentPage = 1;
  identifyType = "profile";
  success: Boolean = false;
  userId: number;
  modal: boolean = false;
  showProfileLoader: boolean = false;
  reload: any = "reload";
  isShowLoader: boolean = false;
  showLoader: Boolean = false;
  tabSelection: any;

  showOpacity: number = 0;
  ownTitlePage: boolean = true;
  verifyEmail: Boolean = false;

  username$ = this.route.paramMap.pipe(
    map((params: ParamMap) => params.get("username"))
  );

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any,
    private profileservice: ProfileService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private router: Router,
    private alertService: AlertService,
    private loaderservice: LoaderService,
    private dataservice: DataService,
    private userservice: UserService,
    private messagesService: MessagesService,
    private stripeCheckoutLoader: StripeCheckoutLoader,
    private stripeUpdateSrv: StripeUpdateService,
    private photoUploadSvc: PhotoUploadService,
    private _dataService: DataService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private titleService: Title,
    private notificationService: NotificationService
  ) // private  gtmService: GoogleTagManagerService
  {}

  ngOnInit() {
    //console.log("initialise")
    this.route.queryParams.subscribe(params => {
      this.token = params["token"];
      this.status = params["status"];
      this.name = params["name"];
    });
    this.tabSelection =
      this.router.url.split("/").length === 3
        ? this.router.url.split("/")[2]
        : "profile";
    this.username$.subscribe(res => {
      this.username = res;
    });

    if (this.token !== undefined && this.username !== undefined) {
      this.verifyEmailUser();
    } else {
      if (this.localStorage.getItem("currentUser")) {
        this.authUserDetails = JSON.parse(this.localStorage.getItem("user"));
      }

      this.getUserProfile();
    }

    this._dataService.reload.subscribe((val: any) => {
      this.success = true;
      if (val.type == "success") {
        this.alertService.success(val.title, val.message);
      } else if (val.type == "info") {
        this.alertService.info(val.title, val.message);
      } else if (val.type == "stfawarderror") {
        this.alertService.warning(val.title, val.message);
      } else {
        this.alertService.error(val.title, val.message);
      }
      this.ownTitlePage = false;
      this.getUserProfile();
      // setTimeout(() => {
      //   window.location.reload()
      // }, 2000)
    });

    this.stripeUpdateSrv.getStripe().subscribe(message => {
      this.updateCard();
    });

    this._dataService.alert.subscribe((val: any) => {
      this.modal = true;
      if (val.type == "success") {
        this.alertService.success(val.title, val.message);
      } else if (val.type == "info") {
        this.alertService.info(val.title, val.message);
      } else if (val.type == "stfawarderror") {
        this.alertService.warning(val.title, val.message);
      } else {
        this.alertService.error(val.title, val.message);
      }
      this.ownTitlePage = false;
      this.getUserProfile();
    });

    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        this.window.scrollTo(0, 0);
      }
    });
    if (this.profileDetails.card_id) {
      this.cardDetail();
    }
  }

  public ngAfterViewInit() {
    //this.cdr.detectChanges()
    this.stripeCheckoutLoader
      .createHandler({
        key: environment.STRIPE_PUBLISH_KEY,
        token: token => {
          const data = token;
          //  ////console.log('profile token!', data);
        }
      })
      .then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler;
      });

    //console.log(this.tabs, this.tabSelection, this.router.url.split('/').length, this.router.url.split('/')[2])

    if (this.localStorage.getItem("deleteMessage")) {
      this.modal = true;
      let val = JSON.parse(this.localStorage.getItem("deleteMessage"));
      this.alertService.success(val.title, val.message);
      this.localStorage.removeItem("deleteMessage");
      this.cdr.detectChanges();
    }
  }

  getUserProfile() {
    // this.loaderservice.display()
    // let username = this.username.split('@')
    // if (username[1] !== undefined) {
    this.showProfileLoader = true;
    let data = { username: this.username, user_id: this.authUserDetails.id };
    this.profileservice.getProfileData(data).subscribe((response: any) => {
      this.profileDetails = response.user;
      this.showProfileLoader = false;
      if (this.profileDetails) {
        //console.log("details")

        if (this.tabSelection !== undefined) {
          // this.tabs.activeId = ''
          this.tabs.select(this.tabSelection);
          // this.cdr.detectChanges()
        }

        this.isAuthUser =
          this.authUserDetails.id === response.user.id ? true : false;
      }

      this.userId = this.profileDetails.id;
      this.name = this.profileDetails.first_name;
      if (this.profileDetails.card_id) {
        this.cardDetail();
      }

      this.profileDetails.web_link_http = this.addhttp(
        this.profileDetails.web_link
      );
      this.profileDetails.web_link = this.profileDetails.web_link
        ? this.profileDetails.web_link
            .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
            .split("/")[0]
        : "";
      this.showOpacity = 1;
      if (this.ownTitlePage == true) {
        this.titleService.setTitle(
          this.profileDetails.first_name +
            " " +
            this.profileDetails.last_name +
            " | Shoot The Frame"
        );
      }
      //this.getUserPhotos()
    });
  }

  // Append items to NgMasonryGrid
  appendItems(event) {
    //this.getUserPhotos()
  }

  openModal(content) {
    this.modalReference = this.modalService.open(content);
    this.modalReference.result.then(
      result => {},
      reason => {}
    );
  }

  closeModal() {
    if (this.modalReference) {
      this.modalReference.close();
    }
    //this.clearJobzoneCreate();
  }

  logout() {
    let data = { fcm_token: this.localStorage.getItem("f_token") };

    this.profileservice.logout(data).subscribe(res => {});
    this.localStorage.removeItem("currentUser");
    this.localStorage.removeItem("user");
    this.localStorage.removeItem("notify");
    this.router.navigate(["/sign-in"]);
  }

  addhttp(url) {
    if (!/^(ht)tps?:\/\//i.test(url)) {
      url = "http://" + url;
    }
    return url;
  }

  verifyEmailUser() {
    this.showProfileLoader = true;
    this.verifyEmail = true;
    let data = {
      username: this.username,
      token: this.token,
      status: this.status
    };

    this.profileservice.verifyEmail(data).subscribe(
      (response: any) => {
        //console.log(response, 'profile')
        this.showProfileLoader = false;

        this.profileDetails = response.data.user;
        if (isPlatformBrowser(this.platformId)) {
          this.notificationService.requestPermission(response.data.user.id);
        }
        //this.alertService.success(response.title, response.message)
        response.data.details = true;

        this.dataservice.changeData(response.data);
        if (this.localStorage.getItem("selected_plan")) {
          this.router.navigate(["subscription/plans"]);
        }

        this.modalReference = this.modalService.open(OnboardComponent, {
          windowClass: "modal-md onboarding-popup",
          centered: true,
          backdrop: "static"
        });

        this.modalReference.result.then(
          result => {
            //console.log("resulrt")
            // this.profileDetails = response.data.user;
            this.verifyEmail = false;
            this.router.navigate(["@" + response.data.user.username]);
          },

          reason => {
            //console.log("reason")
            // this.profileDetails = response.data.user;
            this.verifyEmail = false;
            this.router.navigate(["@" + response.data.user.username]);
          }
        );
      },
      error => {
        ////console.log(error)
        let response = error.error;
        //   this.eventService.loaderVisibility.next(false)
        if (error.status == 400) {
          this.router.navigate([
            "/sign-in",
            {
              queryParams: {
                title: response.title,
                common_error: response.common_error
              }
            }
          ]);
        }
      }
    );
  }

  cardDetail() {
    this.userservice.getCardDetails().subscribe(
      (res: any) => {
        ////console.log(res, 'carddetail')
        const isExpiry = res.expires;
        if (isExpiry === 0) {
          this.expire = false;
        } else if (isExpiry === 1) {
          this.expire = true;
          this.alertService.info("Payment card expiring soon", "updateCard");
        } else {
          this.expire = true;
          this.alertService.error("Payment card expired", "updateCard");
        }
        this.cardDetails = res.card;
        // this.loaderservice.hide()
      },
      (error: any) => {
        // this.loaderservice.hide()
      }
    );
  }

  updateCard() {
    const image = "assets/images/temp/stripe-logo.jpg";
    this.stripeCheckoutHandler
      .open({
        panelLabel: "Update Card Details",
        label: "Update Card Details",
        name: "Shoot The Frame",
        image: image,
        allowRememberMe: false
      })
      .then((token: any) => {
        const data: any = token;
        data.stripeToken = token.id;
        data.stripeEmail = token.email;
        data.cardId = token.card.id;
        this.loaderservice.display();
        this.photoUploadSvc.updateCard(data).subscribe(
          res => {
            this.expire = false;
            this.success = true;
            this.cardDetails = res.card;
            this.alertService.success(res.title, res.message);
            this.loaderservice.hide();
          },
          (error: any) => {
            this.loaderservice.hide();
            this.alertService.error(error.title, error.message);
          }
        );
      })
      .catch(err => {
        // Payment failed or was canceled by user...
        if (err !== "stripe_closed") {
          throw err;
        }
      });
  }

  /**
   *
   * @param userId
   */
  followUser(item) {
    if (!this.authUserDetails) {
      this.router.navigate(["/sign-up"]);
    } else {
      let data = {
        follow_id: item.id
      };
      item.is_follow = item.is_follow == 0 ? 1 : 0;
      this.profileservice.followUser(data).subscribe(
        (res: any) => {},
        (error: any) => {}
      );
    }
  }

  chatUser(userId) {
    let data = {
      user_id: userId
    };
    ////console.log(data)
    this.messagesService.createThread(data).subscribe(
      (res: any) => {
        this.modalReference = this.modalService.open(MessageListComponent, {
          windowClass: "modal-md",
          centered: true
        });
        let data = {
          id: res.inboxId,
          userDetails: this.profileDetails,
          other_user_id: userId,
          isModal: true
        };
        this.modalReference.componentInstance.data = data;
        this.modalReference.result.then(
          result => {
            // ////console.log(result)
          },
          reason => {}
        );
      },
      (error: any) => {}
    );
  }

  tabChange(event) {
    //console.log(event, this.route);
    // this.categoryType = event.nextId
    // let url = this.router
    //   .createUrlTree([], {
    //     relativeTo: this.route,
    //     //  queryParamsHandling: 'merge',
    //     // preserve the existing query params in the route
    //     skipLocationChange: true
    //   })
    //   // do not trigger navigation })
    //   .toString();
    let url = "";
    url = `@${this.username}/${event.nextId}`;

    // this.router.navigate([url],{skipLocationChange: true})
    this.location.go(url);
  }

  openReportModal() {
    if (!this.authUserDetails) {
      this.router.navigate(["/sign-in"]);
    } else {
      let data = { to_user_id: this.profileDetails.id };
      this.profileservice.getReportData(data).subscribe((response: any) => {
        // Append items to NgMasonryGrid

        this.modalReference = this.modalService.open(ReportComponent, {
          windowClass: "modal-md report-modal"
        });
        this.modalReference.componentInstance.profileData = this.profileDetails;
        this.modalReference.componentInstance.reportList = response.report;
        this.modalReference.result.then(
          result => {
            ////console.log(result)
          },
          reason => {}
        );
      });
    }
  }

  masterInfoModal() {
    const modalRef = this.modalService.open(MasterCollectiveInfoComponent);
  }
}
