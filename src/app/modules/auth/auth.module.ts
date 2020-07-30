import { LoaderService } from './../../_services/loader.service'
import { ResetPasswordComponent } from './reset-password/reset-password.component'
import { environment } from './../../../environments/environment'
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AuthComponent } from './auth.component'
import { RegistrationComponent } from './registration/registration.component'
import { LoginComponent } from './login/login.component'
import { AuthRoutes } from './auth-routing.module'
import { ScrollbarModule } from 'ngx-scrollbar'
import { ReactiveFormsModule, FormsModule } from '@angular/forms'
import { AlertService } from './../../_services/alert.service'
import { VerificationComponent } from './verification/verification.component'
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angular-6-social-login'
import { AuthLayoutComponent } from '../../_layouts'
import { CommonMobileHeaderComponent } from '../../_layouts/common-mobile-header/common-mobile-header.component'
import { SharedModule } from '../shared/shared.module'
import { DeleteAccountComponent } from './delete-account/delete-account.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component'
import { ScrollPanelModule } from 'primeng/scrollpanel'

//import { SharedModule } from '../shared/shared.module'

// Configs
export function getAuthServiceConfigs() {
  let config = new AuthServiceConfig([
    {
      id: FacebookLoginProvider.PROVIDER_ID,
      provider: new FacebookLoginProvider(environment.FACEBOOK_SIGN_IN_KEY)
    },
    {
      id: GoogleLoginProvider.PROVIDER_ID,
      provider: new GoogleLoginProvider(environment.GOOGLE_SIGN_IN_KEY)
    }
  ])
  return config
}

@NgModule({
  imports: [
    CommonModule,
    AuthRoutes,
    FormsModule,
    ScrollbarModule,
    ScrollPanelModule,
    ReactiveFormsModule,
    SocialLoginModule,
    SharedModule
  ],
  declarations: [
    AuthComponent,
    RegistrationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    VerificationComponent,
    ResetPasswordComponent,
    DeleteAccountComponent,
    EmailVerificationComponent
  ],
  providers: [
    AlertService,
    LoaderService,
    {
      provide: AuthServiceConfig,
      useFactory: getAuthServiceConfigs
    }
  ]
})
export class AuthModule {}
