import { Inject,Optional } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import {
  Component,
  OnInit,
  Output,
  AfterViewInit,
  EventEmitter,
  Input,
  ViewChild
} from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NgForm } from '@angular/forms'
import {
  LoaderService,
  MiscService,
  AlertService,
  DataService
} from '../../../_services'
import { PhotoUploadService } from '../photo-upload.service'
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { PhotoEssayAddModalComponent } from '../../photo-essay/photo-essay-add-modal/photo-essay-add-modal.component'
import { PhotoEssayService } from '../../photo-essay/photo-essay.service'

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, AfterViewInit {
  photoCategs: Array<any> = []
  photoEssays: Array<any> = []
  modalData: any
  photoCategory: any = {}
  modalReference: any
  adult_content: boolean = false
  private diffObj: any
  @Output()
  public active: EventEmitter<boolean> = new EventEmitter()
  @Input()
  imageDetails: any = []
  @Input()
  isEdit: boolean
  showCreateModal: boolean = false
  @Output()
  public deactivateGuard: EventEmitter<boolean> = new EventEmitter()
  authUserDetails: any = ''
  @ViewChild('myselect') myselect;

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private router: Router,
    private route: ActivatedRoute,
    private photoUploadSvc: PhotoUploadService,
    private loaderSvc: LoaderService,
    private miscSvc: MiscService,
    private alertService: AlertService,
    private modalService: NgbModal,
    private _dataService: DataService,
    private photoEssayService: PhotoEssayService,

  ) { }

  ngOnInit() {
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
    }
    this.modalData = this.imageDetails;

    this._dataService.alert.subscribe((val: any) => {
      ////console.log(val)
      this.imageDetails.photo_essay = { id: val.photo_essay_id, title: val.photo_essay_title };
      // this.imageDetails.photo_essay.push({id:val.photo_essay_id,title:val.photo_essay_title})

      //this.myselect.select(val.photo_essay_id);
      // this.photoCategs['id'] = val.photo_essay_id
      // this.photoCategs['id'] = val.photo_essay_id
    })
    ////console.log(this.imageDetails, 'screen', this.imageDetails.category_id)
    // this.imageDetails.category_id = '';
    this.photoUploadSvc.getCategory().subscribe(res => {
      this.photoCategs = res.categories
    })
    this.photoUploadSvc.getPhotoEssay().subscribe(res => {
      this.photoEssays = res.essays
      ////console.log(res)
    })
  }

  ngAfterViewInit() {
    //this.adult_content=this.imageDetails.adult_content
  }

  submitCategory(f: NgForm) {
    if (f.invalid) {
      return
    }
    this.loaderSvc.display()
    this.photoCategory.adult_content =
      this.imageDetails.adult_content == true ? '1' : '0'
    this.photoCategory.upload_id = this.imageDetails.id
    this.photoCategory.category_id = this.imageDetails.category_id
    this.photoCategory.photo_essay = this.imageDetails.photo_essay.id

    console.log(this.photoCategory, this.imageDetails.photo_essay, this.imageDetails)

    let getStorage = JSON.parse(this.localStorage.getItem('storage'))
    if (getStorage) {
      getStorage.photo_essay = this.imageDetails.photo_essay.id
      getStorage.category_id = this.imageDetails.category_id
      getStorage.upload_id = this.imageDetails.id
      getStorage.adult_content = this.photoCategory.adult_content

      // insert updated array to local storage
      this.localStorage.setItem('storage', JSON.stringify(getStorage))

      if (this.isEdit) {
        this.photoCategory = getStorage
      }
    }

    this.photoUploadSvc.updatePhotoDetails(this.photoCategory).subscribe(
      res => {
        
        this.loaderSvc.hide()
        if (!this.isEdit) {
          this.active.emit(false)
        } else {
          this.deactivateGuard.emit(true)
          this.alertService.success(
            'Changes Saved',
            "Changes to your photo have been saved. You can see it in <a href='/@" +
            this.authUserDetails.username +
            "'>your profile</a>."
          )
        }
      },
      error => {
        this.alertService.error(
          'Changes not Saved',
          "Changes have not been saved. Please let us know if you need <a href='ss'>help</a>."
        )
      }
    )
  }

  checkboxChange(event) {
    this.imageDetails.adult_content = event.currentTarget.checked
  }

  createPhotoEssay() {
    this.modalReference = this.modalService.open(PhotoEssayAddModalComponent, {
      centered: true
    })
    this.modalReference.componentInstance.modalData = this.imageDetails
    this.modalReference.result.then(
      result => {
        ////console.log(result)

        this.photoUploadSvc.getPhotoEssay().subscribe(res => {
          this.photoEssays = res.essays;
        })
      },
      reason => {
        ////console.log(reason)
        this.photoUploadSvc.getPhotoEssay().subscribe(res => {
          this.photoEssays = res.essays;
        })
      }
    )
  }

  cancelModal() {
    this.showCreateModal = false
  }

  onAddEssay(event: any) {
      console.log(event,"essay event");

      let params = {
        upload_id: this.imageDetails.id,
        photo_essay_id: event.id,
        status: 1
      }
      this.photoEssayService
        .addUploadsEssayData(params)
        .subscribe((response: any) => {})
    }
  

  onRemoveEssay(event: any) {
    console.log(event,"essay remove event")

    let params = {
      upload_id: this.imageDetails.id,
      photo_essay_id: event.id,
      status: 0
    }
    this.photoEssayService
      .addUploadsEssayData(params)
      .subscribe((response: any) => {})
  }
}
