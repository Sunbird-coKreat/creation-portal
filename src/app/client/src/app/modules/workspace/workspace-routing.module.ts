import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  WorkspaceComponent,
  ReviewSubmissionsComponent, CollectionEditorComponent, ContentEditorComponent,
  GenericEditorComponent, UploadedComponent, UpForReviewComponent, UpdateBatchComponent,
  UpforreviewContentplayerComponent, ReviewsubmissionsContentplayerComponent, PublishedPopupComponent, RequestChangesPopupComponent} from './components';
import { AuthGuard } from '../core/guard/auth-gard.service';
const telemetryEnv = 'workspace';
const objectType = 'workspace';
const routes: Routes = [
  {
    path: 'content', component: WorkspaceComponent, canActivate: [AuthGuard], data: { roles: 'workspace' },
    children: [
      {
        path: 'edit/collection/:contentId/:type/:state/:framework/:contentStatus',
          component: CollectionEditorComponent, canActivate: [AuthGuard],
        data: { roles: 'workspace' }
      },
      {
        path: 'edit/content/:contentId/:state/:framework/:contentStatus', component: ContentEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'edit/generic', component: GenericEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'edit/generic/:contentId/:state/:framework/:contentStatus', component: GenericEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'edit/collection/:contentId/:type/:state/:framework',
          component: CollectionEditorComponent, canActivate: [AuthGuard],
        data: { roles: 'workspace' }
      },
      {
        path: 'edit/content/:contentId/:state/:framework', component: ContentEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      {
        path: 'edit/generic/:contentId/:state/:framework', component: GenericEditorComponent,
        canActivate: [AuthGuard], data: { roles: 'workspace' }
      },
      
      {
        path: 'review/:pageNumber', component: ReviewSubmissionsComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-inreview', subtype: 'paginate', uri: '/workspace/content/review',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'inreviewRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'uploaded/:pageNumber', component: UploadedComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-uploaded', subtype: 'paginate', uri: '/workspace/content/uploaded',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'alluploadsRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      },
      {
        path: 'upForReview/:pageNumber', component: UpForReviewComponent, canActivate: [AuthGuard],
        data: {
          telemetry: {
            env: telemetryEnv, pageid: 'workspace-content-upforreview', subtype: 'paginate', uri: 'workspace/content/upForReview',
            type: 'list', mode: 'create', object: { type: objectType, ver: '1.0' }
          }, roles: 'upForReviewRole',
          breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
        }
      } 
    ]
  },
  {
    path: 'content/upForReview/content/:contentId', component: UpforreviewContentplayerComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    },
    children: [
      { path: 'publish', component: PublishedPopupComponent },
      { path: 'requestchanges', component: RequestChangesPopupComponent }
    ]
  },
  {
    path: 'content/flagreviewer/content/:contentId', component: UpforreviewContentplayerComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    },
    children: [
      { path: 'publish', component: PublishedPopupComponent },
      { path: 'requestchanges', component: RequestChangesPopupComponent }
    ]
  },
  
  {
    path: 'content/review/content/:contentId', component: ReviewsubmissionsContentplayerComponent, canActivate: [AuthGuard],
    data: {
      roles: 'workspace',
      breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Profile', url: '/profile' }, { label: 'My Workspace', url: '' }]
    }
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkspaceRoutingModule { }


