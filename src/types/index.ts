export type Tag = {
    id: number | null;
    color: string;
    label: string;
}

export type Note = {
    [x: string]: any;
    id: string;
    content: string;
    tagId: number | null;
    dateCreated: Date;
    dateLastModified: null | Date;
    imageUrl: string | null,
    status: string,
}

export type SortKeys = 'dateCreated' | 'dateLastModified';

export type SortKeyAndAscAsString = `${SortKeys}__asc` | `${SortKeys}__desc`;

export type EditorDataNewAction = {
    type: 'new';
    payload: null;
}

export type EditorDataEditAction = {
    type: 'edit';
    payload: Note;
}

export type EditorDataAction = EditorDataNewAction | EditorDataEditAction;