import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { CollectionsService } from '../collections.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { DataService } from '../../../_services'

@Component({
  selector: 'app-collections-delete',
  templateUrl: './collections-delete.component.html',
  styleUrls: ['./collections-delete.component.css']
})
export class CollectionsDeleteComponent implements OnInit {
  @Input() data: any
  @Output() alert: EventEmitter<any> = new EventEmitter()
  @Output() redirect: EventEmitter<any> = new EventEmitter()

  constructor(
    private collectionsService: CollectionsService,
    private modalService: NgbModal,
    private dataService: DataService
  ) {}

  ngOnInit() {}

  cancelButton() {
    this.modalService.dismissAll()
  }

  continueButton() {
    let data = { collection_id: this.data.id }
    this.collectionsService.deleteCollection(data).subscribe(
      (res: any) => {
        this.modalService.dismissAll()
        let dataResponse = {
          title: res.title,
          message: res.message,
          type: 'success'
        }
        this.dataService.alertData(dataResponse);
        this.alert.emit(dataResponse)
        this.redirect.emit(dataResponse)
        this.dataService.refreshData()
      },
      error => {
        let dataResponse = {
          type: 'error',
          title: 'Yout photo essay did not delete',
          message:
            'There was a problem deleting your photo essay titled ' +
            this.data.title +
            ".Please reach out if you need <span class='underline'>help</span>"
        }
        this.dataService.alertData(dataResponse)
        this.alert.emit(dataResponse)
        this.dataService.refreshData()
      }
    )
  }
}
