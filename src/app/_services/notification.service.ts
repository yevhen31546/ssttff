import { LOCAL_STORAGE , WINDOW} from '@ng-toolkit/universal';
import { Injectable, Inject,Optional } from '@angular/core'
import { AngularFireDatabase } from '@angular/fire/database'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireMessaging } from '@angular/fire/messaging'
import { mergeMapTo } from 'rxjs/operators'
import { take } from 'rxjs/operators'
import { BehaviorSubject } from 'rxjs'
import { UserService } from '../modules/user/user.service'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../environments/environment'

@Injectable()
export class NotificationService {
  private token: string;
  currentMessage = new BehaviorSubject(null)

  constructor(@Inject(WINDOW) private window: Window, @Optional() 
 @Inject(LOCAL_STORAGE) private localStorage: any, 
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private userService: UserService,
     private http: HttpClient
  ) {
    
    this.angularFireMessaging.messaging.subscribe(_messaging => {
      _messaging.setBackgroundMessageHandler = _messaging.setBackgroundMessageHandler.bind(
        _messaging
      )
      _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging)
    })
  }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(() => {
      const data = {}
      data[userId] = token

      // this.angularFireDB.object('fcmTokens/').update(data)
    })
  }

  /**
   * request permission for notification from firebase cloud messaging
   *
   * @param userId userId
   */
  requestPermission(userId) {

    // let isSafari =  navigator.userAgent.indexOf("Safari") > -1;
    // //console.log(userId, "userId", navigator.userAgent)

    // if (!("Notification" in window)) {
    //   alert("This browser does not support desktop notification");
    // }

      this.angularFireMessaging.requestToken.subscribe(
        token => {
          //console.log(token, "token")
          this.token = token;
          let data = {
            user_id: userId,
            token: token
          }
          this.localStorage.setItem('f_token', token)
          this.userService
            .updateNotificationToken(data)
            .subscribe((response: any) => { }, error => { })
          //this.updateToken(userId, token)
        },
        err => {
          //console.error('Unable to get permission to notify.', err)
        }
      );
  //  if(isSafari) {
  //     try {
  //       Notification.requestPermission()
  //         .then((result) => {
  //           //console.log(result, "safari notification");
  //           let data = {
  //             user_id: userId,
  //             token: 123456
  //           }
  //           localStorage.setItem('f_token', '123456')
  //           this.userService
  //             .updateNotificationToken(data)
  //             .subscribe((response: any) => { }, error => { })

  //         }
  //         )
  //     } catch (error) {
  //       // Safari doesn't return a promise for requestPermissions and it                                                                                                                                       
  //       // throws a TypeError. It takes a callback as the first argument                                                                                                                                       
  //       // instead.
  //       if (error instanceof TypeError) {
  //         Notification.requestPermission((res) => {
  //           //console.log("safari notification result", res)
  //         });
  //       } else {
  //         throw error;
  //       }
  //     }
  //  }

  }

  /**
   * hook method when new notification received in foreground
   */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(payload => {
      //console.log('new message received. ', payload)
      this.currentMessage.next(payload)
    })
  }

  updateReadStatus() {
    return this.http.put(environment.apiUrl + 'updateReadStatus', {
    }).retryWhen(errors => {
      return errors.delay(3000).take(2)
    });
  }


 receiveMessageEmpty() { //console.log("empty")
     this.currentMessage.next(null)
  
 }
}
