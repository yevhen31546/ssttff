import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { PhotoEssayService } from '../photo-essay.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DataService } from '../../../_services'
import { Router } from '@angular/router'

@Component({
  selector: 'app-photo-essay-delete',
  templateUrl: './photo-essay-delete.component.html',
  styleUrls: ['./photo-essay-delete.component.css']
})
export class PhotoEssayDeleteComponent implements OnInit {
  @Input() data: any
  @Output() alert: EventEmitter<any> = new EventEmitter()
  @Output() redirect: EventEmitter<any> = new EventEmitter()

  constructor(
    private photoEssayService: PhotoEssayService,
    private modalService: NgbModal,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {}

  cancelButton() {
    this.modalService.dismissAll()
  }

  continueButton() {
    let data = { photo_essay_id: this.data.id }
    this.photoEssayService.deletePhotoEssay(data).subscribe(
      (res: any) => {
        this.modalService.dismissAll()
        let dataResponse = {
          title: res.title,
          message: res.message,
          type: 'success'
        }
        this.alert.emit(dataResponse)
        this.dataService.alertData(dataResponse)
        this.dataService.refreshData()
        this.redirect.emit(dataResponse)

      },
      error => {
        this.modalService.dismissAll()
        let dataResponse = {
          title: 'Yout collection did not delete',
          message:
            'There was a problem deleting your collection titled ' +
            this.data.title +
            ".Please reach out if you need <span class='underline'>help</span>"
        }
        this.alert.emit(dataResponse)
        this.dataService.alertData(dataResponse)
        this.dataService.refreshData()
      }
    )
  }
}
