import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {QuillModules} from "ngx-quill";
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {AlertInfo, TitleInfo} from "../../../models/AreaModel";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
  providers: [MessageService]
})
export class AlertsComponent implements OnInit {

  quillSetting: QuillModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ font: [] }],
        [{ color: [] }, { background: [] }],
        [{ size: ['small', false, 'large', 'huge'] }],
        [{ script: 'sub'}, { script: 'super' }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ align: [] }],
        ['link'],
        ['clean']
      ],
    }
  }

  loading =  false;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;

  columns: Column[] = [
    {header: 'Código', field: 'id',type: 'text'},
    {header: 'Valor', field: 'withoutFormat', type: 'text'},
    {header: 'Estado', field: 'isActive', type: 'html-active'}
  ];

  selected: AlertInfo = {
    id: '',
    isActive: true,
    value: '',
    withoutFormat: '',
    severity: ''
  }



  data: AlertInfo[] = [];
  titleModal = 'Nuevo registro';

  constructor(
    private queryDbService: QueryDbService,
    private validateService: ValidateService,
    private messageService: MessageService
  ) { }


  ngOnInit(): void {
    this.getData();
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

  onActionOption(rowInfo: OutputType<AlertInfo>){
    this.selected = {...rowInfo.rowData}
    this.submited = false;
    this.titleModal = 'Editar registro';
    this.btnOpenModal.nativeElement.click();
  }

  onChangeRadio(value: boolean){
    this.selected.isActive = value;
  }

  onSave(){
    Object
      .keys(this.selected)
      .forEach(k =>
        this.selected[k] = typeof this.selected[k] == 'string' ? this.selected[k].trim() : this.selected[k]);
    const {id, ...rest} = this.selected;
    if (!this.validateService.object(rest, ['value'])){
      this.submited = true;
      return;
    }
    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    rest.withoutFormat = this.validateService.htmlToText(rest.value);
    this.queryDbService
      .updateDoc('alerts', `${id}`, rest)
      .subscribe(()=>{
        this.data = this.data.map(item=>{
          if (item.id == id){
            return {
              ...this.selected,
              withoutFormat: rest.withoutFormat
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

  showToast(severity = 'success', summary = 'Acción realizada',  detail = 'Acción realizada'){
    this.messageService.add(
      {
        severity,
        summary,
        detail
      });
  }

  getData(){
    this.loading = true;
    this.queryDbService.getAllDocs<AlertInfo>('alerts')
      .subscribe(data=>{
        this.data = data;
        this.loading = false;
      })
  }

}
