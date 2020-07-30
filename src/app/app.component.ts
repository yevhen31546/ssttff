import { Component, Injector, PLATFORM_ID, Inject } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";
import { isPlatformServer, isPlatformBrowser } from "@angular/common";
import { AuthenticationService } from "./_services";
// import { GoogleTagManagerService } from 'angular-google-tag-manager';
declare var gtag;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  title = "Shoot The Frame";

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private injector: Injector,
    private authenticationService: AuthenticationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) // private gtmService: GoogleTagManagerService,
  {}

  ngOnInit() {
    // this.router.events.forEach(item => {
    //   if (item instanceof NavigationEnd) {
    //     const gtmTag = {
    //       event: 'Page View',
    //       pageName: item.url
    //     };

    //     gtag.pushTag(gtmTag);
    //   }
    // });

    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => {
        let child = this.activatedRoute.firstChild;
        while (child) {
          if (child.firstChild) {
            child = child.firstChild;
          } else if (child.snapshot.data && child.snapshot.data["title"]) {
            return child.snapshot.data["title"];
          } else {
            return null;
          }
        }
        return null;
      })
      .subscribe((title: any) => {
        this.titleService.setTitle(title);
        if (isPlatformBrowser(this.platformId)) {
          const data = { url: window.location.pathname };
          this.authenticationService.saveBrowserUrl(data).subscribe();
        }
      });
  }
}
