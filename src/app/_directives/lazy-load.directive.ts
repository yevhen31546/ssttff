import { Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input
} from '@angular/core'

@Directive({
  selector: '[appLazyLoad]'
})
export class LazyLoadDirective implements AfterViewInit {
  @HostBinding('attr.src') srcAttr = null
  @Input() src: string

  constructor(@Inject(WINDOW) private window: Window, private el: ElementRef) {}

  ngAfterViewInit() {
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage()
  }

  private canLazyLoad() {
    return this.window && 'IntersectionObserver' in this.window
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadImage()
          obs.unobserve(this.el.nativeElement)
        }
      })
    })
    obs.observe(this.el.nativeElement)
  }

  private loadImage() {
    this.srcAttr = this.src
  }
}
