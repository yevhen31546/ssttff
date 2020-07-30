import { Inject } from '@angular/core';
import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import {
  Component,
  OnInit,
  NgZone,
  ViewChild,
  ElementRef,
  Output,
  Input,
  EventEmitter,Optional
} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgForm, FormControl } from '@angular/forms'
import { LoaderService, MiscService } from '../../../_services'
import { PhotoUploadService } from '../photo-upload.service'
import { MapsAPILoader } from '@agm/core'
import * as _ from 'lodash'
import * as  MobileDetect from 'mobile-detect'

declare var google: any;

declare namespace google.maps.places {
    export interface PlaceResult { geometry; formatted_address; }
}

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})



export class DetailsComponent implements OnInit {
  photoDetails: any = {}
  private diffObj: any
  public latitude: number
  public longitude: number
  public location: FormControl
  public zoom: number
  current_page: number
  searchTagTerm: string
  selected_location: string
  tags: any = []
  allowedTagCount: number = 3
  maxTags: Number = 11
  @Output()
  public active: EventEmitter<boolean> = new EventEmitter()
  @Input()
  imageDetails: any = []
  @ViewChild('search')
  public searchElementRef: ElementRef
  mobile: Boolean = false
  message: String = 'Type and press enter to add each tag - minimum of 1 tag'
  public deactivateGuard: EventEmitter<boolean> = new EventEmitter()

  @Input()
  isEdit: boolean

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private router: Router,
    private route: ActivatedRoute,
    private photoUploadSvc: PhotoUploadService,
    private loaderSvc: LoaderService,
    private miscSvc: MiscService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {}
  ngOnInit() { ////console.log(this.imageDetails, "imageDetails");
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true
    }
    //set google maps defaults
    this.zoom = 4
    this.latitude = 39.8282
    this.longitude = -98.5795

    //create search FormControl
    this.location = new FormControl()

    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRef.nativeElement,
        {
          types: ['geocode']
        }
      )
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace()

          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return
          }

          // ////console.log(place.formatted_address)
          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat()
          this.longitude = place.geometry.location.lng()
          this.zoom = 12
          this.selected_location = place.formatted_address;
          this.imageDetails.location = this.selected_location
          //this.profileForm.value.location = place.formatted_address
        })
      })
    })
  }

  searchFilterData(term) {
    this.tags = []
    this.current_page = 1
    this.searchTagTerm = term
    if (term.length >= this.allowedTagCount) {
      this.loadTags(true)
    }
  }

  photoDetailsSubsc() {
    // this.photoUploadSvc.photoDetails$.subscribe((photoDetails: any) => {
    //   if (photoDetails.title == '' || photoDetails.story == '') {
    //     this.router.navigate(['../story'], { relativeTo: this.route })
    //   }
    //   this.photoDetails.upload_id = photoDetails.id
    //   this.photoDetails.location = photoDetails.location
    //   this.photoDetails.tags = photoDetails.tags
    //   this.tags = ['sample 1', 'sample 2']
    //   this.diffObj = this.miscSvc.deepCopy(photoDetails)
    // })
  }

  submitDetails(f: NgForm) {
    if (f.invalid) {
      return
    }
    this.loaderSvc.display()

    this.photoDetails.tags = this.imageDetails.tags.join(',')
    this.photoDetails.upload_id = this.imageDetails.id
    this.photoDetails.location = this.selected_location
    let getStorage = JSON.parse(this.localStorage.getItem('storage'))

    getStorage.tags = this.imageDetails.tags.join(',')
    getStorage.location = this.selected_location

    // insert updated array to local storage
    this.localStorage.setItem('storage', JSON.stringify(getStorage))
    if (!this.isEdit) {
      this.photoUploadSvc
        .updatePhotoDetails(this.photoDetails)
        .subscribe(res => {
        })
    } else {
      this.localStorage.removeItem('subjectId')
    }
    this.loaderSvc.hide()
    this.deactivateGuard.emit(false)
    this.active.emit(false);
  }

  loadTags(search = false) {
    let data = {
      page: this.current_page,
      per_page: 10,
      searchTerm: this.searchTagTerm
    }
    this.tags = _.uniq(this.tags)
    this.tags = _.split(this.searchTagTerm, ',')
  }

  addTag(name) {
    ////console.log({ name: name, tag: true })
    if (this.searchTagTerm.length < 3) {
      this.imageDetails.tags.splice(1, this.searchTagTerm)
      this.tags = this.imageDetails.tags
      //  return { name: name, tag: false };
      ////console.log(this.imageDetails.tags)
    }
  }

  addData(value) {
  }

  getTag(event: Event, term: String) {
    term = term.trim()
    this.tags = _.uniq(this.tags)
    this.tags = _.split(term, ',')
    if ((term && term.length < this.allowedTagCount) || term.length === 0) {
      event.stopImmediatePropagation()
    }
    return false
  }
}
