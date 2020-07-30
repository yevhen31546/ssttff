import { LOCAL_STORAGE } from "@ng-toolkit/universal";
import { MessagesService } from "../modules/messages/messages.service";
import { Injectable, Inject, PLATFORM_ID,Optional } from "@angular/core";
import { environment } from "../../environments/environment";
import { isPlatformBrowser } from "@angular/common";
declare const Pusher: any;

@Injectable({ providedIn: "root" })
export class PusherService {
  pusher: any;
  channel: any;
  socketId: string;
  channelName: string;
  currentUser: any;

  constructor(
    @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any,
    public messagesService: MessagesService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = JSON.parse(this.localStorage.getItem("currentUser"));
      if (this.currentUser) {
        this.initializePusher();
      }
    }
  }

  initializePusher(): void {
    Pusher.logToConsole = true;
    this.pusher = new Pusher(environment.pusher.key, {
      cluster: environment.pusher.cluster,
      forceTLS: true,
      authEndpoint: environment.apiUrl + "auth",
      auth: {
        headers: {
          Authorization: `Bearer ${this.currentUser.token}`
        }
      }
    });
    //console.log(this.pusher)
  }

  // any time it is needed we simply call this method
  getPusher() {
    return this.pusher;
  }
}
