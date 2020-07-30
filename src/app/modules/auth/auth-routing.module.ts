import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { Routes, RouterModule } from '@angular/router'

import { AuthLayoutComponent, InnerLayoutComponent } from './../../_layouts'
import { LoginComponent } from './login/login.component'
import { DeleteAccountComponent } from './delete-account/delete-account.component'
import { RegistrationComponent } from './registration/registration.component'
import { VerificationComponent } from './verification/verification.component'
import { HomeComponent } from '../home/home.component'
import { EmailVerificationComponent } from './email-verification/email-verification.component'

const guestChildRoutes: Routes = [
  //  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'sign-in',
    component: LoginComponent,
    data: { title: 'Login', breadcrumb: 'Login' }
  },
  {
    path: 'sign-up',
    component: RegistrationComponent,
    data: { title: 'Registration', breadcrumb: 'Registration' }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: { title: 'Forgot Password', breadcrumb: 'Forgot Password' }
  },
  {
    path: 'signup-verification/:emailcode',
    component: VerificationComponent,
    data: { title: 'Signup Verification', breadcrumb: 'Signup Verification' }
  },
  {
    path: 'email-verification/:emailcode',
    component: EmailVerificationComponent,
    data: { title: 'Signup Verification', breadcrumb: 'Signup Verification' }
  },
  {
    path: 'reset/:token',
    component: ResetPasswordComponent,
    data: { title: 'Reset Password', breadcrumb: 'Rest Password' }
  }
  // otherwise redirect to home
  //{ path: '**', redirectTo: '' }
]

const accountChildRoutes: Routes = [
  { path: 'deleted', component: DeleteAccountComponent }
]

const routes: Routes = [
  { path: '', component: AuthLayoutComponent, children: guestChildRoutes },
  {
    path: 'account',
    component: InnerLayoutComponent,
    children: accountChildRoutes
  }
]

export const AuthRoutes = RouterModule.forChild(routes)
