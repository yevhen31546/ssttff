import { DataService } from './../../../_services/data.service';
import { CollectionsService } from './../collections.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-share-collection',
  templateUrl: './share-collection.component.html',
  styleUrls: ['./share-collection.component.css']
})
export class ShareCollectionComponent implements OnInit {

  collectionId: any = '';
  collection: any = [];
  constructor(private route: ActivatedRoute,
  private _collectionService: CollectionsService,
  private _data: DataService) { }

  ngOnInit() {

    const data = {share_id: this.route.snapshot.params.collectionid};
    if (this.route.snapshot.params.collectionid) {
      this._collectionService.getSharedCollection(data).subscribe((res: any) => { ////console.log(res)
        this.collection = res.collection;
        this.collectionId = res.collection.share_id;
         this._data.passData(res.collection.share_id);
      });

    }
  }

}
