export interface Identity {
    id: string;
    name: string;
    email: string;
    imageUrl: string;
}

export class Image implements FirebaseItem, SelectableItem {
    $key: string;
    title: string;
    url: string;
    owner: Identity;
    likes: string[] = [];
    isSelected: boolean;
    isStarred: boolean;
    date: number;
}

export interface FirebaseItem {
    $key: string;
}

export interface SelectableItem {
    isSelected: boolean;
}

export enum FirebaseLists {
    images
}

