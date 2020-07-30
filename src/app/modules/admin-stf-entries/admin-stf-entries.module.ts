import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AdminStfEntriesComponent } from './admin-stf-entries.component'
import { AdminStfTabsComponent } from './admin-stf-tabs/admin-stf-tabs.component'
import { SharedModule } from '../shared/shared.module'
import { NgbTabsetModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap'
import { HttpModule } from '@angular/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select'
import { AdminStfEntriesRoutes } from './admin-stf-entries-routing.module'

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AdminStfEntriesRoutes,
    NgSelectModule,
    SharedModule,
    NgbTooltipModule,
    NgbTabsetModule
  ],
  declarations: [AdminStfEntriesComponent, AdminStfTabsComponent],
  exports: [SharedModule]
})
export class AdminStfEntriesModule {}
