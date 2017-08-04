import { animate, state, style, transition, trigger } from '@angular/animations';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseListObservable } from 'angularfire2/database/firebase_list_observable';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdDialog } from '@angular/material';
import { FirebaseLists, Image, SelectableItem } from '../shared/models';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';
import { IdentityService } from '../shared/identity.service';

@Component({
    templateUrl: './wall.component.html',
    styleUrls: ['./wall.component.scss'],
    animations: [
        trigger('spinned', [
            state('1', style({ transform: 'rotate(180deg)' })),
            transition('* <=> 1', [
                animate('.25s ease-in-out')
            ])
        ])
    ]
})
export class WallComponent implements OnInit, OnDestroy {

    private isAlive = true;
    private _$selectedImages = new BehaviorSubject([]);

    public isSelectionMode: boolean;
    public $selectedImages: Observable<Image[]>;
    public $isSelectionMode: Observable<boolean>;
    public $images: Observable<Image[]>;

    constructor(
        private db: AngularFireDatabase,
        public dialog: MdDialog,
        private identityService: IdentityService
    ) {
        this.identityService.$identity
            .takeWhile(() => this.isAlive)
            .subscribe(identity => {
                this.$images = db.list(`/${FirebaseLists[FirebaseLists.images]}`, {
                    query: {
                        orderByChild: 'owner/id',
                        equalTo: identity.id
                    }
                }).map((i: Image[]) => i.sort((a, b) => a.date < b.date ? 1 : -1));
            });

        this.$selectedImages = this._$selectedImages.asObservable();

        this.$isSelectionMode = this.$selectedImages
            .map(imgs => imgs && !!imgs.length);
    }

    ngOnInit() { }

    public addImage() {
        const dialogRef = this.dialog.open(ImageDialogComponent, {
            width: '80%',
            height: '60%'
        });
        dialogRef.afterClosed()
            .takeWhile(_ => this.isAlive)
            .filter(i => !!i)
            .subscribe((result: Image) => this.db.database.ref(`/${FirebaseLists[FirebaseLists.images]}`).push(result));
    }

    public removeImages() {
        const updates: { [key: string]: any } = {};
        this._$selectedImages.value.forEach((i: Image) => updates[`/${FirebaseLists[FirebaseLists.images]}/${i.$key}`] = null);
        this.db.database.ref()
            .update(updates)
            .then(() => this._$selectedImages.next([]));
    }

    public selectImage(image: Image) {
        image.isSelected = !image.isSelected;
        if (image.isSelected) {
            this._$selectedImages.next(this._$selectedImages.value.concat(image));
        } else {
            this._$selectedImages.next(this._$selectedImages.value.filter((i: Image) => i.$key !== image.$key));
        }
    }

    public spinDone(): void {
        this.isSelectionMode = this._$selectedImages.value.length > 0;
    }

    ngOnDestroy(): void {
        this.isAlive = false;
    }
}
