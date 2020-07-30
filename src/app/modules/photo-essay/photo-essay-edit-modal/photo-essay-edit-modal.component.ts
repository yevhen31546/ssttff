import { WINDOW } from '@ng-toolkit/universal';
import { AlertService } from './../../../_services/alert.service'
import { Component, OnInit, Input, Output, EventEmitter , Inject} from '@angular/core';
import { PhotoEssayService } from '../photo-essay.service'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DataService } from '../../../_services'
import { PhotoEssayDeleteComponent } from '../photo-essay-delete/photo-essay-delete.component'

@Component({
  selector: 'app-photo-essay-edit-modal',
  templateUrl: './photo-essay-edit-modal.component.html',
  styleUrls: ['./photo-essay-edit-modal.component.css']
})
export class PhotoEssayEditModalComponent implements OnInit {
  photoEssayData: any
  photoEssayForm: FormGroup
  @Input() data: any
  essayDet: any
  submitted: boolean = false
  modalReference: any = false
  @Output() alert: EventEmitter<any> = new EventEmitter()

  constructor(@Inject(WINDOW) private window: Window, 
    private photoEssayService: PhotoEssayService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: DataService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.photoEssayForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      story: [''],
      private: ['']
    })

    this.getPhotoEssayDetails(this.data.share_id)
  }

  getPhotoEssayDetails(id) {
    let data = { photo_essay_id: id }
    this.photoEssayService
      .getPhotoEssayDetails(data)
      .subscribe((response: any) => {
        this.essayDet = response.essays
        this.essayDet.private = this.essayDet.private == '0' ? false : true
        this.photoEssayForm.patchValue(response.essays)
      })
  }

  edit() {
    let data
    this.submitted = true
    ////console.log(this.photoEssayForm.value)
    // stop here if form is invalid
    if (this.photoEssayForm.invalid) {
      return
    }
    this.photoEssayForm.value.photo_essay_id = this.data.id
    this.photoEssayForm.value.private =
      this.photoEssayForm.value.private == false ? '0' : '1'
    this.photoEssayService.editPhotoEssay(this.photoEssayForm.value).subscribe(
      (res: any) => {
        this.modalService.dismissAll()
        let dataResponse = {
          type: 'success',
          title: res.title,
          message: res.message
        }
        //this.alertService.success(res.title, res.message)
        this.dataService.alertData(dataResponse)
        this.alert.emit(dataResponse)
        this.dataService.refreshData()
      },
      error => {
        let dataResponse = {
          type: 'error',
          title: 'Not saved',
          message: 'Error'
        }
        this.alert.emit(dataResponse)
        this.dataService.alertData(dataResponse)
      }
    )
  }

  /**
   *
   */
  checkboxChange(event) {
    let val = event.currentTarget.checked == true ? '1' : '0'
    this.photoEssayForm.value.private = val
  }

  deletePhotoEssay() {
    this.modalReference = this.modalService.open(PhotoEssayDeleteComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = this.data
    this.modalReference.result.then(result => {}, reason => {})
  }

  closeButton() {
    this.modalService.dismissAll()
  }
}
