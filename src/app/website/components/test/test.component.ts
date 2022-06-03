import {Component, OnInit} from '@angular/core';
import {StorageService} from "../../../services/firestore/storage.service";



@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {



  constructor(
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
  }

  onChangeFile(event){
    const [file] = event.target.files as File[];
  }

  onUpload(){


  }

  deleteFile(){
    this.storageService.deleteFile('wwEBUZGjzg6w22EzWO3U', '6aNaaY4nq4WomMEC1iP5Mb').subscribe(()=>{

    });
  }

}
