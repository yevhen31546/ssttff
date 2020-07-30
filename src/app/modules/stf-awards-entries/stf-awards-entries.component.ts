import { WINDOW } from '@ng-toolkit/universal';
import { Title } from '@angular/platform-browser';
import { DataService } from './../../_services/data.service'
import { UserService } from './../user/user.service'
import { StripeUpdateService } from './../../_services/stripeUpdate.service'
import { StfAwardEntriesService } from './stf-award-entries.service'
import { LoaderService } from './../../_services/loader.service'
import { Component, OnInit, AfterViewInit, Input , Inject} from '@angular/core';
import { PhotoUploadService } from '../photo-upload/photo-upload.service'
import { StripeCheckoutLoader, StripeCheckoutHandler } from 'ng-stripe-checkout'
import { AlertService } from './../../_services/alert.service'
import { environment } from './../../../environments/environment.prod'
import * as MobileDetect from 'mobile-detect'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StfModalComponent } from '../shared/stf-modal/stf-modal.component';

@Component({
  selector: 'app-stf-awards-entries',
  templateUrl: './stf-awards-entries.component.html',
  styleUrls: ['./stf-awards-entries.component.css']
})
export class StfAwardsEntriesComponent implements OnInit, AfterViewInit {
  private stripeCheckoutHandler: StripeCheckoutHandler

  award_entries: any = []
  month: any = []
  year: any = []
  categories: any = []
  paramYear: any = ''
  paramMonth: any = ''
  paramCategories: any = ''
  selectedYear: any = ''
  selectedCategory: any = ''
  selectedMonth: any = ''
  currentPage = 1
  identifyType = 'own-award-entries'
  expire: Boolean = false
  cardDetails: any = []
  success: Boolean = false
  labelOption: string = 'All'
  showYear: any = false
  showMonth: Boolean = false
  showCategory: Boolean = false
  winnerListTab: number = 0

  constructor(@Inject(WINDOW) private window: Window, 
    private awardService: StfAwardEntriesService,
    private photoUploadSvc: PhotoUploadService,
    private loaderService: LoaderService,
    private stripeUpdateSrv: StripeUpdateService,
    private stripeCheckoutLoader: StripeCheckoutLoader,
    private loaderservice: LoaderService,
    private alertService: AlertService,
    private userservice: UserService,
    private dataServices: DataService,
    private title: Title,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.selectedYear = ''
      this.selectedCategory = ''
      this.selectedMonth = ''
    } else {
      this.selectedYear = 'Year'
      this.selectedCategory = 'Category'
      this.selectedMonth = 'Month'
    }
    this.cardDetail()
    this.getMonthDetails()
    this.getYearDetails()
    this.getCategory()
    ////console.log(this.month)
    var d = new Date()
    // this.selectedYear = d.getFullYear()
    // this.selectedMonth = d.getMonth() + 1

    this.stripeUpdateSrv.getStripe().subscribe(message => {
      this.updateCard()
    })
    this.filterEntries();
    this.title.setTitle('STF Awards Entries | Shoot The Frame');
  }

  public ngAfterViewInit() {
    this.stripeCheckoutLoader
      .createHandler({
        key: environment.STRIPE_PUBLISH_KEY,
        token: token => {
          const data = token
          //  ////console.log('profile token!', data);
        }
      })
      .then((handler: StripeCheckoutHandler) => {
        this.stripeCheckoutHandler = handler
      })
  }

  getWinners(curval) {
    this.winnerListTab = curval == 0 ? 1 : 0
    this.filterEntries()
  }

  filterEntries() {
    this.award_entries = []
    this.paramYear = this.selectedYear === 'Year' ? '' : this.selectedYear
    this.paramMonth =
      this.selectedMonth === 'Month' || this.selectedMonth === '0'
        ? ''
        : this.selectedMonth
    this.paramCategories =
      this.selectedCategory === 'Category' ? '' : this.selectedCategory
    //this.getAwardEntries()
    let params = {
      year: this.paramYear,
      month: this.paramMonth,
      category: this.paramCategories,
      type: this.identifyType,
      winnerListTab: this.winnerListTab
    }
    this.dataServices.passData(params)
  }

  change() {
    // this.selectedYear = ''
    // this.showYear = false
  }

  monthChange() {
    // this.selectedMonth = ''
    // this.showMonth = false
  }

  catChange() {
    // this.selectedCategory = ''
    // this.showCategory = false
  }
  getMonthDetails() {
    this.month[0] = 'Month'
    this.month[1] = 'January'
    this.month[2] = 'February'
    this.month[3] = 'March'
    this.month[4] = 'April'
    this.month[5] = 'May'
    this.month[6] = 'June'
    this.month[7] = 'July'
    this.month[8] = 'August'
    this.month[9] = 'September'
    this.month[10] = 'October'
    this.month[11] = 'November'
    this.month[12] = 'December'
  }

  getYearDetails() {
    var currentYear = new Date().getFullYear(),
      years = []
    let startYear = 2012
    while (startYear <= currentYear) {
      years.push(startYear++)
    }
    this.year = years
  }

  getCategory() {
    this.photoUploadSvc.getStfCategories().subscribe((res: any) => {
      this.categories = res.categories
      ////console.log(this.categories)
    })
  }

  updateCard() {
    const image = 'assets/images/temp/stripe-logo.jpg'
    this.stripeCheckoutHandler
      .open({
        panelLabel: 'Update Card Details',
        label: 'Update Card Details',
        name: 'Shoot the Frame',
        image: image,
        allowRememberMe: false
      })
      .then((token: any) => {
        const data: any = token
        data.stripeToken = token.id
        data.stripeEmail = token.email
        data.cardId = token.card.id
        //this.loaderservice.display()
        this.photoUploadSvc.updateCard(data).subscribe(
          res => {
            this.expire = false
            this.success = true
            this.cardDetails = res.card
            this.alertService.success(res.title, res.message)
            this.loaderservice.hide()
          },
          (error: any) => {
            this.loaderservice.hide()
            this.alertService.error(error.title, error.message)
          }
        )
      })
      .catch(err => {
        // Payment failed or was canceled by user...
        if (err !== 'stripe_closed') {
          throw err
        }
      })
  }

  cardDetail() {
    this.userservice.getCardDetails().subscribe(
      (res: any) => {
        ////console.log(res, 'carddetail')
        const isExpiry = res.expires
        if (isExpiry === 0) {
          this.expire = false
        } else if (isExpiry === 1) {
          this.expire = true
          this.alertService.info('Payment card expiring soon', 'updateCard')
        } else {
          this.expire = true
          this.alertService.error('Payment card expired', 'updateCard')
        }
        this.cardDetails = res.card
        // this.loaderservice.hide()
      },
      (error: any) => {
        // this.loaderservice.hide()
      }
    )
  }

  appendItems($event) {}

  getshowYear() {
    this.showYear = this.selectedYear == '0' ? 'Year' : 'All'
    ////console.log(this.showYear, this.selectedYear)
    return this.showYear
  }

  stfModal() {
    const modalRef = this.modalService.open(StfModalComponent)
  }

}
