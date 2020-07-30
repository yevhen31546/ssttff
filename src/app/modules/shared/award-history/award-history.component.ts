import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileService } from './../../profile/profile.service';
import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-award-history',
  templateUrl: './award-history.component.html',
  styleUrls: ['./award-history.component.css']
})
export class AwardHistoryComponent implements OnInit {

  @Input() historyId: any = '';
  awardHistory: any = [];
  constructor(
    private profileservice: ProfileService,
    private modalService: NgbActiveModal,
    private router: Router
  ) { }

  ngOnInit() {
    this.getHistory();
  }

  getHistory() {
    const data = {upload_id: this.historyId };
    this.profileservice.getHistory(data).subscribe((res: any) => {
        ////console.log(res);
      this.awardHistory = res.awardHistory;
    });
  }


  getDates(data: any, type: any = '') {
    const format = type === 'year' ? moment(data).format('MMMM YYYY') : moment(data).format('MMM DD, YYYY');
    return format;
  }

  submitStfAwards(id: any) {
    this.modalService.close();
    this.router.navigate(['user/upload-photo/submit-stf-awards', id]);

  }

  close() {
    this.modalService.close()
  }

}
