import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MessagesRoutes } from './messages-routing.module'
import { SharedModule } from '../shared/shared.module'
import { FormsModule } from '@angular/forms'


@NgModule({
  imports: [CommonModule, SharedModule, MessagesRoutes, FormsModule],
  declarations: [],
  exports:[]
})
export class MessagesModule {}
