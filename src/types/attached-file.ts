import { ObjectId } from 'bson'

export interface AttachedFile {
    _id: ObjectId;
    path: string;
    name: string;
    mimeType: string;
    size: number;
}