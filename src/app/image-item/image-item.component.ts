import { IdentityService } from '../shared/identity.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Image } from '../shared/models';

@Component({
    selector: 'fp-image-item',
    templateUrl: './image-item.component.html',
    styleUrls: ['./image-item.component.scss'],
    animations: [
        trigger('selected', [
            state('1', style({ transform: 'scale(1.075)', opacity: '1' })),
            transition('* <=> 1', [
                animate('.25s ease-in-out'),
            ]),
        ])
    ]
})
export class ImageItemComponent {
    @Input() public image: Image;
    @Input() public showStar: boolean;
    @Output() public starClick: EventEmitter<Image> = new EventEmitter();

    public onStarClick($event: Event, image: Image): void {
        $event.stopPropagation();
        this.starClick.next(image);
    }
}
