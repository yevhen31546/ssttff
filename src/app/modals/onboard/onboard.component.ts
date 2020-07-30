import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { Component, OnInit , Inject,Optional} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { Router } from '@angular/router'

@Component({
  selector: 'app-onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.css']
})
export class OnboardComponent implements OnInit {
  imageSlides: any = []
  currentElement: any
  currentCount: number
  userDetails: any

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, private modalService: NgbActiveModal, private router: Router) {}

  ngOnInit() {
    if (this.localStorage.getItem('currentUser')) {
      this.userDetails = JSON.parse(this.localStorage.getItem('currentUser'))
    }
    this.currentCount = 0

    this.imageSlides = [
      {
        image: 'assets/images/temp/onboard/Mahesh-Balasubramanian.jpg',
        name: 'Mahesh Balasubramanian',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'April',
        year: '2013',
        title: 'Welcome! Nice to have you.',
        description:
          '<p>This is a super quick tour to introduce you to the Shoot The Frame features as quickly as possible.</p><p>It will only take a minute.</p>'
      },
      {
        image: 'assets/images/temp/onboard/Max-Seigal2.jpg',
        name: 'Max Seigal',
        award: 'Shoot The Land',
        result: 'Finalist',
        month: 'October',
        year: '2013',
        status: '',
        title: 'Uploading your photos',
        description:
          '<p>The uploading process is simple and beautiful. We only want to see your best work, this is not a place to upload every photo you have ever taken. </p><p>We want you to showcase your best imagery, and tell us the story behind every shot.</p>'
      },
      {
        image:
          'assets/images/temp/onboard/Gemma_Smith_shoot_the_wild_shoot_the_frame_2.jpg',
        name: 'Gemma Smith',
        award: 'Shoot The Wild',
        result: 'Finalist',
        month: 'December',
        year: '2016',
        status: '',
        title: 'Shoot The Frame Awards',
        description:
          '<p>The monthly international STF Awards continue as they have since 2012. Every month we have the same three categories; portrait, landscape and wildlife.</p><p>You can submit a photo during the uploading process, or you can submit a photo which you uploaded previously.</p>Our partners provide the awesome prizes every month.<p></p>'
      },
      {
        image: 'assets/images/temp/onboard/Trevor_Cole_shoot_the_face_shoot_the_frame_6.jpg',
        name: 'Trevor Cole',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'October',
        year: '2017',
        status: '',
        title: 'Critiquing photos',
        description:
          '<p>We know photographers love feedback on their work. The critique photo feature allows you to give and recieve detailed feedback on photos. </p><p>This is the most powerful photo critiquing engine in the world, you can give your feedback on any photo in the community.</p><p>Remember to be nice, nobody likes a pest.</p>'
      },
      {
        image:
          'assets/images/temp/onboard/Wes-_Bruer_shoot_the_face_shoot_the_frame_2.jpg',
        name: 'Wes Bruer',
        award: 'Shoot The Land',
        result: 'Winner',
        month: 'January',
        year: '2017',
        status: '',
        title: 'Photo essays',
        description:
          '<p>Sometimes it takes more than one photo to tell a story, so we created photo essays.</p><p>Shoot The Frame allows you to add as many of your photos as you like to a photo essay.</p><p>Show us the whole story.</p>'
      },
      {
        image: 'assets/images/temp/onboard/Magnus-Brynestam-1.jpg',
        name: 'Magnus Brynestam',
        award: 'Shoot The Land',
        result: 'Winner',
        month: 'January',
        year: '2015',
        status: '',
        title: 'Insights',
        description:
          '<p>Insights allow you to underdstand the key metrics around your Shoot The Frame photos and profile.</p><p>Now you can see how much attention your photos are receiving in the community, and find out ways to increase your overall exposure as a photographer.</p>'
      },
      {
        image:
          'assets/images/temp/onboard/Danny_Lee_shoot_the_wild_shoot_the_frame_1.jpg',
        name: 'Danny Lee',
        award: 'Shoot The Wild',
        result: 'Winner',
        month: 'October',
        year: '2017',
        status: '',
        title: 'Messaging',
        description:
          '<p>Your can reach out to other members of the Shoot The Frame commnuity with message.</p><p>This is not a place for spam, this is a place to grow your network, and ask great questions.</p>'
      },
      {
        image: 'assets/images/temp/onboard/Sohail-Karmani.jpg',
        name: 'Sohail Karmani',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'July',
        year: '2015',
        status: '',
        title: 'Onward.',
        description:
          '<p>That’s it for now, there are plenty of other sweet features, but we think you will be able to find them by yourself.<p>If you have any trouble, please reach out we would love to help.</p><p>We can’t wait to see you work!</p>'
      }
    ]
    this.currentElement = this.imageSlides[this.currentCount]
  }

  nextElement() {
    this.currentCount++
    this.currentElement = this.imageSlides[this.currentCount]
  }

  previousElement() {
    this.currentCount--
    this.currentElement = this.imageSlides[this.currentCount]
  }

  closeModal() {
    location.replace('@' + this.userDetails.user.username)
    // this.router.navigate( [ '@' + this.userDetails.user.username])
    this.modalService.dismiss()
  }
}
