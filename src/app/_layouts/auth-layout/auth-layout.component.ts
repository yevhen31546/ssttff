import { Component, OnInit, HostListener } from '@angular/core'
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent implements OnInit {
  imageSlides: any = []
  img: any;
  selectedItem: string = '';
  isFocused: boolean = false;
  search: any = '';



  constructor(private router: Router,
    ) {}


  onClickOutside(event) {
    this.selectedItem = ''
  }

  @HostListener('click', ['$event'])
  clickout(event) {
    this.selectedItem = ''
  }

  clickedInside($event: Event, activeIcon) {
    $event.preventDefault()
    $event.stopPropagation() // <- that will stop propagation on lower layers
    if (this.selectedItem != activeIcon) {
      this.selectedItem = activeIcon
    } else {
      this.selectedItem = ''
    }
  }

  ngOnInit() {
    this.imageSlides = [
      {
        image: 'assets/images/temp/login/Trevor.jpg',
        name: 'Trevor Cole',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'October',
        year: '2017',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Chieh-Ju-Chao.jpg',
        name: 'Chieh -Ju Chao',
        award: 'Shoot The Wild',
        result: 'Winner',
        month: 'October',
        year: '2017',
        status: ''
      },
      {
        image:
          'assets/images/temp/login/Danny_Lee_shoot_the_wild_shoot_the_frame_1.jpg',
        name: 'Danny Lee',
        award: 'Shoot The Wild',
        result: 'Winner',
        month: 'October',
        year: '2017',
        status: ''
      },
      {
        image:
          'assets/images/temp/login/Gabriel_Ceballos_shoot_the_face_shoot_the_frame_7.jpg',
        name: 'Gabriel Cevallos',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'April',
        year: '2017',
        status: ''
      },
      {
        image:
          'assets/images/temp/login/Gemma_Smith_shoot_the_wild_shoot_the_frame_2.jpg',
        name: 'Gemma Smith',
        award: 'Shoot The Wild',
        result: 'Finalist',
        month: 'December',
        year: '2016',
        status: ''
      },
      {
        image:
          'assets/images/temp/login/Ian_Pettigrew_shoot_the_face_shoot_the_frame_1.jpg',
        name: 'Ian Pettigrew',
        award: 'Shoot The Face',
        result: 'Finalist',
        month: 'August',
        year: '2016',
        status: ''
      },
      {
        image:
          'assets/images/temp/login/Jackie_Tran_shoot_the_land_shoot_the_frame_1.jpg',
        name: 'Jackie Tran',
        award: 'Shoot The Land',
        result: 'Winner',
        month: 'May',
        year: '2016',
        status: ''
      },
      {
        image:
          'assets/images/temp/login/Jennifer-Rose_Keany_shoot_the_wild_shoot_the_frame_1.jpg',
        name: 'Jennifer-Rose Keany',
        award: 'Shoot The Wild',
        result: 'Finalist',
        month: 'August',
        year: '2016',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Jeremy-Fratkin.jpg',
        name: 'Jeremy Fratkin',
        award: 'Shoot The Wild',
        result: 'Winner',
        month: 'December',
        year: '2014',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Lucy-Maratkanova.jpg',
        name: 'Lucy Maratkanova',
        award: 'Shoot The Face',
        result: 'Finalist',
        month: 'April',
        year: '2015',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Magnus-Brynestam-1.jpg',
        name: 'Magnus Brynestam',
        award: 'Shoot The Land',
        result: 'Winner',
        month: 'January',
        year: '2015',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Mahesh-Balasubramanian.jpg',
        name: 'Mahesh Balasubramanian',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'April',
        year: '2013',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Marco-Ferraris.jpg',
        name: 'Marco Ferraris',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'May',
        year: '2014',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Max-Seigal2.jpg',
        name: 'Max Seigal',
        award: 'Shoot The Land',
        result: 'Finalist',
        month: 'October',
        year: '2013',
        status: ''
      },
      {
        image:
          'assets/images/temp/login/Nobuhiro_Ishida_shoot_the_face_shoot_the_frame_1.jpg',
        name: 'Nobuhiro Ishida',
        award: 'Shoot The Face',
        result: 'Finalist',
        month: 'March',
        year: '2018',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Sami-Rahkonen.jpg',
        name: 'Sami Rahkonen',
        award: 'Shoot The Wild',
        result: 'Finalist',
        month: 'February',
        year: '2015',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Slavina-Bahchevanova.jpg',
        name: 'Slavina Bahchevanova',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'February',
        year: '2015',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Sohail-Karmani.jpg',
        name: 'Sohail Karmani',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'July',
        year: '2015',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Syaza-Mohd-Shakharulain.jpg',
        name: 'Syaza Mohd Shakharulain',
        award: 'Shoot The Face',
        result: 'Finalist',
        month: 'October',
        year: '2012',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Tom-Cuccio_April-14-Winner-STL.jpg',
        name: 'Tom Cuccio',
        award: 'Shoot The Land',
        result: 'Winner',
        month: 'April',
        year: '2014',
        status: ''
      },
      {
        image: 'assets/images/temp/login/Wahyu-Adi-Fitrianto.jpg',
        name: 'Wahyu Adi Fitrianto',
        award: 'Shoot The Face',
        result: 'Winner',
        month: 'March',
        year: '2016',
        status: ''
      }
    ]
    this.img = this.imageSlides[
      Math.floor(Math.random() * this.imageSlides.length)
    ]
    ////console.log(this.img)
  }

  addFocus() {
    this.isFocused = true
  }

  // showActive(activeIcon) {
  //   if (this.selectedItem != activeIcon) {
  //     this.selectedItem = activeIcon
  //   } else {
  //     this.selectedItem = ''
  //   }
  // }

  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.router.navigate([`search/${this.search}`]);
    }
  }
}
