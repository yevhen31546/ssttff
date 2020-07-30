import { Component, OnInit, Input } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
  FormControl
} from '@angular/forms'
import { ProfileService } from '../profile.service'
import { LoaderService, AlertService } from '../../../_services'

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  @Input() reportList: any
  reportForm: FormGroup
  @Input() profileData: any
  controls: any
  validationErrors = []
  reportArray = []
  showCreateModal: boolean = false
  buttonState: boolean = false

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private profileservice: ProfileService,
    private loaderService: LoaderService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    //this.getReportData()
    // Create a new array with a form control for each order
    this.controls = this.reportList.map(c => new FormControl(false))
    ////console.log(this.controls)
    //controls[0].setValue(true) // Set the first checkbox to true (checked)
    this.reportForm = this.formBuilder.group({
      report: new FormArray(this.controls)
    })

    this.reportList.forEach(val => {
      if (val.status == 1) {
        this.reportArray.push(true)
        this.buttonState = true
      } else {
        this.reportArray.push(false)
      }
    })
    this.reportForm.controls['report'].setValue(this.reportArray)
  }

  addReport() {
    const selectedReports = this.reportForm.value.report.map(
      (v, i) => this.reportList[i]
    )
    let data = {
      to_user_id: this.profileData.id,
      selectedReports: selectedReports
    }
    this.profileservice.addReport(data).subscribe(
      (response: any) => {
        this.alertService.success(response.title, response.message)
      },
      error => {
        ////console.log(error)
        let response = error.error
        //   this.eventService.loaderVisibility.next(false)
        if (error.status == 400) {
          if (response.error) {
            this.validationErrors = response.error
          } else {
            this.alertService.error(response.title, response.common_error)
          }
        }
      }
    )
  }

  checkboxChange(event, item) {
    if (this.reportForm.value.report.indexOf(true) > -1) {
      this.buttonState = true
    } else {
      this.buttonState = false
    }

    let val = event.currentTarget.checked == true ? '1' : '0'
    item.status = val
  }

  closeButton() {
    this.modalService.dismissAll()
  }
}
