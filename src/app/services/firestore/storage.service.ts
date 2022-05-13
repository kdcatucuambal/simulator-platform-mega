import {Injectable} from '@angular/core';
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {from, Observable, switchMap} from "rxjs";
import {QueryDbService} from "./query-db.service";
import * as shortUUID from "short-uuid";
import firebase from "firebase/compat";
import UploadTaskSnapshot = firebase.storage.UploadTaskSnapshot;
import {DocumentData} from "@angular/fire/compat/firestore";


export interface FileInfo{
  id?: string
  title: string
  description: string
  isActive: boolean,
  url: string
  name: string
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private basePath = '/uploads';

  constructor(
    private fireStorage: AngularFireStorage,
    private queryDbService: QueryDbService
  ) {
  }

  getAllFiles(){
    return this.queryDbService.getAllDocs<FileInfo>('resources');
  }

  updateInfoFile(id: string, fileInfo: FileInfo){
    return this.queryDbService.updateDoc('resources', id, fileInfo);
  }

  pushFile(dataUpload: File, fileInfo: FileInfo) {
    fileInfo.name = shortUUID.generate();
    const filePath = `${this.basePath}/${fileInfo.name}`;
    return from(this.fireStorage.upload(filePath, dataUpload))
      .pipe(
        switchMap<UploadTaskSnapshot, Observable<string>>(data => {
          return from(data.ref.getDownloadURL());
        }),
        switchMap(url => {
          fileInfo.url = url as any;
          return this.queryDbService.addDoc<FileInfo>('resources', fileInfo);
        })
      );
  }

  deleteFile(documentId: string, fileName: string) {
    const storageRef = this.fireStorage.ref(`${this.basePath}/${fileName}`);
   return this.queryDbService.deleteDoc('resources', documentId)
      .pipe(
        switchMap(() => {
          return storageRef.delete();
        })
      )
  }

}
