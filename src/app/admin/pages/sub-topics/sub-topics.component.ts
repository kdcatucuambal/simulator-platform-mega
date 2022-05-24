import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {Area, SubTopicInfo} from "../../../models/Models";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-sub-topics',
  templateUrl: './sub-topics.component.html',
  styleUrls: ['./sub-topics.component.scss'],
  providers: [MessageService]
})
export class SubTopicsComponent implements OnInit {

  loading =  false;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;
  columns: Column[] = [
    {header: 'Código', field: 'id',type: 'text'},
    {header: 'Subtema', field: 'subtopic', type: 'text'},
    {header: 'Temario', field: 'topicName', type: 'text'},
    {header: 'Estado', field: 'isActive', type: 'html-active'}
  ];

  selected: SubTopicInfo = {
    id: '',
    isActive: true,
    topicId: '',
    subtopic: '',
    topicName: ''
  }

  search = '';
  data: SubTopicInfo[] = [];
  areas: Area[] = [];
  titleModal = 'Nuevo subtema';


  constructor(
    private queryDbService: QueryDbService,
    private validateService: ValidateService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getData();
  }

  onSearch(){
    this.loading = true;
  }

  onSidebar(value: boolean){
    if (value){
      this.openNav();
    }else{
      this.closeNav();
    }
  }

  openNav(){
    document.getElementById("mySidebar")!.style.width = "250px";
    document.getElementById("main")!.style.marginLeft = "250px";
  }

  closeNav(){
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft= "0";
  }

  onActionOption(rowInfo: OutputType<SubTopicInfo>){
    this.selected = {...rowInfo.rowData}
    if (rowInfo.type === 'delete'){
      this.loading = true;
      this.queryDbService
        .deleteDoc('subtopics',`${rowInfo.rowData.id}`)
        .subscribe(()=>{
          this.data = this.data.filter(item=> item.id != rowInfo.rowData.id);
          this.loading = false;
          this.showToast('success', 'Información', 'Dato eliminado correctamente');
        })
    }else{
      this.submited = false;
      this.titleModal = 'Editar registro';
      this.btnOpenModal.nativeElement.click();
    }
  }

  onAddRegister(){
    this.selected = {
      id: '',
      isActive: true,
      topicId: '',
      subtopic: '',
      topicName: ''
    };
    this.submited = false;
    this.titleModal = 'Nuevo subtema';
    this.btnOpenModal.nativeElement.click();
  }

  getData(){
    this.loading = true;
    this.queryDbService.getCollections(['subtopics', 'areas'])
      .subscribe(data => {
        this.areas = data[1] as Area[];
        this.data = data[0] as SubTopicInfo[];
        this.loading = false;
      });
  }

  onChangeRadio(value: boolean){
    this.selected.isActive = value;
  }

  onSave(){
    const areaFound = this.getAreaById(this.selected.topicId);
    this.selected.topicName = areaFound ? areaFound.title : '';
    Object
      .keys(this.selected)
      .forEach(k =>
        this.selected[k] = typeof this.selected[k] == 'string' ? this.selected[k].trim() : this.selected[k]);
    const {id, ...rest} = this.selected;

    if (!this.validateService.object(rest, ['subtopic', 'topicId', 'topicName'])){
      this.submited = true;
      return;
    }
    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    if (id == ''){
      this.queryDbService.addDoc('subtopics', rest)
        .subscribe((response)=>{
          this.data.push({
            id: response.id,
            ...rest
          });
          this.loading = false;
          this.showToast('success', 'Información', 'Dato creado correctamente');
        });
    }else{
      this.queryDbService
        .updateDoc('subtopics', `${id}`, rest)
        .subscribe(()=>{
          this.data = this.data.map(item=>{
            if (item.id == id){
              return {
                ...this.selected
              }
            }else{
              return item;
            }
          });
          this.loading = false;
          this.showToast(
            'success',
            'Información',
            'Dato actualizado correctamente');
        })
    }

  }

  onFilter(event: SubTopicInfo[]){
    this.data = event;
  }


  showToast(severity = 'success', summary = 'Acción realizada',  detail = 'Acción realizada'){
    this.messageService.add(
      {
        severity,
        summary,
        detail
      });
  }

  getAreaById(id: string): Area{
    return this.areas.find(item => item.id == id);
  }



}
