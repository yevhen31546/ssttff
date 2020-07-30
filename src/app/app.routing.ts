import { Routes, RouterModule } from '@angular/router'
import { AuthGuard, GuestGuard, CanDeactivateGuard } from './_guards'

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './modules/home/home.module#HomeModule'
  },
  {
    path: '',
    canActivate: [GuestGuard],
    loadChildren: './modules/auth/auth.module#AuthModule'
  },

  {
    path: 'subscription',
    loadChildren:
      './modules/subscription/subscription.module#SubscriptionModule'
  },

  {
    path: 'user',
    canActivate: [AuthGuard],
    loadChildren: './modules/user/user.module#UserModule'
  },

  {
    path: 'explore',
    loadChildren: './modules/explore-menu/explore-menu.module#ExploreMenuModule'
  },
  {
    path: 'stf-award-entries',
    loadChildren:
      './modules/stf-awards-entries/stf-awards-entries.module#StfAwardsEntriesModule'
  },
  {
    path: 'all-stf-entries',
    loadChildren:
      './modules/admin-stf-entries/admin-stf-entries.module#AdminStfEntriesModule'
  },
  {
    path: 'critiques',
    loadChildren: './modules/critiques/critiques.module#CritiquesModule'
  },
  {
    path: 'photos',
    loadChildren: './modules/shared/shared.module#SharedModule'
  },
  {
    path: 'photo-essay',
    loadChildren: './modules/photo-essay/photo-essay.module#PhotoEssayModule'
  },
  {
    path: 'collection',
    loadChildren: './modules/collections/collections.module#CollectionsModule'
  },
  {
    path: 'likes',
    loadChildren: './modules/likes/likes.module#LikesModule'
  },
  {
    path: 'insights',
    canActivate: [AuthGuard],
    loadChildren: './modules/insights/insights.module#InsightsModule'
  },
  {
    path: 'messages',
    loadChildren: './modules/messages/messages.module#MessagesModule'
  },
  {
    path: 'search',
    loadChildren: './modules/search/search.module#SearchModule'
  },
  {
    path: 'search-photos',
    loadChildren: './modules/find-photos/find-photos.module#FindPhotosModule'
  },
  {
    path: 'error',
    loadChildren: './modules/error/error.module#ErrorModule'
  },
  {
    path: '',
    loadChildren: './modules/profile/profile.module#ProfileModule',
    data: { title: 'Home Page' }
  },
  {
    path: 'pricing',
    redirectTo: 'subscription/plans'
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },

  {
    path: 'not-found',
    loadChildren: './modules/not-found/not-found.module#NotFoundModule'
  },
  // otherwise redirect to home
  //{ path: '**', redirectTo: 'user' }
]

export const routing = RouterModule.forRoot(appRoutes, {
  initialNavigation: 'enabled',
})
;
