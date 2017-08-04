import { FormControl, Validators } from '@angular/forms';
import { IdentityService } from '../shared/identity.service';
import { Component } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Image } from '../shared/models';

const URL_IMAGE_REGEX = /^https?:\/\/.*\.(?:png|jpg|gif)/i;

@Component({
    templateUrl: './image-dialog.component.html',
    styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent {

    public editItem: Image = new Image();

    public imageFormControl = new FormControl('', [
        Validators.required,
        Validators.pattern(URL_IMAGE_REGEX)]);

    constructor(
        private dialogRef: MdDialogRef<ImageDialogComponent>,
        private identityService: IdentityService
    ) {
        this.editItem.title = this.editItem.url = '';
    }

    public save(): void {
        this.identityService.$identity
            .subscribe(i => {
                this.editItem.owner = i;
                this.editItem.date = Date.now();
                this.dialogRef.close(this.editItem);
            });
    }

    public cancel(): void {
        this.dialogRef.close();
    }
}
