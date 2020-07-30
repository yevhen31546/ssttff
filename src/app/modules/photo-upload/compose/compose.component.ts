import { Component, OnInit, OnDestroy, ElementRef ,Optional} from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { PhotoUploadService } from '../photo-upload.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
  selector: 'app-compose',
  templateUrl: './compose.component.html',
  styleUrls: ['./compose.component.css']
})
export class ComposeComponent implements OnInit, OnDestroy {
  detailsactive: boolean = false
  categoryactive: boolean = false
  awardsactive: boolean = false
  deletealert: ElementRef

  tabs = []
  curPath = ''
  subjectImg: string
  publishData: boolean = false;
  detailsCompleted: boolean = false;
  catCompleted: boolean = false;
  storyCompleted: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private photoUploadSvc: PhotoUploadService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.route.url.subscribe(url => {
      const routeFragments: Array<string> = this.router.url.split('/')
      this.curPath = routeFragments[routeFragments.length - 1]
    })
    // const subjectId = this.route.snapshot.paramMap.get('subjectId')
    // this.photoUploadSvc.getPhotoDetails(subjectId).subscribe(uploadDetails => {
    //   this.subjectImg = uploadDetails.media;
    //   /**Tab handling */
    //   if (uploadDetails.title != '' && uploadDetails.story != '') {
    //     this.detailsactive = true;
    //     this.storyCompleted = true;
    //   }
    //   if (uploadDetails.tags.length > 0 && this.detailsactive == true) {
    //     this.categoryactive = true;
    //     this.detailsCompleted = true;
    //   }
    //   if (
    //     uploadDetails.category_id != null &&
    //     uploadDetails.photo_essay != null &&
    //     this.detailsactive == true &&
    //     this.categoryactive == true
    //   ) {
    //     this.awardsactive = true;
    //     this.catCompleted = true;
    //   }
    //   this.tabs = [
    //     { title: 'the story', navUrl: 'story', isActive: true, completed:  this.storyCompleted },
    //     { title: 'details', navUrl: 'details', isActive: this.detailsactive, completed:  this.detailsCompleted  },
    //     {
    //       title: 'category',
    //       navUrl: 'category',
    //       isActive: this.categoryactive, completed: this.catCompleted
    //     },
    //     { title: 'stf awards', navUrl: 'awards', isActive: this.awardsactive }
    //   ]
    //   /**Tab handling */
    //   this.photoUploadSvc.photoDetails$.next(uploadDetails)
    // })
  }

  ngOnDestroy() {
    let routChange = this.router.url.split('/')
    this.route.url.subscribe(url => {
      if (routChange[3] != 'compose') {
        this.open(this.deletealert)
      }
    })
    // if (routChange[3] != 'compose') {
    //   this.open(this.deletealert)
    // }
  }

  goToSection(tabIndex: number) {
    if (this.tabs[tabIndex].isActive == true) {
      const navUrl = this.tabs[tabIndex].navUrl
      this.router.navigate([navUrl], { relativeTo: this.route })
    }
  }

  open(content) {
    this.modalService.open(content).result.then(
      result => {
        //this.isEmailUpdate = true
      },
      reason => {
        // this.isEmailUpdate = false
        // this.profileForm.patchValue({ email: this.currentEmail })
        //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`
      }
    )
  }

  actionPublish = function(author) {
    //alert('sss')
  }
}
