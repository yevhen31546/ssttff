import { Inject } from '@angular/core';
import { WINDOW } from '@ng-toolkit/universal';
import { environment } from './../../../../environments/environment'
import { DataService } from './../../../_services/data.service'
import { ProfileService } from './../../profile/profile.service'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { AlertService } from './../../../_services/alert.service'
import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  NgZone,
  ViewChild,
  ElementRef
} from '@angular/core'
import { Meta, Title, ɵgetDOM } from '@angular/platform-browser'
// import { DomAdapter, getDOM } from '@angular/platform-browser/src/dom/dom_adapter';

@Component({
  selector: 'app-share-modal',
  templateUrl: './share-modal.component.html',
  styleUrls: ['./share-modal.component.css'],
  providers: [AlertService]
})
export class ShareModalComponent implements OnInit {
  @Input() imgDetails
  @Input() item
  @Input() i
  @Input() type
  content: any = ''
  text = 'shoot the frame'
  url = environment.CURRENT_URL
  criticUrl = environment.CRITIC_URL
  domainUrl = environment.DOMAIN_URL
  shareText: any = ''
  showText: any = 'photo'

  showBtns = false
  @ViewChild('shareContent') shareContent: ElementRef

  constructor(@Inject(WINDOW) private window: Window, 
    private _alertService: AlertService,
    private activeModal: NgbActiveModal,
    private meta: Meta,
    private title: Title,
    private profileService: ProfileService,
    private _data: DataService,
    private zone: NgZone
  ) {
    //  ɵgetDOM().setTitle(this.text);
    //  this.title.setTitle(this.text)
  }

  ngOnInit() {
    const media = this.item.media
    if (this.type === 'critic') {
      this.url = this.criticUrl + this.item.share_id
      this.shareText = 'critiques/photo/' + this.item.share_id
    }
    if (this.type === 'photo') {
      this.shareText = 'photo/' + this.item.share_id
      this.url = this.url + 'photo/' + this.item.share_id
      this.showText = 'photo'
    }
    if (this.type === 'photo_essay') {
      this.shareText = 'photo-essay/share/' + this.item.share_id
      this.url = this.url + this.shareText
      this.showText = 'photo essay'
    }
    if (this.type === 'collection') {
      this.shareText = 'collection/share/' + this.item.share_id
      this.url = this.url + this.shareText
      this.showText = 'collection'
    }

    this.content = environment.DOMAIN_URL + this.shareText
    this._data.shareData(this.item.id)
    this.title.setTitle(this.item.title)
    this.meta.updateTag({
      property: 'og:description',
      content: this.item.story
    })
    this.meta.updateTag({ property: 'og:image', content: media })
    this.meta.updateTag({ property: 'og:url', content: this.url })
    this.meta.updateTag({ property: 'og:title', content: this.item.title })

    this.window['FB'] && this.window['FB'].XFBML.parse()
    this.window['twttr'] && this.window['twttr'].widgets.load()
  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.

  }

  onCopySuccess(el) {
    let input = this.shareContent.nativeElement

    let isiOSDevice = navigator.userAgent.match(/ipad|iphone/i)

    if (isiOSDevice) {
      const editable = input.contentEditable
      const readOnly = input.readOnly

      input.contentEditable = true
      input.readOnly = false

      const range = document.createRange()
      range.selectNodeContents(input)

      const selection = this.window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)

      input.setSelectionRange(0, 999999)
      input.contentEditable = editable
      input.readOnly = readOnly
    } else {
      input.select()
    }

    document.execCommand('copy')

    this._alertService.success('Link copied.', 'You can paste it anywhere.')
  }

  onCopyFailure() {
    this._alertService.warning(
      'Link not copied.',
      'Please highlight the link and copy using keyboard.'
    )
  }

  closeModal() {
    this.activeModal.close()
  }
}
