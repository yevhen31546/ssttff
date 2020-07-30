import { LOCAL_STORAGE } from "@ng-toolkit/universal";
import { Input, Inject, PLATFORM_ID, Optional } from "@angular/core";
import { DataService } from "./../../../_services/data.service";
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone
} from "@angular/core";
import { UserService } from "../user.service";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from "@angular/forms";
import { MapsAPILoader } from "@agm/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { AlertService, LoaderService } from "../../../_services";
import { environment } from "../../../../environments/environment";
import { Router, ActivatedRoute } from "@angular/router";
import { FileUploader } from "ng2-file-upload";
import { CroppieOptions } from "croppie";
import { NgxCroppieComponent } from "../../../_components/ngx-croppie/ngx-croppie.component";
import { ProfileService } from "../../profile/profile.service";
import {
  HttpRequest,
  HttpClient,
  HttpEventType,
  HttpResponse,
  HttpErrorResponse
} from "@angular/common/http";
import { environment as env } from "../../../../environments/environment";
import { isPlatformBrowser } from "@angular/common";

declare var google: any;

declare namespace google.maps.places {
  export interface PlaceResult {
    geometry;
    formatted_address;
  }
}

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
  providers: [AlertService]
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  submitted: boolean = false;
  url: any;
  progressBar: number;
  progressStatus: boolean = false;
  zoomLevel: number = 50;
  percentDone: number;

  // @ViewChild('uploader')
  // uploader: ElementRef
  URL = environment.apiUrl + "uploadProfilePhoto";

  @ViewChild("emailalert")
  emailalert: ElementRef;

  @ViewChild("firstDeleteAlert")
  firstDeleteAlert: ElementRef;

  @ViewChild("secondDeleteAlert")
  secondDeleteAlert: ElementRef;

  @ViewChild("unableDeleteAlert")
  unableDeleteAlert: ElementRef;

  public latitude: number;
  public longitude: number;
  public location: FormControl;
  public zoom: number;
  currentemail: string;
  image_name: string;
  newemail: string;
  formResults: any;
  validationErrors: any = [];
  commonErrors: any = [];
  isAvailabilty: boolean = false;
  isEmailUpdate: boolean = false;
  returnUrl: string;
  currentEmail: string;
  clientPhotoUpload: boolean = false;
  currentUser = JSON.parse(this.localStorage.getItem("currentUser"));
  uploader: FileUploader = new FileUploader({
    url: this.URL,
    itemAlias: "media",
    authTokenHeader: "Authorization",
    authToken: `Bearer ${this.currentUser.token}`,
    allowedMimeType: ["image/jpeg", "image/png", "image/gif"],
    queueLimit: 1
  });
  hasBaseDropZoneOver: boolean = false;
  hasAnotherDropZoneOver: boolean = false;
  selected_location: string;
  progressBarShow: boolean = false;
  dailyuploadcount: string;
  submissioncount: string;
  user: any = "";

  @ViewChild("search")
  public searchElementRef: ElementRef;
  @Input() expire: any;
  isBrowser: boolean;

  /* Croppie UI Variables */
  @ViewChild("ngxCroppie") ngxCroppie: NgxCroppieComponent;
  widthPx = "164";
  heightPx = "164";
  croppieImage: string;
  croppedContent: any;
  cropMode = false;
  /* Croppie UI Variables */

  constructor(
    @Optional()
    @Inject(LOCAL_STORAGE)
    private localStorage: any,
    @Inject(PLATFORM_ID) platformId: Object,
    private formBuilder: FormBuilder,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private userservice: UserService,
    private modalService: NgbModal,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private route: ActivatedRoute,
    private router: Router,
    private dataservice: DataService,
    private profileservice: ProfileService,
    private http: HttpClient
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.uploader.onBeforeUploadItem = item => {
        item.withCredentials = false;
        this.progressBarShow = true;
      };

      this.uploader.onWhenAddingFileFailed = (item, filter) => {
        this.validationErrors = {
          image: ["You can upload jpg, gif and png files only."]
        };
        this.clientPhotoUpload = false;
        this.alertService.warning(
          "Incorrect file type.",
          'The file you have selected is not correct. Please make sure the photo is a <span class="font-weight-bold">.jpg, .jpeg, .gif</span> or <span class="font-weight-bold">.png</span> file.You can read more you <a>about the file types here.</a>'
        );

        //this.uploader.clearQueue()
      };

      this.uploader.onAfterAddingFile = () => {
        this.validationErrors = [];
        //this.uploader.clearQueue()
      };

      this.uploader.onCompleteItem = (
        item: any,
        response: any,
        status: any,
        headers: any
      ) => {
        this.clientPhotoUpload = false;
        this.dataservice.changeData(response);
        this.uploader.queue[0].remove();
      };

      const reg =
        "^(http://www.|https://www.|http://|https://|www.)[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$";
      //const reg="^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$"
      // , [Validators.pattern(reg)]
      this.profileForm = this.formBuilder.group({
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
        location: [""],
        web_link: ["", Validators.pattern(reg)],
        facebook_link: [
          "",
          [Validators.pattern("^.*(?:facebook.com|fb.me).*$")]
        ],
        twitter_link: ["", [Validators.pattern("^.*(?:twitter.com).*$")]],
        instagram_link: ["", [Validators.pattern("^.*(?:instagram.com).*$")]],
        description: [""],
        //  email: ['', [Validators.required, Validators.email]],
        email: ["", [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]],
        collective_score_d: [true],
        availability_d: [false],
        emailChanged: [0],
        collective_score: [],
        availability: [],
        name: [true]
      });
      //set google maps defaults
      this.zoom = 4;
      this.latitude = 39.8282;
      this.longitude = -98.5795;

      //create search FormControl
      this.location = new FormControl();

      //set current position
      this.setCurrentPosition();
      this.mapsAPILoader.load().then(() => {
        let autocomplete = new google.maps.places.Autocomplete(
          this.searchElementRef.nativeElement,
          {
            types: ["geocode"]
          }
        );
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            //get the place result
            let place: google.maps.places.PlaceResult = autocomplete.getPlace();

            //verify result
            if (place.geometry === undefined || place.geometry === null) {
              return;
            }

            ////console.log(place)
            // ////console.log(place.formatted_address)
            //set latitude, longitude and zoom
            this.latitude = place.geometry.location.lat();
            this.longitude = place.geometry.location.lng();
            this.zoom = 12;
            this.selected_location = place.formatted_address;
            //this.profileForm.value.location = place.formatted_address
          });
        });
      });
    }
    this.getUserProfile();
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  private setCurrentPosition() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }

  checkboxChange(event, params) {
    let val = event.currentTarget.checked == true ? "1" : "0";
    if (params == "availability") {
      this.profileForm.value.availability = val;
    } else {
      this.profileForm.value.collective_score = val;
    }
  }

  /* ---------------------- Croppie --------------------- */
  get croppieOptions(): CroppieOptions {
    const opts: CroppieOptions = {};
    opts.viewport = {
      width: parseInt(this.widthPx, 10),
      height: parseInt(this.heightPx, 10),
      type: "circle"
    };
    opts.boundary = {
      width: parseInt(this.widthPx, 10),
      height: parseInt(this.heightPx, 10)
    };
    opts.enforceBoundary = true;
    opts.enableOrientation = true;
    opts.showZoomer = true;
    return opts;
  }

  newImgFromCroppie(file: File) {
    this.croppedContent = file;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.croppieImage = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  imageUploadEvent(evt: any) {
    if (this.validationErrors.length) {
      return;
    }
    if (!evt.target || !evt.target.files || evt.target.files.length > 1) {
      return;
    }
    this.uploader.progress = 0;

    const file = evt.target.files[0];
    ////console.log(file)
    if (typeof file !== "undefined") {
      this.clientPhotoUpload = true;
      this.cropMode = true;
      this.image_name = file.name;
      const fr = new FileReader();
      fr.onloadend = (e: any) => {
        this.croppieImage = e.target.result;
      };
      fr.readAsDataURL(file);
    }
  }

  saveImageFromCroppie() {
    this.url = this.croppieImage;
    this.croppedContent.lastModified = new Date().getTime();
    this.croppedContent.name = this.image_name;
    try {
      this.uploader.addToQueue([this.croppedContent]);
      this.uploader.uploadAll();
      this.cropMode = false;
      this.croppieImage = "";
    } catch (err) {
      this.alertService.warning(
        "File Upload Error",
        "An unexpected error occurred while trying to upload image." +
          ' Please make sure the photo is a <span class="font-weight-bold">.jpg, .jpeg, .gif</span> or' +
          '<span class="font-weight-bold">.png</span> file.'
      );
      this.cropMode = false;
    }
  }
  /* ---------------------- Croppie -------------------- */

  cancelUploadFile() {
    if (this.uploader.queue.length) {
      this.uploader.queue[0].remove();
    }
    this.progressBarShow = false;
    this.clientPhotoUpload = false;
    this.croppieImage = "";
    this.cropMode = false;
    // ////console.log(this.profileForm.value)
  }

  removeCurrentFile() {
    this.userservice.deleteProfileImage().subscribe(
      (response: any) => {
        //this.profileForm.setValue = response.user
        this.url = "";
        this.getUserProfile();
        //this.dataservice.changeData(response)
      },
      error => {
        let response = error.error;
        //   this.eventService.loaderVisibility.next(false)
        if (response.status == 400) {
          if (response.error) {
            this.validationErrors = response.error;
          } else {
            this.alertService.error(response.title, response.common_error);
          }
        }
      }
    );
  }

  getUserProfile() {
    this.userservice
      .getProfileData(this.currentUser.user.username)
      .subscribe((response: any) => {
        //this.profileForm.setValue = response.user
        this.profileForm.patchValue(response.user);
        this.currentEmail = response.user.email;
        let availability = response.user.availability == "1" ? true : false;
        let collective_score =
          response.user.collective_score == "1" ? true : false;
        this.profileForm.patchValue({
          availability_d: availability,
          collective_score_d: collective_score
        });
        this.url = response.user.photo_url;
        this.user = response.user;
        this.localStorage.setItem("user", JSON.stringify(response.user));
      });
  }

  // getUploadCount() {
  //   this.userservice.getSubmissionCount().subscribe((response: any) => {
  //     this.dailyuploadcount = response.dailyUploads
  //     this.submissioncount = response.submission
  //   })
  // }

  open(content) {
    this.modalService.open(content).result.then(
      result => {
        this.isEmailUpdate = true;
      },
      reason => {
        this.isEmailUpdate = false;
        this.profileForm.patchValue({ email: this.currentEmail });
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      }
    );
  }

  checkEmailChanges() {
    if (this.currentEmail != this.profileForm.value.email) {
      this.open(this.emailalert);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.profileForm.controls;
  }

  onSubmit($event) {
    //console.log($event)
    if ($event.keyCode == 13) {
      // alert("sorry");
    }
    ////console.log(this.profileForm.value)
    this.submitted = true;
    // stop here if form is invalid
    if (this.profileForm.invalid) {
      ////console.log(this.profileForm)
      return;
    }
    if (this.isEmailUpdate == true) {
      this.profileForm.patchValue({ emailChanged: 1 });
    }
    let availability =
      this.profileForm.value.availability_d == true ? "1" : "0";
    let collective_score =
      this.profileForm.value.collective_score_d == true ? "1" : "0";
    this.profileForm.patchValue({
      availability: availability,
      collective_score: collective_score,
      location: this.selected_location,
      name: `${this.profileForm.value.first_name} ${this.profileForm.value.last_name}`
    });
    this.userservice.editProfile(this.profileForm.value).subscribe(
      (response: any) => {
        this.alertService.success(response.title, response.message);
        ////console.log(this.isEmailUpdate == true)
        if (this.isEmailUpdate == true) {
          this.returnUrl =
            "/email-verification/" + this.profileForm.controls.email.value;
          this.router.navigate([this.returnUrl]);
          this.userservice.logout();
        }
        this.profileForm.patchValue(response.user);
        this.currentEmail = response.user.email;
        let availability = response.user.availability == "1" ? true : false;
        let collective_score =
          response.user.collective_score == "1" ? true : false;
        this.profileForm.patchValue({
          availability_d: availability,
          collective_score_d: collective_score
        });
        this.url = response.user.photo_url;
        ////console.log(response.user, 'editprofile')
        let currentUser = JSON.parse(this.localStorage.getItem("currentUser"));
        currentUser.user = response.user;
        this.localStorage.setItem("currentUser", JSON.stringify(currentUser));
        this.localStorage.setItem("user", JSON.stringify(response.user));

        response.details = true;
        this.dataservice.changeData(response);
      },
      error => {
        ////console.log(error)
        let response = error.error;
        //   this.eventService.loaderVisibility.next(false)
        if (response.status == 400) {
          if (response.error) {
            this.validationErrors = response.error;
          } else {
            this.alertService.error(response.title, response.common_error);
          }
        }
      }
    );
  }

  setCounter(event) {
    this.zoomLevel = event.value;
  }

  deleteAccount() {
    if (this.user.stf_entry == 0 && this.user.award_entry == 0) {
      this.modalService.open(this.firstDeleteAlert).result.then(
        result => {
          this.modalService.open(this.secondDeleteAlert).result.then(
            result => {
              const formData: FormData = new FormData();
              const req = new HttpRequest(
                "DELETE",
                env.apiUrl + "deleteAccount",
                formData,
                {
                  reportProgress: true
                }
              );

              this.http.request(req).subscribe(
                (event: any) => {
                  // Via this API, you get access to the raw event stream.
                  // Look for upload progress events.
                  if (event.type === HttpEventType.UploadProgress) {
                    // This is an upload progress event. Compute and show the % done:
                    this.percentDone = Math.round(
                      (100 * event.loaded) / event.total
                    );
                    let text = "Deleting your Shoot The Frame Account…";
                    this.loaderService.display(this.percentDone, true, text);
                  } else if (event instanceof HttpResponse) {
                    ////console.log(event.status)
                    this.loaderService.hide();
                    let data = {
                      fcm_token: this.localStorage.getItem("f_token")
                    };
                    this.profileservice.logout(data).subscribe(res => {});
                    this.localStorage.removeItem("currentUser");
                    this.localStorage.removeItem("user");
                    this.localStorage.removeItem("notify");
                    this.router.navigate(["/account/deleted"]);
                  }
                },
                err => {
                  this.loaderService.hide();
                  this.modalService.open(this.unableDeleteAlert);
                }
              );
            },
            reason => {}
          );
        },
        reason => {}
      );
    } else {
      this.modalService.open(this.unableDeleteAlert);
    }
  }
}
