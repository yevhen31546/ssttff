import { Routes, RouterModule } from '@angular/router'
import { SubscriptionComponent } from './subscription.component'
import { InnerLayoutComponent } from './../../_layouts'
import { SubscriptionPlansComponent } from './subscription-plans/subscription-plans.component'
import { SubscriptionUpgradeComponent } from './subscription-upgrade/subscription-upgrade.component'
import { SubscriptionDowngradeComponent } from './subscription-downgrade/subscription-downgrade.component'
import { SubscriptionSubmissionComponent } from './subscription-submission/subscription-submission.component'

const guestChildRoutes: Routes = [
  {
    path: 'plans',
    component: SubscriptionPlansComponent,
    data: { title: 'Pricing | Shoot The Frame', breadcrumb: 'subscription-plans' }
  },
  {
    path: 'upgrade',
    component: SubscriptionUpgradeComponent,
    data: { title: 'Subscription Upgrade', breadcrumb: 'subscription-upgrade' }
  },
  {
    path: 'success/upgrade',
    component: SubscriptionUpgradeComponent,
    data: { title: 'Subscription Upgrade', breadcrumb: 'subscription-upgrade' }
  },
  {
    path: 'submission',
    component: SubscriptionSubmissionComponent,
    data: {
      title: 'Subscription Submission',
      breadcrumb: 'subscription-submission'
    }
  },
  {
    path: 'downgrade',
    component: SubscriptionDowngradeComponent,
    data: {
      title: 'Subscription Downgarde',
      breadcrumb: 'subscription-downgrade'
    }
  }
]

const routes: Routes = [
  { path: '', component: InnerLayoutComponent, children: guestChildRoutes }
]

export const SubscriptionRoutes = RouterModule.forChild(routes)
