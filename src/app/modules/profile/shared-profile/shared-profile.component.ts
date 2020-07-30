import { Inject ,Optional} from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap'
import { LoaderService } from './../../../_services/loader.service'
import { DataService } from './../../../_services/data.service'
import { Meta, Title } from '@angular/platform-browser'
import { ActivatedRoute, Router, ParamMap } from '@angular/router'
import { ProfileService } from './../profile.service'
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-shared-profile',
  templateUrl: './shared-profile.component.html',
  styleUrls: ['./shared-profile.component.css']
})
export class SharedProfileComponent implements OnInit, AfterViewInit {
  activepopup: boolean = false
  id: any
  data: any = []
  addCritic: Boolean = false
  @ViewChild('tabs')
  private tabs: NgbTabset

  tabSelection: any;
   photoId$ = this.route.paramMap
  .pipe(
    map((params: ParamMap) => params.get('id'))
  );

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private profileService: ProfileService,
    private route: ActivatedRoute,
    private meta: Meta,
    private title: Title,
    private _data: DataService,
    private router: Router,
    private _loader: LoaderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this._loader.display()
    this.photoId$.subscribe(id => { 
      this.id = id;
    })

    this.getProfile()

  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      if (params.tab !== undefined) {
        this.cdr.detectChanges()
        this.tabs.activeId = ''
        this.tabs.select(params.tab)
      }
    })
  }

  getProfile() {
    this.id = this.route.snapshot.params['id']
    ////console.log(this.id, 'iddd') //Get order ID
    this.profileService.getProfile(this.id).subscribe(
      (res: any) => {
        this.data = res.uploadDetails
        this._loader.hide()
        ////console.log(this.data, 'sharedata')

        if (this.localStorage.getItem('currentUser')) {
          const authUserDetails = JSON.parse(this.localStorage.getItem('user'))
          this.addCritic =
            authUserDetails.id === this.data.user_id ? true : false
        }
        // this.meta.addTags([
        //   { property: 'og:description', content: this.data.story },
        //   { property: 'og:author', content: 'talkingdotnet' },
        //   { property: 'og:keywords', content: 'Angular, Meta Service' },
        //   { property: 'og:image', content: this.data.media}
        // ]);

        this.title.setTitle(this.data.title)
        this.meta.updateTag({
          property: 'og:description',
          content: this.data.story
        })
        this.meta.updateTag({ property: 'og:image', content: this.data.media })
        this.meta.updateTag({ property: 'og:title', content: this.data.title })
      },
      error => {}
    )
  }

  showProfile(username: any) {
    this.router.navigate( [ '@' + username])
  }

  upgradePlan() {
    this.router.navigate(['/subscription/plans'])
  }
}
