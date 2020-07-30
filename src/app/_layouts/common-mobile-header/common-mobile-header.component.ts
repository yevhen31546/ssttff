import { LOCAL_STORAGE, WINDOW } from "@ng-toolkit/universal";
import { WebNotificationComponent } from "./../../modules/web-notification/web-notification.component";
import { DataService } from "./../../_services/data.service";
import {
  Component,
  OnInit,
  HostListener,
  ElementRef,
  Inject,
  PLATFORM_ID,Optional
} from "@angular/core";
import { Router } from "@angular/router";
import { ProfileService } from "../../modules/profile/profile.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CollectionsListModalComponent } from "../../modules/collections/collections-list-modal/collections-list-modal.component";
import { CollectionsAddModalComponent } from "../../modules/collections/collections-add-modal/collections-add-modal.component";
import { PhotoEssayAddModalComponent } from "../../modules/photo-essay/photo-essay-add-modal/photo-essay-add-modal.component";
import { NotificationService } from "../../_services/notification.service";
import { isPlatformBrowser } from "@angular/common";

@Component({
  selector: "app-common-mobile-header",
  templateUrl: "./common-mobile-header.component.html",
  styleUrls: ["./common-mobile-header.component.css"]
})
export class CommonMobileHeaderComponent implements OnInit {
  userDetails: any;
  popUpTrue: any = false;
  selectedItem: string;
  private wasInside = false;
  isLogin: boolean = false;
  opened: boolean = false;
  showMainMenu: boolean = false;
  isFocused: boolean = false;
  modalReference: any = false;
  isUnreadMsg: boolean = false;

  selectedMobileMenu: string = "";
  showSearch: boolean = false;
  search: any;
  role: any;

  constructor(
    @Inject(WINDOW) private window: Window,
    @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private el: ElementRef,
    private profileservice: ProfileService,
    private dataService: DataService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // this.dataService.change.subscribe(data => {
    //   this.userDetails = data
    // })

    this.dataService.change.subscribe(data => {
      this.isLogin = true;
      let userData = data;
      if (!data.details) {
        userData = JSON.parse(data);
      }
      this.localStorage.setItem("user", JSON.stringify(userData.user));
      this.userDetails = userData.user;
      this.role = this.userDetails.role;
    });

    if (this.localStorage.getItem("currentUser")) {
      this.isLogin = true;
      this.userDetails = JSON.parse(this.localStorage.getItem("user"));
      this.role = this.userDetails.role;
    }

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  showProfile() {
    this.router.navigate(["@" + this.userDetails.username]);
  }

  goToUploadPhotos() {
    this.router.navigate(["user/upload-photo"]);
  }

  showSearchIcon(flag) {
    this.showSearch = flag;
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

  showMainMenuFn() {
    this.showMainMenu = true;
    this.selectedMobileMenu = "";
  }

  hideMainMenuFn() {
    this.showMainMenu = false;
    this.selectedMobileMenu = "";
  }

  enableMenu(menu) {
    this.selectedMobileMenu = menu;
    this.showMainMenu = true;
  }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.router.navigate([`search/${this.search}`]);
    }
  }

  addFocus() {
    this.isFocused = true;
  }

  readMessages() {
    if (isPlatformBrowser(this.platformId)) {
      this.isUnreadMsg = false;
      this.localStorage.removeItem("notify");
      this.notificationService.updateReadStatus();

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
