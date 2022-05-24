import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {Area, RandomSimulator, SimulatorInfo, TopicForRandomSimulator} from "../../../models/Models";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {defaultLogger} from "@angular/cdk/schematics/update-tool/logger";


@Component({
  selector: 'app-random-simulator',
  templateUrl: './random-simulator.component.html',
  styleUrls: ['./random-simulator.component.scss'],
  providers: [MessageService]
})
export class RandomSimulatorComponent implements OnInit {

  loading = false;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;

  columns: Column[] = [
    {header: 'Código', field: 'topicId', type: 'text'},
    {header: 'Tema', field: 'topicName', type: 'text'},
    {header: 'Cantidad', field: 'numberOfQuestions', type: 'text'}
  ];


  data: RandomSimulator = {
    topics: [],
    imgUrl: '',
    description: '',
    title: '',
    minutes: 0,
    instructions: '',
    isActive: true,
    backgroundColor: '',
    textColor: ''
  };

  topics: Area[] = [];
  subjectSelected: TopicForRandomSimulator = {
    topicId: '',
    topicName: '',
    numberOfQuestions: 0
  };

  isOpened = false;
  titleModal = 'Nuevo Simulador';
  deletedId = '';

  errorMessage = '';

  @ViewChild('closeDeleteModal') btnCloseDeleteModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openDeleteModal') btnOpenDeleteModal!: ElementRef<HTMLButtonElement>;

  constructor(
    private queryDbService: QueryDbService,
    private validateService: ValidateService,
    private messageService: MessageService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getData();
    this.openNav();
  }

  onSearch() {
    this.loading = true;
  }

  onSidebar(value: boolean) {
    if (value) {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  openNav() {
    document.getElementById("mySidebar")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
    this.isOpened = true;
  }

  closeNav() {
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft = "0";
    this.isOpened = false;
  }

  onActionOption(rowInfo: OutputType<TopicForRandomSimulator>) {
    this.subjectSelected = {...rowInfo.rowData}
    if (rowInfo.type === 'delete') {
      this.loading = true;

    }

    if (rowInfo.type === 'edit') {
      this.submited = false;
      this.btnOpenModal.nativeElement.click();
    }


  }

  onSaveTopic(){
    const topicFound = this.data.topics.find(t => t.topicId == this.subjectSelected.topicId);

    if (this.subjectSelected.topicId == '' || this.subjectSelected.numberOfQuestions == 0
      || this.subjectSelected.numberOfQuestions.toString() == ''){
      this.errorMessage = 'El campo es requerido';
      this.submited = true;
      return;
    }

    if (topicFound && this.subjectSelected.topicName == ''){
      this.errorMessage = 'El tema seleccionado ya existe';
      this.subjectSelected.topicId = '';
      this.submited = true;
      return;
    }

    //const topicCheck = this.topics.find(t => t.id == this.subjectSelected.topicId);
    if (this.subjectSelected.numberOfQuestions > 10){
      this.errorMessage = 'El máximo de preguntas es 10';
      this.subjectSelected.numberOfQuestions = null;
      this.submited = true;
      return;
    }

    const {id, ...rest} = this.data;
    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    if (this.subjectSelected.topicName == ''){
      rest.topics.push({topicId: this.subjectSelected.topicId, numberOfQuestions: this.subjectSelected.numberOfQuestions});
    }else{
      rest.topics = rest.topics.map(t => {
        if (t.topicId == this.subjectSelected.topicId){
         return {topicId: t.topicId, numberOfQuestions: this.subjectSelected.numberOfQuestions};
        }
        return {topicId: t.topicId, numberOfQuestions: t.numberOfQuestions};
      })
    }
    this.updateData(id, rest);
  }

  onActionEdit(event: TopicForRandomSimulator){
    this.subjectSelected = {...event};
    this.btnOpenModal.nativeElement.click();
  }
  onActionDelete(event: TopicForRandomSimulator){
    this.deletedId = event.topicId;
    this.btnOpenDeleteModal.nativeElement.click();
  }
  onAddRegister() {
    this.submited = false;
    this.subjectSelected = {
      topicId: '',
      topicName: '',
      numberOfQuestions: 10
    }
    this.btnOpenModal.nativeElement.click();
  }

  onConfirmDelete(){
    this.loading = true;
    this.data.topics = this.data.topics.filter(i => i.topicId != this.deletedId);
    const {id, ...rest} = this.data;
    this.btnCloseDeleteModal.nativeElement.click();
    this.updateData(id, rest);
  }

  private updateData(id, rest){
    this.queryDbService.updateDoc('random-simulator', id, rest).subscribe(()=>{
      this.data = {...rest};
      this.data.id = id;
      this.data.topics.map(t => {
        t.topicName = this.topics.find(tF => tF.id == t.topicId).title;
        return t;
      })
      this.loading = false;
      this.deletedId = '';
      this.submited = false;
    });
  }

  getData() {
    this.loading = true;
    this.queryDbService.getCollections(['random-simulator', 'areas']).subscribe(data => {
      const dataRS = data[0] as RandomSimulator[];
      this.data = dataRS[0];
      this.topics = (data[1] as Area[]);
      this.data.topics.map(t => {
        t.topicName = this.topics.find(tF => tF.id == t.topicId).title;
        return t;
      })
      this.loading = false;
    });
  }

  onChangeRadio(value: boolean) {
    this.data.isActive = value;
  }

  onSave() {
    Object
      .keys(this.data)
      .forEach(k =>
        this.data[k] = typeof this.data[k] == 'string' ? this.data[k].trim() : this.data[k]);
    const {id, ...rest} = this.data;
    if (!this.validateService.object(rest, ['description', 'title', 'imgUrl', 'instructions'])) {
      this.submited = true;
      return;
    }
    this.loading = true;

    this.queryDbService.updateDoc('random-simulator', id, rest).subscribe(()=>{
      this.loading = false;
      this.showToast('success', 'Información', 'Dato creado correctamente');
    });

  }


  showToast(
    severity = 'success',
    summary = 'Acción realizada',
    detail = 'Acción realizada') {
    this.messageService.add(
      {
        severity,
        summary,
        detail
      });
  }



}
