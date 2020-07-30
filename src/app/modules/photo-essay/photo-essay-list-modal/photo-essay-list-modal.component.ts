import { Component, OnInit, Input } from '@angular/core'
import { PhotoEssayAddModalComponent } from '../photo-essay-add-modal/photo-essay-add-modal.component'
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { PhotoEssayService } from './../photo-essay.service'

@Component({
  selector: 'app-photo-essay-list-modal',
  templateUrl: './photo-essay-list-modal.component.html',
  styleUrls: ['./photo-essay-list-modal.component.scss']
})
export class PhotoEssayListModalComponent implements OnInit {
  modalReference: any = false
  essayList: any
  @Input() data: any
  modalList: any
  showCreateModal: boolean = false
  modalData: any
  essayHeight: any = '';

  constructor(
    private modalService: NgbModal,
    private modalActiveService: NgbActiveModal,
    private photoEssayService: PhotoEssayService
  ) {}

  ngOnInit() {
    this.getPhotoEssayList()
  }

  createModal() {
    this.modalData = this.data
    this.showCreateModal = true
  }

  cancelModal() {
    this.getPhotoEssayList()
    this.showCreateModal = false
  }

  /**
   *Get Photo Essay List
   */
  getPhotoEssayList() {
    let data = { upload_id: this.data.id }
    this.photoEssayService
      .getPhotoEssayData(data)
      .subscribe((response: any) => {
        this.essayList = response.essays; //console.log(this.essayList.length)
        this.essayHeight = this.essayList.length > 4 ? '400px' : '';
      })
  }

  checkboxChange($event, id) {
    let status = $event.currentTarget.checked == true ? 1 : 0
    let data = {
      upload_id: this.data.id,
      photo_essay_id: id,
      status: status
    }
    ////console.log(data)
    this.photoEssayService
      .addUploadsEssayData(data)
      .subscribe((response: any) => {})
  }

  closeButton() {
    // this.modalService.dismissAll()
    this.modalActiveService.dismiss()
  }
}
