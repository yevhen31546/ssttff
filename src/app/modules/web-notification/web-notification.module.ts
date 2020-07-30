import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { WebNotificationComponent } from './web-notification.component'
import { SharedModule } from '../shared/shared.module'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [CommonModule, FormsModule, SharedModule,BrowserModule],
  declarations: []
})
export class WebNotificationModule {}
