import { Inject } from '@angular/core';
import { LOCAL_STORAGE } from '@ng-toolkit/universal';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { AlertService } from './../../../_services/alert.service'
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms'
import { ProfileService } from './../profile.service'
import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  ElementRef,
  OnChanges,Optional
} from '@angular/core'
import * as moment from 'moment'
import * as _ from 'lodash'
import { EmojiData } from '@ctrl/ngx-emoji-mart/ngx-emoji/public_api'
import { trigger, state, style, animate, transition } from '@angular/animations'

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],

  animations: [
    trigger('popOverState', [
      state(
        'show',
        style({
          opacity: 1
        })
      ),
      state(
        'hide',
        style({
          opacity: 0
        })
      ),
      transition('show=>hide', animate('600ms ease-out')),
      transition('hide=>show', animate('1000ms ease-in'))
    ])
  ]
})
export class CommentsComponent implements OnInit, OnChanges {
  modalRef: NgbModalRef
  @Input() imgDetails: any
  perPage = 10
  comments: any = []
  isloggedIn: Boolean = false
  active = false
  commentForm: NgForm
  data: any
  userList: any = []
  userNames: any = []
  emojiValue: any = ''
  showPaginationLoader: boolean = false
  mentionItems: Array<any> = [
    {
      items: [],
      labelKey: 'username',
      triggerChar: '@'
      // selectMention: this.format
      // mentionSelect: this.format
    }
  ]
  html: any
  @ViewChild('contentDelete')
  contentDelete;
  @ViewChild('emojiContent') emojiContent;
  @ViewChild('textareaHeight') textareaHeight: ElementRef;

  user: any = ''
  commentValue: any = ''
  comment: any = ''
  show = false
  emojiItem: any = ''
  onComment: any
  commentVal: String = '';
  submit: Boolean = false;
  focusInBox: Boolean = false;

  constructor(@Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private _profileService: ProfileService,
    private _alertService: AlertService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.commentValue = ''

    this.listComments()
    if (this.localStorage.getItem('currentUser')) {
      this.user = JSON.parse(this.localStorage.getItem('user'))
      this.isloggedIn = true
    }
  }

  ngOnChanges(): void {
    this.listComments()
  }

  smiley() {
    this.show = !this.show
  }

  get stateName() {
    return this.show ? 'show' : 'hide'
  }

  listComments() {
    this.showPaginationLoader = true
    const data = {
      per_page: this.perPage,
      upload_id: this.imgDetails.id
    }
    this._profileService.getComments(data).subscribe((res: any) => {
      ////console.log(res)
      this.comments = res.comments;
      this.comments.forEach(element => {
        this.getComment(element, element.comment, element.mention_list)
      })
      this.showPaginationLoader = false
    })
  }

  getDate(commentDate: any) {
    const today = new Date()
    const b = moment(commentDate),
      a = moment(today)
    const intervals: any = ['years', 'months', 'weeks', 'days']
    for (let i = 0; i < intervals.length; i++) {
      const diff = a.diff(b, intervals[i])
      b.add(diff, intervals[i])

      if (intervals[0] && diff) {
        intervals[i] = diff === 1 ? 'year' : 'years'
        return diff + ' ' + intervals[i]
      }
      if (intervals[1] && diff) {
        intervals[i] = diff === 1 ? 'month' : 'months'

        return diff + ' ' + intervals[i]
      }
      if (intervals[2] && diff) {
        intervals[i] = diff === 1 ? 'week' : 'weeks'

        return diff + ' ' + intervals[i]
      }
      if (intervals[3] && diff) {
        intervals[i] = diff === 1 ? 'day' : 'days'

        return diff + ' ' + intervals[i]
      }
    }
  }

  onSubmitComment(form: NgForm) {
    this.submit = true;
    this.data = {
      upload_id: this.imgDetails.id,
      comment: this.commentValue,
      users_list: JSON.stringify(this.userList)
    }
    this._profileService.addComment(this.data).subscribe(res => {
      ////console.log(res)
      this.listComments();
      this.submit = false;
      this.comment = ''
      this.commentValue = ''
      document.getElementById('comment').style.height = '0px'
    })
  }

  isText(event: any) {
    
    this.onComment = true
    const text = event
    this.comment = text
    this.commentValue = text
    if (this.commentValue.indexOf('@') !== -1) {
      this.userNames.forEach(element => {
        if (this.commentValue.indexOf('@' + element) !== -1 && this.commentValue.indexOf('<span class="mention-span">@' +
        element +
        '</span>') == -1) {
          this.commentValue = _.replace(
            this.commentValue,
            new RegExp('@' + element, 'g'),
            '<span class="mention-span">@' +
              element +
              '</span>'
          );
        }
      })
    }

    this.commentValue = this.commentValue.replace('<br/>', '\r')
    this.commentValue = this.commentValue.replace('<br/>', '\n')

    let test = this.commentValue;

    test = test.replace(/\n/g, '<br />&shy;')
    test = test.replace(/ {2}/g, ' &nbsp;') + '&shy;'

    this.commentValue = test;
    // this.sanitizer.bypassSecurityTrustUrl(this.commentValue);

    ////console.log(this.commentValue)

    if (text) {
      this.active = true;
     // this.focusInBox = true;
    } else {
      this.active = false;
      //this.focusInBox = false;
    }
  }

  selectedTerm(term: any) { ////console.log(term);
    this.onComment = false;
    this.userList.push(term.id);
    this.userNames.push(term.username);
    const lastIndex = this.comment.lastIndexOf(' ');
    this.comment = this.comment.substring(0, lastIndex); ////console.log(this.comment);
    setTimeout(function() {
      this.commentVal = this.comment + ' ';
    }.bind(this), 200);
  }

  searchUser(event: any) {
    ////console.log(event)
    this._profileService.getPeople(event).subscribe((res: any) => {
      this.mentionItems[0].items = res.users;
      ////console.log(res, 'userss', this.mentionItems)

    })
  }

  format(item) {
    ////console.log(item)
    return '<strong>@' + item.username + '</strong>'
  }

  getComment(comment: any, content: any, users: any) {
    users.forEach(element => {
      ////console.log(element)
      if (content.indexOf('@' + element) !== -1) {
        content = _.replace(
          content,
          new RegExp('@' + element, 'g'),
          "<a class='text-black' href='/@" +
            element +
            "'><b>@" +
            element +
            '</b></a>'
        )
      }
    })
    comment.comment = content
  }

  deleteComment(id: any) {
    const promise = new Promise((resolve, reject) => {
      this.modalRef = this.modalService.open(this.contentDelete)
      this.modalRef.result.then(
        result => {
          this._profileService.deleteComment(id).subscribe(
            res => {
              this._alertService.success(res.title, res.message)
              this.listComments()
            },
            error => {
              this._alertService.error(error.title, error.message);
            }
          )
          resolve(true)
        },
        reason => {
          resolve(false)
        }
      )
    })
  }

  public addEmoji(event: { $event: MouseEvent; emoji: EmojiData }) {
    ////console.log(this.emojiContent, event.emoji)
    let emoticonElement = <HTMLElement>event.$event.target;
    if (
      !emoticonElement.style.backgroundImage ||
      emoticonElement.style.backgroundImage === ''
    ) {
      emoticonElement = <HTMLElement>emoticonElement.firstChild;
    }

    // (HTMLInputElement).value += event.emoji.native
    ////console.log(emoticonElement.outerHTML, emoticonElement)

    //  this.emojiItem = event.emoji;
    //  this.comment = this.comment + emoticonElement.outerHTML;
    this.comment = this.comment + event.emoji.native;
    this.commentValue = this.commentValue + event.emoji.native;
    this.show = false;
  }

  showProfile(name: any) {
    this.modalService.dismissAll()
    this.router.navigate( [ '@' + name]);
  }

  login() {
    this.modalService.dismissAll()
    this.router.navigate(['sign-in'], {
      queryParams: { id: this.imgDetails.share_id }
    })
  }

  autosize(event: Event) {
   
    // this.textareaHeight.nativeElement.style.height = this.textareaHeight.nativeElement.scrollHeight + 'px';
    this.textareaHeight.nativeElement.style.overflow = 'hidden';
    this.textareaHeight.nativeElement.style.height = 'auto';
    this.textareaHeight.nativeElement.style.height =
    this.textareaHeight.nativeElement.scrollHeight + 'px';
  }

  timeSince(timeStamp) {
    return moment(timeStamp+' Z').fromNow()
  }

  inFocus(value: boolean) {
    this.focusInBox = value == false && this.comment != '' ? true : value ;
  }
}
