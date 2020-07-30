import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { InsightsComponent } from './insights.component'
import { SharedModule } from '../shared/shared.module'
import { ChartsModule } from 'ng2-charts'
import { InsightsRoutes } from './insights-routing.module'
import { NgxLineChartModule } from 'ngx-line-chart'
import { InsightsService } from './insights.service'
import { FormsModule } from '@angular/forms';
import { MobileGraphComponent } from './mobile-graph/mobile-graph.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
    ChartsModule,
    InsightsRoutes,
    NgSelectModule
    // NgxLineChartModule
  ],
  declarations: [InsightsComponent,
    MobileGraphComponent,
    MobileGraphComponent
],
  providers: [InsightsService]
})
export class InsightsModule {}
