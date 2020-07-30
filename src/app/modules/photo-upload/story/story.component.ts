import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit, Output, Input, EventEmitter, ElementRef , Inject,Optional} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { NgForm } from '@angular/forms'
import { LoaderService, MiscService } from '../../../_services'
import { PhotoUploadService } from '../photo-upload.service'
import { TitleCasePipe } from '@angular/common'

@Component({
  selector: 'app-story',
  templateUrl: './story.component.html',
  styleUrls: ['./story.component.css'],
  providers: [TitleCasePipe]
})
export class StoryComponent implements OnInit {
  storyDetails: any = {}
  private diffObj: any
  @Output()
  public active: EventEmitter<boolean> = new EventEmitter()
  @Input()
  imageDetails: any = []
  @Input()
  isEdit: boolean
  public deactivateGuard: EventEmitter<boolean> = new EventEmitter()

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private router: Router,
    private route: ActivatedRoute,
    private photoUploadSvc: PhotoUploadService,
    private loaderSvc: LoaderService,
    private miscSvc: MiscService,
    private pipe: TitleCasePipe,
    private element:ElementRef
  ) {}

  ngOnInit() {
     }

  ngAfterViewInit() {}

  photoDetailsSubsc() {}

  submitStory(f: NgForm) {
    if (
      f.invalid ||
      this.imageDetails.title === '' ||
      this.imageDetails.story === ''
    ) {
      return
    }
    this.loaderSvc.display()
    this.storyDetails.upload_id = this.imageDetails.id
    this.storyDetails.title = this.imageDetails.title
    this.storyDetails.story = this.imageDetails.story

    /**Local Storage */
    let getStorage = JSON.parse(this.localStorage.getItem('storage'))

    getStorage.title = this.imageDetails.title
    getStorage.story = this.imageDetails.story

    // push new task to array
    // insert updated array to local storage
    this.localStorage.setItem('storage', JSON.stringify(getStorage))
    /**Local Storage */

    if (!this.isEdit) {
      this.photoUploadSvc
        .updatePhotoDetails(this.storyDetails)
        .subscribe(res => {})
    }
    this.deactivateGuard.emit(false);
    this.loaderSvc.hide()
    this.active.emit(false)
  }

  trimTitle(term: string) {
    if (term === 'title') {
      this.imageDetails.title = this.imageDetails.title.trim()
      this.imageDetails.title = this.imageDetails.title
        ? this.imageDetails.title[0].toUpperCase() +
          this.imageDetails.title.slice(1)
        : ''
    } else {
      this.imageDetails.story = this.imageDetails.story.trim()
      this.imageDetails.story = this.imageDetails.story
        ? this.imageDetails.story[0].toUpperCase() +
          this.imageDetails.story.slice(1)
        : ''
    }
  }
}
