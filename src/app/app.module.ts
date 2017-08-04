import { FormsModule } from '@angular/forms';
import { CanActivateAuthGuard } from './can-activate-auth-guard';
import { AngularFireAuthModule } from 'angularfire2/auth/auth.module';
import { AngularFireDatabaseModule } from 'angularfire2/database/database.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MasonryModule } from 'angular2-masonry';
import { NgModule } from '@angular/core';
import { AngularFireModule } from 'angularfire2';
import { MdChipsModule, MdToolbarModule, MdButtonModule, MdDialogModule, MdIconModule, MdInputModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app.routing.module';
import { environment } from '../environments/environment';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { WallComponent } from './wall/wall.component';

import { ImageItemComponent } from './image-item/image-item.component';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ImageDialogComponent,
        WallComponent,
        ImageItemComponent
    ],
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        MasonryModule,
        MdToolbarModule,
        MdButtonModule,
        MdInputModule,
        MdChipsModule,
        MdDialogModule,
        MdIconModule,
        BrowserModule,
        AppRoutingModule,
        AngularFireAuthModule,
        AngularFireModule.initializeApp(environment.firebase, 'fcc-pinterest'),
        AngularFireDatabaseModule,
    ],
    providers: [
        CanActivateAuthGuard
    ],
    entryComponents: [
        ImageDialogComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
