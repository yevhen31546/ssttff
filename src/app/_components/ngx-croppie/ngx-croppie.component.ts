import {
  Component,
  OnInit,
  SimpleChanges,
  Input,
  EventEmitter,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core'

import * as Croppie from 'croppie'
import { CroppieOptions, ResultOptions, CropData } from 'croppie'

export type Type = 'canvas' | 'base64' | 'html' | 'blob' | 'rawcanvas'

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'ngx-croppie',
  template: `
    <div #imageEdit (update)="newResult()"></div>
  `
})
export class NgxCroppieComponent implements OnInit {
  @ViewChild('imageEdit') imageEdit: ElementRef
  @Input() croppieOptions: CroppieOptions
  @Input() imageUrl: string
  @Input() points: number[]
  @Input() zoomLevel: number
  @Input() bind: (img: string) => void
  @Input() outputFormatOptions: ResultOptions = {
    type: 'blob',
    size: 'viewport'
  }
  @Output() result: EventEmitter<
    string | HTMLElement | Blob | HTMLCanvasElement
  > = new EventEmitter<string | HTMLElement | Blob | HTMLCanvasElement>()
  private _croppie: Croppie

  constructor() {}

  ngOnInit(): void {
    // https://github.com/Foliotek/Croppie/issues/470 :-( )
    this._croppie = new Croppie(
      this.imageEdit.nativeElement,
      this.croppieOptions
    )

    this._croppie.bind({
      url: this.imageUrl,
      points: this.points
    })
    this.bind = (img: string) => {
      this._croppie.bind({ url: this.imageUrl, points: this.points,zoom: this.zoomLevel })
      //this._croppie.setZoom(this.zoomLevel)
    }
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
  //   //Add '${implements OnChanges}' to the class.
  //   ////console.log(this.zoomLevel)

  //   this.bind = (img: string) => {
  //     this._croppie.bind({
  //       url: this.imageUrl,
  //       points: this.points,
  //       zoom: this.zoomLevel
  //     })
  //      this._croppie.setZoom(this.zoomLevel)
  //   }
  //   //console.log(this.zoomLevel)
  //   //console.log(this._croppie)
  // }
  newResult() {
    this._croppie.result(this.outputFormatOptions).then(res => {
      this.result.emit(res)
    })
  }

  rotate(degrees: 90 | 180 | 270 | -90 | -180 | -270) {
    this._croppie.rotate(degrees)
  }

  get(): CropData {
    return this._croppie.get()
  }
}
