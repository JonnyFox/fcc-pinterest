import { WallComponent } from './wall/wall.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { IdentityService } from './shared/identity.service';
import { CanActivateAuthGuard } from './can-activate-auth-guard';

const appRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [CanActivateAuthGuard] },
    { path: 'wall', component: WallComponent, canActivate: [CanActivateAuthGuard] },
    { path: '', component: DashboardComponent },
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        IdentityService
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule { }
