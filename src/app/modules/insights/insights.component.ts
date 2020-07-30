import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { element } from 'protractor'
import { LoaderService } from './../../_services/loader.service'
import { Component, OnInit, Output, EventEmitter , Inject,Optional} from '@angular/core';
import { InsightsService } from './insights.service'
import { ProfileService } from '../profile/profile.service'
import { min } from 'rxjs/operators'
import * as _ from 'lodash'
import * as MobileDetect from 'mobile-detect'
import { Title } from '@angular/platform-browser'
import { InsightInfoComponent } from '../../modals/insight-info/insight-info.component'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { Chart, ChartDataSets, ChartOptions } from 'chart.js'
import * as pluginAnnotations from 'chartjs-plugin-annotation'

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.css']
})
export class InsightsComponent implements OnInit {
  insights: any
  authUserDetails: any
  checkSubscription: boolean = false
  filterVal: any = 'week'
  section: string = 'PHOTOS UPLOADED'
  period: string = 'Weekly'
  currentData: any = []
  currentSelectionVal: string = 'photo_upload'
  min: number
  max: number
  stepSize: number
  graph: any = []
  mobile: Boolean = false
  loaderEnable: boolean = true
  annotationsList: any = []
  fontColorList: any = []
  @Output('updateYAxesData') updateYAxesData = new EventEmitter()

  // lineChart
  public lineChartData: Array<any> = [
    {
      data: [],

      label: '',
      fill: false,
      lineTension: 0,
      pointRadius: 4,
      borderWidth: 1,
      autoskip: true,
      autoSkipPadding: 30
    }
  ]
  public lineChartLabels: Array<any> = []
  public lineChartOptions: ChartOptions & { annotation: any } = {
    responsive: true,
    aspectRatio: 1,
    maintainAspectRatio: false,
    hover: {
      mode: 'index',
      intersect: false
    },
    annotation: {
      events: ['mouseover'],
      annotations: this.annotationsList
    },

    tooltips: {
      enabled: true,
      intersect: false,
      mode: 'label',
      displayColors: false,
      backgroundColor: '#4c4c4c'
    },

    legend: {
      display: false
    },
    scales: {
      yAxes: [
        {
          display: true,
          position: 'right',
          pointDot: true,
          offset: true,

          gridLines: {
            display: true,
            drawBorder: false
          },
          beginAtZero: true,
          ticks: {
            padding: 10,
            autoSkip: false
          }
        }
      ],
      xAxes: [
        {
          id: 'x-axis-1',
          pointDot: true,
          beginAtZero: true,
          offset: true,
          fontSize: '9px',
          FontFamily: 'OpenSans',
          fontWeight: 'normal',
          gridLines: {
            display: false
          },
          ticks: {
            padding: 50,
            autoSkip: false,
            //  fontColor:  ['blue','red','red','red','red','red','red'],
            //  callback: function(tickValue, index, ticks) {
            //    ////console.log(tickValue, index, ticks)
            //     return tickValue;
            // }
            callback: function (tickValue, index, ticks, e) {
              const el = this
              if (index == 0 || index == ticks.length - 1) {
                tickValue = tickValue
              } else {
                tickValue = ''
              }
              return tickValue
            }
          }
        }
      ]
    }
  }
  public lineChartPlugins = [pluginAnnotations]

  public lineChartColors: Array<any> = [
    {
      backgroundColor: '',
      borderColor: '#42c299',
      pointBackgroundColor: '#42c299',
      pointBorderColor: '#42c299',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ]
  public lineChartLegend: Boolean = true
  public lineChartType: String = 'line'

  public mainchartHovered(e: any): void { }
  public chartClicked(e: any): void { }

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private insightsService: InsightsService,
    private profileService: ProfileService,
    private loaderServce: LoaderService,
    private titleService: Title,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Insights | Shoot The Frame')
    this.loaderServce.display()
    const md = new MobileDetect(this.window.navigator.userAgent)
    if (md.mobile()) {
      this.mobile = true
    }
    this.currentData = [65, 59, 80, 81, 56, 55, 40]
    if (this.localStorage.getItem('currentUser')) {
      this.authUserDetails = JSON.parse(this.localStorage.getItem('user'))
      this.getProfileData()
    }
    this.randomize()
    // this.getGraph();
    ////console.log(this.lineChartOptions, 'lineChartOptions')
  }

  addSection(value) {
    this.currentSelectionVal = value
    switch (value) {
      case 'exposure':
        this.section = 'EXPOSURE'
        break
      case 'photo_views':
        this.section = 'PHOTO VIEWS'
        break
      case 'profile_visits':
        this.section = 'PROFILE VISITS'
        break
      case 'critique_given':
        this.section = 'CRITIQUES GIVEN'
        break
      case 'critique_received':
        this.section = 'CRITIQUES RECEIVED'
        break
      case 'comments':
        this.section = 'COMMENTS'
        break
      case 'likes':
        this.section = 'LIKES'
        break
      case 'follows':
        this.section = 'FOLLOWS'
        break
      default:
        this.section = 'PHOTOS UPLOADED'
    }
    this.randomize()
  }

  public randomize() {
    switch (this.filterVal) {
      case 'year':
        this.period = 'Yearly'
        this.max = 2500
        this.min = 0
        this.stepSize = 500
        break
      case 'month':
        this.period = 'Monthly'
        this.max = 500
        this.min = 0
        this.stepSize = 100
        break
      default:
        this.period = 'Weekly'
        this.max = 100
        this.min = 0
        this.stepSize = 20
    }

    this.lineChartOptions.scales.yAxes[0].ticks.max = this.max
    this.lineChartOptions.scales.yAxes[0].ticks.min = this.min
    this.lineChartOptions.scales.yAxes[0].ticks.stepSize = this.stepSize
    this.getGraph()
  }

  // events

  getProfileData() {
    let data = {
      user_id: this.authUserDetails.id,
      username: this.authUserDetails.username
    }
    this.profileService.getProfileData(data).subscribe((response: any) => {
      //////console.log(response)
      if (response.user.subscription_plan == 1) {
        this.checkSubscription = false
      } else {
        this.checkSubscription = true

      }
      this.getInsightsData()
      this.loaderEnable = false
      this.loaderServce.hide()
    })
  }

  getInsightsData() {
    let data = { filter: this.filterVal, type: this.currentSelectionVal }
    this.insightsService.getInsights(data).subscribe((response: any) => {
      this.insights = response.insights
    })
  }

  selectFilter() {
    this.getInsightsData()
    this.randomize()
  }

  getGraph() {
    const data = { filter: this.filterVal, type: this.currentSelectionVal }
    this.insightsService.getInsightsGraph(data).subscribe((response: any) => {
      if (response.insights.length != 0) {
        this.graph = response.insights
        this.lineChartData[0].data = response.insights.values
        this.lineChartLabels = response.insights.dates
        // this.lineChartLabels = response.insights.dates; ////console.log(response.insights.dates);
        this.max = _.max(response.insights.values)

        // if (this.period == 'Weekly') {
        //   if (this.max > 100) {
        //     if (this.max > 500) {
        //       this.lineChartOptions.scales.yAxes[0].ticks.stepSize = 100
        //     }
        //   }
        // }

        this.max = this.getGraphRange(response.insights.values)
        this.max = this.max == 0 ? 5 : this.max
        this.stepSize = this.max / 5
        this.lineChartOptions.scales.yAxes[0].ticks.max = this.max
        this.lineChartOptions.scales.yAxes[0].ticks.stepSize = this.stepSize
        // this.lineChartOptions.scales.yAxes[0].ticks.padding = this.mobile
        //   ? 20
        //   : 70
        // this.lineChartOptions.scales.xAxes[0].ticks.padding = this.mobile
        //   ? 20
        //   : 70

        this.lineChartLabels.map((x, index) => {
          // this.annotationsList.push({
          //   type: 'line',
          //   mode: 'vertical',
          //   scaleID: 'x-axis-1',
          //   id: 'index' + index,
          //   value: x,
          //   borderColor: 'transparent',
          //   borderWidth: 10,
          //   borderDash: [2, 2],
          //   onMouseover: function(e) {
          //     const element = this
          //     element.options.borderWidth = 3
          //     element.options.borderColor = '#bfb9b9'
          //     element.chartInstance.update()
          //   },
          //   onMouseout: function(e) {
          //     const element = this
          //     element.options.borderWidth = 10
          //     element.options.borderColor = 'transparent'
          //     element.chartInstance.update()
          //   }
          // })
          if (index == 0) {
            // this.lineChartOptions.scales.xAxes[0].ticks.fontColor.push('blue');
            this.fontColorList.push('black')
          } else {
            this.fontColorList.push('white')
            // this.lineChartOptions.scales.xAxes[0].ticks.fontColor.push('white');
          }
        })

        // this.lineChartData[0].labels = response.insights.dates;

        let lbs = _.cloneDeep(response.insights.dates)
        if (lbs) {
          lbs = lbs.map((val, key) => {
            if (key === 0 || key === lbs.length - 1) {
              return val
            } else {
              return ''
              // return '\u2022';
            }
          })
        }

        //   this.lineChartLabels = lbs;
      }
    })
  }

  getGraphRange(data) {
    var max = Math.max.apply(null, data)
    var min = Math.min.apply(null, data)
    var maxDigits = max.toString().length
    var minDigits = min.toString().length
    var maxD = Math.pow(5, Math.max(maxDigits - 1, 1))
    var minD = Math.pow(10, Math.max(minDigits - 1, 1))
    var maxR = Math.ceil(max / maxD) * maxD
    var minR = Math.floor(min / minD) * minD
    return maxR
  }

  infoModal(type) {
    const modalRef = this.modalService.open(InsightInfoComponent)
    modalRef.componentInstance.type = type
  }
}
