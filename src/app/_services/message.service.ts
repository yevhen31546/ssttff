import { Injectable } from '@angular/core'
import { ReplaySubject } from 'rxjs/Rx'
import { PusherService } from './pusher.service'
import { MessagesService } from '../modules/messages/messages.service'

export interface Message {
  message: string
  inbox_id: string
}

@Injectable()
export class MessageService {
  messagesStream = new ReplaySubject<Message>(1)

  constructor(
    private pusherService: PusherService,
    private messagesService: MessagesService
  ) {
    this.initialize()
  }

  initialize() {

  }

  send(message: Message) {

  }

  loadMessages() {}

  loadChatFriends() {}

  emitNewMessage(message: Message) {
    ////console.log(message)
    this.messagesStream.next(message)
  }

  getMessages() {}
}
