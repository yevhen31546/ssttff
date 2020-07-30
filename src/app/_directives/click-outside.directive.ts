import {
  Directive,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  ElementRef,
  HostListener
} from '@angular/core'

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  constructor(private _elementRef: ElementRef) {}

  @Output('clickOutside') clickOutside: EventEmitter<any> = new EventEmitter()

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {

        this.clickOutside.emit(null);
    }
  }
  onMouseEnter(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement)
    if (!clickedInside) {
      this.clickOutside.emit(null)
    }
  }
}
