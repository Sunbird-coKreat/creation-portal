import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrganisationComponent, UsageReportsComponent, ReportComponent, ListAllReportsComponent, DashboardSidebarComponent
} from './components/';
import { AuthGuard } from '../core/guard/auth-gard.service';
const telemetryEnv = 'course-dashboard';
const routes: Routes = [
  {
    path: '', component: DashboardSidebarComponent, canActivate: [AuthGuard],
    data: {
      roles: 'courseBatchRoles',
      telemetry: { env: 'Course', pageid: 'course-dashboard', type: 'view', object: { ver: '1.0', type: 'course' } }
    },
  },
  {
    path: 'organization', component: UsageReportsComponent, canActivate: [AuthGuard],
    data: {
      roles: 'dashboardRole',
      telemetry: { env: 'dashboard', pageid: 'org-admin-dashboard', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    path: 'organization/creation/:id/:timePeriod', component: OrganisationComponent,
    data: {
      telemetry: { env: 'profile', pageid: 'org-admin-dashboard', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Organization Admin Dashboard', url: '' }]
    }
  },
  {
    path: 'reports', component: ListAllReportsComponent, data: {
      roles: 'reportViewerRole',
      telemetry: { env: 'reports', pageid: 'reports-list', type: 'view' }
    }
  },
  {
    path: 'reports/:reportId', component: ReportComponent,
    data: {
      roles: 'reportViewerRole',
      telemetry: { env: 'reports', pageid: 'report-chart', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Report Page', url: '' }]
    }
  },
  {
    path: 'reports/:reportId/:hash', component: ReportComponent,
    data: {
      roles: 'reportViewerRole',
      telemetry: { env: 'reports', pageid: 'report-chart', type: 'view' },
      breadcrumbs: [{ label: 'Home', url: '/home' },
      { label: 'Profile', url: '/profile' }, { label: 'Report Page', url: '' }]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
