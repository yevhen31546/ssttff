// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://stf-qa.cubettech.in/api/',
  GOOGLE_SIGN_IN_KEY:
  '1011922714439-s6abs87dcvpngdj5en6knu5ieqqrj8q9.apps.googleusercontent.com',
  FACEBOOK_SIGN_IN_KEY: '309398813082315',
  // STRIPE_PUBLISH_KEY: 'pk_test_OfvlmHP8Cb5nLJLWnBoVGh8r00VWYFz20u', pk_test_4Nkpnov9pEfpomSpZ0Zl2cp3
  STRIPE_PUBLISH_KEY: 'pk_test_4Nkpnov9pEfpomSpZ0Zl2cp3', 
  GLIDE_SIZE: 80,
  pusher: {
    key: '2d555ce9d4329b4e47ff',
    cluster: 'us3'
  },

  CURRENT_URL: 'https://stf-frontend-qa.cubettech.in/',
  CRITIC_URL: 'stf-frontend-qa.cubettech.in/critiques/photo/',
  DOMAIN_URL: 'stf-frontend-qa.cubettech.in/',
  firebase: {
    apiKey: 'AIzaSyBbujVQnl-T1ezUHL3atV-WNNjskA3Mqqg',
    authDomain: 'shoot-the-frame-a502a.firebaseapp.com',
    databaseURL: 'https://shoot-the-frame-a502a.firebaseio.com',
    projectId: 'shoot-the-frame-a502a',
    storageBucket: 'shoot-the-frame-a502a.appspot.com',
    messagingSenderId: '116373090411'
  },

  randomSelectionCount: 50
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
