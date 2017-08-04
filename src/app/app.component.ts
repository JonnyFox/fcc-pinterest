import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Component, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { IdentityService } from './shared/identity.service';

import { Identity } from './shared/models';
import { Observable } from 'rxjs/Observable';
import { States } from './shared/states';

declare var gapi: any;

@Component({
    selector: 'fp-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy, AfterViewInit {

    private isAlive = true;

    public googleLoginButtonId = 'google-login-button';

    public $booksCount: Observable<number>;
    public $identity: Observable<Identity>;

    constructor(
        private router: Router,
        private zone: NgZone,
        private identityService: IdentityService,
        private identitySvc: IdentityService,
        private afAuth: AngularFireAuth
    ) {
        this.$identity = this.identityService.$identity
            .takeWhile(() => this.isAlive);

        this.$identity
            .filter(i => i == null)
            .subscribe(_ => {
                this.afAuth.auth.signOut();
            });
    }

    ngAfterViewInit() {
        gapi.signin2.render(
            this.googleLoginButtonId,
            {
                'onSuccess': (loggedInUser: any) => this.setLoggedUser(loggedInUser),
                'scope': 'profile',
                'theme': 'dark'
            });
    }

    public logout(): void {
        gapi.auth2.getAuthInstance()
            .signOut()
            .then(_ => {
                this.zone.run(() => {
                    this.identitySvc.setIdentity(null);
                    window.location.reload();
                });
            });
    }

    private setLoggedUser(loggedInUser: any) {
        this.zone.run(() => {
            const profile = loggedInUser.getBasicProfile();
            const credential = (<any>firebase).auth.GoogleAuthProvider.credential(
                loggedInUser.getAuthResponse().id_token);
            this.afAuth.auth
                .signInWithCredential(credential)
                .then(_ => {
                    this.identitySvc.setIdentity({
                        id: profile.getId(),
                        name: profile.getName(),
                        email: profile.getEmail(),
                        imageUrl: profile.getImageUrl()
                    });
                    this.router.navigate([`/${States[States.dashboard]}`]);
                })
                .catch(err => console.error(err));
        });
    }

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}
