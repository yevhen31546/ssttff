import { SliderModule } from 'primeng/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageGridModalComponent } from './../shared/image-grid-modal/image-grid-modal.component'
import { LayoutLoaderService } from './../../_services/layout-loader.service'
import { SharedModule } from './../shared/shared.module'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CritiquesComponent } from './critiques.component'
import { CritiquesRoutes } from './critiques-routing.module'
import { AlertService } from './../../_services/alert.service'
import { LoaderService } from './../../_services/loader.service'
import { NgbTabsetModule, NgbModalModule, NgbProgressbarModule, NgbPopoverModule,
  NgbTooltipModule,

} from '@ng-bootstrap/ng-bootstrap'
import { ShareCritiqueComponent } from './share-critique/share-critique.component';
import { MentionModule } from 'fvi-angular-mentions/mention'

@NgModule({
  imports: [CommonModule, SharedModule, CritiquesRoutes, NgbTabsetModule, FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }), SliderModule
    , NgbModalModule, NgbProgressbarModule, NgbTooltipModule, MentionModule],
  declarations: [CritiquesComponent,
    ShareCritiqueComponent
  ],
  exports: [SharedModule],
  providers: [AlertService, LoaderService, LayoutLoaderService]
})
export class CritiquesModule { }
