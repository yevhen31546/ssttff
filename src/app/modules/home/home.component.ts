import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Title } from '@angular/platform-browser';
import { ProfileService } from './../profile/profile.service'
import { Component, OnInit, ViewChild , Inject,Optional} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { Location } from '@angular/common';
import { HomeService } from './home.service';
import { InfoComponent } from '../shared/info/info.component';
import { NgbModal, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { StfModalComponent } from '../shared/stf-modal/stf-modal.component';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  authUserDetails: any
  @ViewChild('tabs')
  public tabs: NgbTabset ;

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, private profileService: ProfileService,
     private router: Router,
     private  titleService: Title,
     private location: Location,
     private acttivatedRoute: ActivatedRoute,
     private homeService: HomeService,
     private modalService: NgbModal,
     private userService:UserService
    ) {}
  expire: any = false
  success: any = false;
  banner: any;

  ngOnInit() {
 
   this.getRandomImage();
   this.titleService.setTitle('Shoot The Frame');
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
    }
  }

  redirectEntry() {
    if (!this.authUserDetails) {
      this.router.navigate(['/sign-up'])
    } else {
      this.router.navigate(['user/upload-photo'])
    }
  }

  tabChange(event: any) {
    //console.log(event.nextId)
    let url = `${event.nextId}`;  
     if(event.nextId == 'daily-feed') {
      this.location.go(url);
     } else {
        url  = event.nextId == '' ?  url : this.router.url;
      this.location.go(url);
     }
    }
  
    // getRandomImage() {

    //   let data = {
    //     page: 1,
    //     per_page: 100,
    //     year: '',
    //     month: '',
    //     category_id: ''
           
    //   }
      
    // this.homeService.getBannerData().subscribe(
    //   (response: any) => { 
    //     const entries = response.data;
           
    //     if(this.router.url == '/daily-feed') {
    //       this.tabs.select('daily-feed')
    //     }
    //     this.banner = entries[
    //       Math.floor(Math.random() * entries.length)
    //     ];
    // });
      
      
    // }

    getRandomImage() {

      let data = {
        page: 1,
        per_page: 100,
        year: '',
        month: '',
        category_id: ''
           
      }
      
    this.homeService.getRandomBannerData().subscribe(
      (response: any) => { 
        this.banner = response.data[0];
           
        if(this.router.url == '/daily-feed') {
          this.tabs.select('daily-feed')
        }
        //const entries;
         //this.banner=entries;
        // this.banner = entries[
        //   Math.floor(Math.random() * entries.length)
        // ];
    });
      
      
    }


  
    infoModal() {
      const modalRef = this.modalService.open(StfModalComponent)
    }

    getDate(data: any) {

      return moment(data).format('MMMM  YYYY');
    }

    showProfile(username: string) {
      this.router.navigate([`@${username}`])
    }
  
}
