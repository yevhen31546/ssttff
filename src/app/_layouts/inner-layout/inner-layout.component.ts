import { LOCAL_STORAGE, WINDOW } from "@ng-toolkit/universal";
import { AuthenticationService } from "./../../modules/auth/authentication.service";
import { AlertService } from "./../../_services/alert.service";
import { DataService } from "./../../_services/data.service";
import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Inject,
  PLATFORM_ID,
  Optional
} from "@angular/core";
import { Router } from "@angular/router";
import { ProfileService } from "../../modules/profile/profile.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotificationService } from "../../_services/notification.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { WebNotificationComponent } from "../../modules/web-notification/web-notification.component";
import { PusherService } from "../../_services/pusher.service";
import { WebNotificationService } from "../../modules/web-notification/web-notification.service";
import { CollectionsAddModalComponent } from "../../modules/collections/collections-add-modal/collections-add-modal.component";
import { PhotoEssayAddModalComponent } from "../../modules/photo-essay/photo-essay-add-modal/photo-essay-add-modal.component";
import { MessageService } from "../../_services/message.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-inner-layout",
  templateUrl: "./inner-layout.component.html",
  styleUrls: ["./inner-layout.component.css"]
})
export class InnerLayoutComponent implements OnInit {
  sendForm: FormGroup;
  userDetails: any;
  popUpTrue: any = false;
  selectedItem: string;
  private wasInside = false;
  isLogin: boolean = false;
  opened: boolean = false;
  showMainMenu: boolean = false;
  search: any;
  role: any;
  isUnreadMsg: boolean = false;
  modalReference: any = false;
  isFocused: boolean = false;
  submitSuccess: boolean = false;
  channelName: any;
  channel: any;
  notification: Boolean = false;
  notifyData: any = 0;

  selectedMobileMenu: string = "";

  constructor(
    @Inject(WINDOW) private window: Window,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional()
    @Inject(LOCAL_STORAGE)
    private localStorage: any,
    private router: Router,
    private formBuilder: FormBuilder,
    private el: ElementRef,
    private profileservice: ProfileService,
    private dataService: DataService,
    private notificationService: NotificationService,
    private userNotification: WebNotificationService,
    private modalService: NgbModal,
    private authService: AuthenticationService,
    private pusherService: PusherService,
    private messageServie: MessageService
  ) {}

  onClickOutside(event) {
    this.selectedItem = "";
  }

  @HostListener("click", ["$event"])
  clickout(event) {
    this.selectedItem = "";
  }

  clickedInside($event: Event, activeIcon) {
    $event.preventDefault();
    $event.stopPropagation(); // <- that will stop propagation on lower layers
    if (this.selectedItem != activeIcon) {
      this.selectedItem = activeIcon;
    } else {
      this.selectedItem = "";
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.notifyData = JSON.parse(this.localStorage.getItem("notify"));
      this.sendForm = this.formBuilder.group({
        email: ["", [Validators.required, Validators.email]],
        first_name: ["", [Validators.required]]
      });
      this.notificationService.currentMessage.subscribe(data => {
        //do what ever needs doing when data changes
        if (data) {
          //.log(data,"message data");
          this.isUnreadMsg = true;
          this.notification = true;
          if (data.data.type == "message") {
            this.addPusher(data.data.type_id);
          }
        }
      });
    }
    if (!this.notification && this.notifyData == 1) {
      //console.log(this.notifyData, "notification")
      this.isUnreadMsg = true;
    }
    //console.log( this.notifyData,"notifu",this.notification, this.isUnreadMsg)

    this.dataService.change.subscribe(data => {
      this.isLogin = true;
      let userData = data;
      if (!data.details) {
        //console.log(data);
        userData = JSON.parse(data);
      }
      this.localStorage.setItem("user", JSON.stringify(userData.user));
      this.userDetails = userData.user;
      this.role = this.userDetails.role;
    });

    if (this.localStorage.getItem("currentUser")) {
      //console.log("curret")
      this.isLogin = true;
      this.userDetails = JSON.parse(this.localStorage.getItem("user"));
      this.role = this.userDetails.role;
      const userId = this.userDetails.id;
      // this.notificationService.requestPermission(userId)
      if (isPlatformBrowser(this.platformId)) {
        this.notificationService.receiveMessage();
      }
    }

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  showProfile() {
    this.router.navigate(["@" + this.userDetails.username]);
  }

  goToUploadPhotos() {
    this.router.navigate(["user/upload-photo"]);
  }

  logout() {
    let data = { fcm_token: this.localStorage.getItem("f_token") };

    this.profileservice.logout(data).subscribe(res => {});
    this.localStorage.removeItem("currentUser");
    this.localStorage.removeItem("user");
    this.localStorage.removeItem("notify");
    this.router.navigate(["/sign-in"]);
  }

  showActive(activeIcon) {
    if (this.selectedItem != activeIcon) {
      this.selectedItem = activeIcon;
    } else {
      this.selectedItem = "";
    }
  }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.router.navigate([`search/${this.search}`]);
    }
  }

  sendWinnersInfo() {
    this.authService.addEmailToSubscribe(this.sendForm.value).subscribe(
      (res: any) => {
        //this.sendForm.reset()
        this.submitSuccess = true;
      },
      (error: any) => {
        //this.showPaginationLoader = false
      }
    );
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.sendForm.controls;
  }

  readMessages() {
    this.isUnreadMsg = false;
    this.notification = false;
    this.notificationService.updateReadStatus().subscribe(res => {
      //console.log(res,"notifyyy")
    });
    this.notificationService.receiveMessageEmpty();
    this.localStorage.removeItem("notify");
    this.modalReference = this.modalService.open(WebNotificationComponent, {
      windowClass: "modal-md",
      centered: true
    });
    // this.modalReference.componentInstance.data = item
    // this.modalReference.componentInstance.currentItemKey = i
    // this.modalReference.componentInstance.imgDetails = this.imgDetails
    //this.modalReference = this.modalService.open(content)
    this.modalReference.result.then(
      result => {
        // ////console.log(result)
      },
      reason => {}
    );
  }

  addFocus() {
    this.isFocused = true;
  }

  resetForm() {
    this.sendForm.reset();
    this.submitSuccess = false;
  }

  addPusher(id) {
    this.channelName = "presence-inbox." + id;
    this.channel = this.pusherService.getPusher().subscribe(this.channelName);
    this.channel.bind("messagesent", data => {});
  }

  createCollection() {
    this.modalReference = this.modalService.open(CollectionsAddModalComponent, {
      windowClass: "modal-md"
    });
    this.modalReference.result.then(result => {
      //console.log(result, "res")
    });
  }

  createPhotoEssay() {
    this.modalReference = this.modalService.open(PhotoEssayAddModalComponent, {
      windowClass: "modal-md"
    });
    this.modalReference.result.then(result => {
      //console.log(result, "res")
    });
  }
}
