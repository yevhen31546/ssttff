import { DataService } from './../../../_services/data.service';
import { PhotoEssayService } from './../photo-essay.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-photo-essay',
  templateUrl: './share-photo-essay.component.html',
  styleUrls: ['./share-photo-essay.component.css']
})
export class SharePhotoEssayComponent implements OnInit {
  shareId: any = '';
  essay: any = [];

  constructor(
   private route: ActivatedRoute,
   private photoEssayService: PhotoEssayService,
  private _data: DataService
  ) { }

  ngOnInit() {
    // this.shareId = this.route.snapshot.params.id;
    const data = {share_id: this.route.snapshot.params.shareid};
    if (this.route.snapshot.params.shareid) {
      this.photoEssayService.getSharedPhotoEssayImages(data).subscribe((res: any) => { ////console.log(res, "ress");
        this.shareId = res.essay.share_id;
        this.essay = res.essay;
         this._data.passData(this.shareId);
      });

    }
  }

}
