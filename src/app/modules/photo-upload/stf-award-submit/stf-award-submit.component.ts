import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit , Inject, Optional} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { PhotoUploadService } from '../photo-upload.service'

@Component({
  selector: 'app-stf-award-submit',
  templateUrl: './stf-award-submit.component.html',
  styleUrls: ['./stf-award-submit.component.css']
})
export class StfAwardSubmitComponent implements OnInit {
  imageDetails: any = []
  subjectImg: string
  subjectId: any
  editAward: boolean = true

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private router: Router,
    private route: ActivatedRoute,
    private photoUploadSvc: PhotoUploadService
  ) {}

  ngOnInit() {
    this.subjectId = this.route.snapshot.paramMap.get('subjectId')
    this.photoUploadSvc
      .getPhotoDetails(this.subjectId)
      .subscribe(uploadDetails => { //console.log(uploadDetails)
        this.imageDetails = uploadDetails;
        this.subjectImg = uploadDetails.media;
        const getStorage = {'upload_id': ''};
        getStorage.upload_id = this.imageDetails.id;
        this.localStorage.setItem('storage', JSON.stringify(getStorage))

      })
  }


}
