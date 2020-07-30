import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, Input, Output, EventEmitter , Inject} from '@angular/core';
import { CollectionsService } from '../collections.service'
import { FormBuilder, Validators, FormGroup } from '@angular/forms'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DataService } from '../../../_services'
import { CollectionsDeleteComponent } from '../collections-delete/collections-delete.component'

@Component({
  selector: 'app-collections-edit-modal',
  templateUrl: './collections-edit-modal.component.html',
  styleUrls: ['./collections-edit-modal.component.css']
})
export class CollectionsEditModalComponent implements OnInit {
  collectionData: any
  collectionForm: FormGroup
  @Input() data: any
  @Output() alert: EventEmitter<any> = new EventEmitter()
  collectionDet: any
  submitted: boolean = false
  modalReference: any = false

  constructor(@Inject(WINDOW) private window: Window, 
    private collectionsService: CollectionsService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.collectionForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      story: [''],
      private: ['']
    })

    this.getCollectionDetails(this.data.share_id)
  }

  getCollectionDetails(id) {
    let dataAppend = { collection_id: id }
    this.collectionsService
      .getCollectionDetails(dataAppend)
      .subscribe((response: any) => {
        this.collectionDet = response.collections
        this.collectionDet.private =
          this.collectionDet.private == '0' ? false : true
        this.collectionForm.patchValue(response.collections)
      })
  }

  edit() {
    let data
    this.submitted = true
    ////console.log(this.collectionForm.value)
    // stop here if form is invalid
    if (this.collectionForm.invalid) {
      return
    }
    this.collectionForm.value.collection_id = this.data.id
    this.collectionForm.value.private =
      this.collectionForm.value.private == false ? '0' : '1'
    this.collectionsService.editCollection(this.collectionForm.value).subscribe(
      (res: any) => {
        this.modalService.dismissAll()
        let dataResponse = {
          type: 'success',
          title: res.title,
          message: res.message
        }
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
        this.dataService.alertData(dataResponse)
        this.alert.emit(dataResponse)
        this.dataService.refreshData()
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

  cancelButton() {
    this.modalService.dismissAll()
  }

  deleteCollection() {
    this.modalReference = this.modalService.open(CollectionsDeleteComponent, {
      windowClass: 'modal-md'
    })
    this.modalReference.componentInstance.data = this.data
    this.modalReference.result.then(result => {}, reason => {})
  }
}
