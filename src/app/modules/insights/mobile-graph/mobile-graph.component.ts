import { LoaderService } from './../../../_services/loader.service'
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from '@angular/core'
import * as _ from 'lodash'

@Component({
  selector: 'app-mobile-graph',
  templateUrl: './mobile-graph.component.html',
  styleUrls: ['./mobile-graph.component.css']
})
export class MobileGraphComponent implements OnInit, OnChanges {
  @Input() datasets: any = ''
  @Input() labels: Array<any> = []
  @Input() options: any = ''
  @Input() colors: any = ''
  @Input() legend: any = ''
  @Input() chartType: any = ''
  @Input() section: any = ''
  @Input() period: any = ''
  @Input() filterVal: any = ''
  @Input() max: number
  @Input() stepSize: number
  @Output('chartHover') chartHover = new EventEmitter()
  @Output('chartClick') chartClick = new EventEmitter()
  @Output('updateaxes') updateaxes = new EventEmitter()
  chartLabels: any = []
  min: number

  constructor(private loaderService: LoaderService) {}

  ngOnChanges(changes: any): void {
    this.setGraphLabels()
    //this.randomize()
    //if (this.max > 100) {
      this.max = this.max == 0 ? 5 : this.max
      this.options.scales.yAxes[0].ticks.max = this.max
      this.options.scales.yAxes[0].ticks.stepSize = this.stepSize
    //
  }

  ngOnInit() {
    this.loaderService.display()
    this.options = {
      responsive: false,
      tooltips: {
        enabled: true,
        intersect: false,
        mode: 'label',
        displayColors: false
      },
      scales: {
        yAxes: [
          {
            display: true,
            position: 'right',
            pointDot: true,
            gridLines: {
              display: true,
              drawBorder: false
            },
            beginAtZero: true,
            ticks: {
              padding: 70,
              autoSkip: false
            }
          }
        ],
        xAxes: [
          {
            id: 'x-axis-1',
            pointDot: true,
            beginAtZero: true,
            gridLines: {
              display: false
            },
            ticks: {
              padding: 70,
              autoSkip: false
            }
          }
        ]
      }
    }
    this.setGraphLabels()
    //this.randomize()
    if (this.max > 100) {
      this.options.scales.yAxes[0].ticks.max = this.max
      this.options.scales.yAxes[0].ticks.stepSize = this.stepSize
    } else {
      this.randomize()
    }
  }

  setGraphLabels() {
    this.chartLabels = []
    const chartNames = _.cloneDeep(this.labels)
    ////console.log(chartNames)
    if (this.labels) {
      chartNames.forEach(element => {
        const label = _.split(element, ',')
        this.chartLabels.push(label[0])
      })
      this.labels = this.chartLabels
    }

    this.loaderService.hide()
    this.updateaxes.emit(event)
  }

  chartHovered(event: Event) {
    this.chartHover.emit(event)
  }

  chartClicked(event: Event) {
    this.chartClick.emit(event)
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

    this.options.scales.yAxes[0].ticks.max = this.max
    this.options.scales.yAxes[0].ticks.min = this.min
    this.options.scales.yAxes[0].ticks.stepSize = this.stepSize
  }
}
