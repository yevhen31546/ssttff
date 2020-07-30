import { Title } from '@angular/platform-browser'
import { Component, OnInit } from '@angular/core'
import { ExploreMenuService } from '../explore-menu.service'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { CritiqueInfoComponent } from '../../../modals/critique-info/critique-info.component';

@Component({
  selector: 'app-explore-photos',
  templateUrl: './explore-photos.component.html',
  styleUrls: ['./explore-photos.component.scss']
})
export class ExplorePhotosComponent implements OnInit {
  currentPage: number = 1
  perPage: number = 12
  userPhotos: any
  selectType: string
  categoryType: string
  modalReference: any
  userDetails:any
  isLogin:boolean = false
  role:string = 'user'
  constructor(
    private exploreMenuService: ExploreMenuService,
    private title: Title,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.categoryType = 'featured'
    this.selectType = 'photos'
    this.title.setTitle('Explore Photos | Shoot The Frame')

  
    if (localStorage.getItem('currentUser')) {
      this.isLogin = true
      this.userDetails = JSON.parse(localStorage.getItem('user'))
      this.role = this.userDetails.role
    }
    // this.getExplorePhotos()
  }

  tabChange(event: any) {
    this.categoryType = event.nextId
  }

  openInfoModal() {
    this.modalReference = this.modalService.open(CritiqueInfoComponent, {
      windowClass: 'modal-md'
    })
  }

  // getExplorePhotos() {
  //   let data = {
  //     per_page: this.perPage,
  //     page: this.currentPage,
  //     type: 'new'
  //   }
  //   this.exploreMenuService.getPhotosData(data).subscribe(
  //     (response: any) => {
  //       this.userPhotos = this.userPhotos.concat(response.photos)
  //     },
  //     error => {}
  //   )
  // }
}
