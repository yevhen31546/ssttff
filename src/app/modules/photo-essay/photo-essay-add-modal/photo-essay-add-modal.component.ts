import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ProfileService } from '../../profile/profile.service'
import { LoaderService, DataService } from '../../../_services'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { PhotoEssayService } from '../photo-essay.service'
import { Subject } from 'rxjs'

@Component({
  selector: 'app-photo-essay-add-modal',
  templateUrl: './photo-essay-add-modal.component.html',
  styleUrls: ['./photo-essay-add-modal.component.css']
})
export class PhotoEssayAddModalComponent implements OnInit {
  photoEssayForm: FormGroup
  submitted: boolean = false
  @Input() modalData
  @Output('cancelParams') cancelParams: EventEmitter<any> = new EventEmitter<
    any
  >()
  @Output('closeParams') closeParams: EventEmitter<any> = new EventEmitter<
    any
  >()

  constructor(
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private loaderSvc: LoaderService,
    private photoEssayService: PhotoEssayService,
    private dataService: DataService,
    private modalService: NgbModal,
    private modalActiveService: NgbActiveModal
  ) {}

  ngOnInit() {
    this.photoEssayForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      story: [''],
      private: ['']
    })
  }

  create() {
    let data
    this.submitted = true
    ////console.log(this.photoEssayForm.value)
    // stop here if form is invalid
    if (this.photoEssayForm.invalid) {
      return
    }

    this.profileService.addPhotoEssay(this.photoEssayForm.value).subscribe(
      (res: any) => {
        if (this.modalData) {
          let params = {
            upload_id: this.modalData.id,
            photo_essay_id: res.photo_essay_id,
            status: 1
          }
          this.photoEssayService
            .addUploadsEssayData(params)
            .subscribe((response: any) => {})
        }
        data = {
          type: 'success',
          title: 'Saved',
          message: 'Your photo essay has been saved',
          photo_essay_id: res.photo_essay_id,
          photo_essay_title: res.photo_essay_title
        }
        this.dataService.alertData(data)
        this.cancelButton()

        this.modalActiveService.dismiss()
      },
      error => {
        this.submitted = false;
        data = { type: 'error', title: 'Not saved', message: 'Error' }
        this.dataService.alertData(data)
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

  cancelButton() {
    this.cancelParams.emit()
    this.modalActiveService.dismiss()
  }

  closeButton() {
    this.closeParams.emit()
    this.modalActiveService.dismiss()
    //this.modalService.dismissAll()
  }
}
