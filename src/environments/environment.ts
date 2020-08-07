// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // apiUrl: 'http://103.214.233.21:5400/api/',
  // apiUrl: "https://stf.cubettech.in/api/",
  apiUrl: "http://127.0.0.1:8000/api/",
  // apiUrl: 'http://192.168.1.32:8000/api/',
  // apiUrl: 'http://192.168.1.69:8000/api/',
  // apiUrl: 'https://api-earlyaccess.shoottheframe.com//api/',
  GOOGLE_SIGN_IN_KEY:
    "1011922714439-s6abs87dcvpngdj5en6knu5ieqqrj8q9.apps.googleusercontent.com",
  FACEBOOK_SIGN_IN_KEY: "560772111023478",
  STRIPE_PUBLISH_KEY: "pk_test_TkUK1TM4VqcncPVWmL6zS3X600BeQhsuhR",
  // STRIPE_PUBLISH_KEY: "pk_test_OfvlmHP8Cb5nLJLWnBoVGh8r00VWYFz20u",
  // pusher: {
  //   key: 'd570e1d2dec0636aedaa',
  //   cluster: 'ap2'
  // }, //local

  pusher: {
    key: "2d555ce9d4329b4e47ff",
    cluster: "us3"
  },

  GLIDE_SIZE: 80,
  CURRENT_URL: "http://localhost:4200/",
  CRITIC_URL: "localhost:4200/critiques/photo/",
  DOMAIN_URL: "localhost:4200/",
  firebase: {
    apiKey: "AIzaSyBbujVQnl-T1ezUHL3atV-WNNjskA3Mqqg",
    authDomain: "shoot-the-frame-a502a.firebaseapp.com",
    databaseURL: "https://shoot-the-frame-a502a.firebaseio.com",
    projectId: "shoot-the-frame-a502a",
    storageBucket: "shoot-the-frame-a502a.appspot.com",
    messagingSenderId: "116373090411"
  },

  // firebase: {
  //   apiKey: "AIzaSyCqA4EcxlBoWIXXHguxnxXaka7-sVoKcmo",
  //   authDomain: "shoottheframe-1539756827128.firebaseapp.com",
  //   databaseURL: "https://shoottheframe-1539756827128.firebaseio.com",
  //   projectId: "shoottheframe-1539756827128",
  //   storageBucket: "shoottheframe-1539756827128.appspot.com",
  //   messagingSenderId: "1011922714439"
  // },
  randomSelectionCount: 50,

  lastIndex: 989
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
