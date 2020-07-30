import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'

import { PhotoUploadComponent } from './photo-upload.component'
import { FileUpComponent } from './file-up/file-up.component'
import { ComposeComponent } from './compose/compose.component'
import { StoryComponent } from './story/story.component'
import { DetailsComponent } from './details/details.component'
import { CategoryComponent } from './category/category.component'
import { AwardsComponent } from './awards/awards.component'
import { UploadCompleteComponent } from './upload-complete/upload-complete.component'
import { UploadTabsComponent } from './upload-tabs/upload-tabs.component'
import { CanDeactivateGuard } from '../../_guards'
import { StfAwardSubmitComponent } from './stf-award-submit/stf-award-submit.component'

const routes: Routes = [
  {
    path: '',
    component: PhotoUploadComponent,
    data: {title: 'Upload Photo | Shoot The Frame'},
    children: [
      {
        path: '',
        component: FileUpComponent
      },
      {
        path: 'compose/:subjectId',
        component: ComposeComponent,
        children: [
          {
            path: '',
            redirectTo: 'story'
          },
          {
            path: 'story',
            component: StoryComponent
          },
          {
            path: 'details',
            component: DetailsComponent
          },
          {
            path: 'category',
            component: CategoryComponent
          },
          {
            path: 'awards',
            component: AwardsComponent
          }
        ]
      },
      {
        path: 'compose/:subjectId',
        component: ComposeComponent
      },
      {
        path: 'details',
        component: UploadTabsComponent,
        canDeactivate: [CanDeactivateGuard]
      },
      {
        path: 'submit-stf-awards/:subjectId',
        component: StfAwardSubmitComponent
      },
      {
        path: 'submit-stf-awards/:subjectId/complete',
        component: UploadCompleteComponent
      },
      {
        path: 'complete',
        component: UploadCompleteComponent
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhotoUploadRoutingModule {}
