import {
  Component,
  OnInit,
  Optional,
  PLATFORM_ID,
  APP_ID,
  Inject
} from "@angular/core";
import { isPlatformServer, isPlatformBrowser } from "@angular/common";
import { RESPONSE } from "@nguniversal/express-engine/tokens";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.css"]
})
export class NotFoundComponent implements OnInit {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    @Optional() @Inject(RESPONSE) private response: any
  ) {
    const platform = isPlatformBrowser(platformId) ?
        'in the browser' : 'on the server';
      console.log(`Running ${platform} with appId=${appId}`);
      console.log(isPlatformServer(this.platformId));
      if (isPlatformServer(this.platformId) ) {
        this.response.status(404);
      }
  }

  ngOnInit() {
  }
}
