import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {TitleInfo} from "../../../models/Models";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-titles',
  templateUrl: './titles.component.html',
  styleUrls: ['./titles.component.scss'],
  providers: [MessageService]
})
export class TitlesComponent implements OnInit {

  loading =  false;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;
  columns: Column[] = [
    {header: 'Código', field: 'id',type: 'text'},
    {header: 'Título', field: 'value', type: 'text'}
  ];
  selected: TitleInfo = {
    id: '',
    info: '',
    type: '',
    value: ''
  }

  search = '';
  data: TitleInfo[] = [];
  titleModal = 'Nuevo registro';

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


  onActionOption(rowInfo: OutputType<TitleInfo>){
    this.selected = {...rowInfo.rowData}
      this.submited = false;
      this.titleModal = 'Editar registro';
      this.btnOpenModal.nativeElement.click();
  }

  getData(){
    this.loading = true;
    this.queryDbService.getAllDocs<TitleInfo>('titles')
      .subscribe(data=>{
        this.data = data;
        this.loading = false;
      })
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
    this.queryDbService
      .updateDoc('titles', `${id}`, rest)
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

  onFilter(event: TitleInfo[]){
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


}
