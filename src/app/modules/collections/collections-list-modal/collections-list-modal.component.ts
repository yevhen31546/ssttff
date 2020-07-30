import { WINDOW } from '@ng-toolkit/universal';
import { Component, OnInit, Input , Inject} from '@angular/core';
import { CollectionsAddModalComponent } from '../collections-add-modal/collections-add-modal.component'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { CollectionsService } from './../collections.service'

@Component({
  selector: 'app-collections-list-modal',
  templateUrl: './collections-list-modal.component.html',
  styleUrls: ['./collections-list-modal.component.css']
})
export class CollectionsListModalComponent implements OnInit {
  modalReference: any = false
  collectionList: any
  @Input() data: any
  modalData: any
  modalList: any
  showCreateModal: boolean = false

  constructor(@Inject(WINDOW) private window: Window, 
    private modalService: NgbModal,
    private modalActiveService: NgbActiveModal,
    private collectionsService: CollectionsService
  ) {}

  ngOnInit() {
    this.getCollectionList()
  }

  createModal() {
    this.modalData = this.data
    this.showCreateModal = true
    //this.modalService.dismissAll()
    // this.modalReference = this.modalService.open(CollectionsAddModalComponent, {
    //   windowClass: 'modal-md'
    // })

    // //this.modalReference = this.modalService.open(content)
    // this.modalReference.componentInstance.modalData = this.data
    // this.modalReference.result.then(
    //   result => {
    //     this.getCollectionList()
    //   },
    //   reason => {
    //     this.getCollectionList()
    //   }
    // )
  }

  cancelModal() {
    this.showCreateModal = false
    this.getCollectionList()
  }

  /**
   *Get Photo Essay List
   */
  getCollectionList() {
    let data = { upload_id: this.data.id }
    this.collectionsService
      .getCollectionData(data)
      .subscribe((response: any) => {
        this.collectionList = response.collections
      })
  }

  checkboxChange($event, id) {
    let status = $event.currentTarget.checked == true ? 1 : 0
    let data = {
      upload_id: this.data.id,
      collection_id: id,
      status: status
    }
    ////console.log(data)
    this.collectionsService
      .addUploadsCollectionData(data)
      .subscribe((response: any) => {})
  }

  closeButton() {
    this.modalActiveService.dismiss()
  }
}
