import { Observable } from 'rxjs/Rx';
import { IdentityService } from '../shared/identity.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseLists, Identity, Image } from '../shared/models';
import { MdDialog } from '@angular/material';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [
        trigger('selected', [
            state('1', style({ transform: 'scale(1.075)', opacity: '1' })),
            transition('* <=> 1', [
                animate('.25s ease-in-out'),
            ]),
        ])
    ]
})
export class DashboardComponent implements OnInit, OnDestroy {

    private isAlive = true;

    public $images: Observable<Image[]>;

    private identity: Identity;

    constructor(
        private db: AngularFireDatabase,
        public dialog: MdDialog,
        private identityService: IdentityService
    ) {
        this.identityService.$identity
            .takeWhile(() => this.isAlive)
            .subscribe(identity => this.identity = identity);

        this.identityService.$identity
            .takeWhile(() => this.isAlive)
            .subscribe(identity => {
                this.$images = db.list(`/${FirebaseLists[FirebaseLists.images]}`)
                    .do((i: Image[]) => i.map(image => image.isSelected = image.likes && image.likes.some(like => like === identity.id)))
                    .map((i: Image[]) => i.sort((a, b) => a.date < b.date ? 1 : -1));
            });
    }

    public toggleStar($event: Event, image: Image): void {

        if (image.likes && image.likes.some(i => i === this.identity.id)) {
            image.likes = image.likes.filter(i => i !== this.identity.id);
        } else {
            image.isSelected = true;
            image.likes = image.likes || [];
            image.likes.push(this.identity.id);
        }

        const updates: { [key: string]: any } = {};
        updates[`/${FirebaseLists[FirebaseLists.images]}/${image.$key}`] = image;
        this.db.database.ref().update(updates);
    }

    ngOnInit() { }

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}
