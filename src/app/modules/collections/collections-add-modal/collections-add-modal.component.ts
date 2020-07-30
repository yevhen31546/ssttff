import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { ProfileService } from '../../profile/profile.service'
import { LoaderService, DataService } from '../../../_services'
import {
  NgbModal,
  NgbActiveModal,
  NgbModalRef
} from '@ng-bootstrap/ng-bootstrap'
import { CollectionsService } from '../collections.service'

@Component({
  selector: 'app-collections-add-modal',
  templateUrl: './collections-add-modal.component.html',
  styleUrls: ['./collections-add-modal.component.css']
})
export class CollectionsAddModalComponent implements OnInit {
  collectionForm: FormGroup
  submitted: boolean = false
  @Input() modalData
  @Output('cancelParams') cancelParams: EventEmitter<any> = new EventEmitter<
    any
  >()
  @Output('closeParams') closeParams: EventEmitter<any> = new EventEmitter<
    any
  >()
  modalReference: NgbModalRef

  constructor(
    private formBuilder: FormBuilder,
    private collectionService: CollectionsService,
    private loaderSvc: LoaderService,
    private dataService: DataService,
    private modalService: NgbModal,
    private modalActiveService: NgbActiveModal
  ) {}

  ngOnInit() {
    this.collectionForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      story: [''],
      private: ['']
    })
  }

  create() {
    let data;
    this.submitted = true
    ////console.log(this.collectionForm.value)
    // stop here if form is invalid
    if (this.collectionForm.invalid) {
      return
    }

    this.collectionService.addCollection(this.collectionForm.value).subscribe(
      (res: any) => {
        // this.modalService.dismissAll()
        if (this.modalData) {
          let params = {
            upload_id: this.modalData.id,
            collection_id: res.collection_id,
            status: 1
          }
          this.collectionService
            .addUploadsCollectionData(params)
            .subscribe((response: any) => {})
        }
        data = {
          type: 'success',
          title: res.title,
          message: res.message
        }
        this.dataService.alertData(data)
        this.closeButton()
        this.modalActiveService.dismiss();

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
    this.collectionForm.value.private = val
  }

  closeButton() {
    this.closeParams.emit()
    this.modalActiveService.dismiss()
    //this.modalService.dismissAll()
  }

  cancelButton() {
    this.cancelParams.emit()
    this.modalActiveService.dismiss()

  }
}
