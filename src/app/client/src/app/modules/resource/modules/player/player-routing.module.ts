import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollectionPlayerComponent, ContentPlayerComponent } from './components';
import { FlagContentComponent } from '@sunbird/core';
const telemetryEnv = 'library';

const routes: Routes = [
    {
        path: 'collection/:collectionId', component: CollectionPlayerComponent,
        data: {
            breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
            telemetry: { env: telemetryEnv, pageid: 'collection-player', type: 'play' }
        },
        children: [
            { path: 'flag', component: FlagContentComponent }
        ]
    }, {
        path: 'collection/:collectionId/:collectionStatus', component: CollectionPlayerComponent,
        data: {
            breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
            telemetry: { env: telemetryEnv, pageid: 'collection-player-unlisted', type: 'play' }
        }
    }, {
        path: 'content/:contentId', component: ContentPlayerComponent,
        data: {
            telemetry: {
                env: telemetryEnv, pageid: 'content-player', type: 'play'
            }, breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '/resources' }]
        },
        children: [
            { path: 'flag', component: FlagContentComponent }
        ]
    }, {
        path: 'content/:contentId/:contentStatus', component: ContentPlayerComponent,
        data: {
            breadcrumbs: [{ label: 'Home', url: '/home' }, { label: 'Library', url: '' }],
            telemetry: { env: telemetryEnv, pageid: 'content-player-unlisted', type: 'play' }
        }
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PlayerRoutingModule { }
