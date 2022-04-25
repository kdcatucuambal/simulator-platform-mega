import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {Area} from "../../../models/AreaModel";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-areas',
  templateUrl: './areas.component.html',
  styleUrls: ['./areas.component.scss'],
  providers: [MessageService]
})
export class AreasComponent implements OnInit {


  loading =  false;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;
  columns: Column[] = [
    {header: 'Código', field: 'id',type: 'text'},
    {header: 'Título', field: 'title', type: 'text'},
    {header: 'Descripción', field: 'description', type: 'text'},
    {header: 'Estado', field: 'isActive', type: 'html-active'}
  ];
  selected: Area = {
    id: '',
    description: '',
    title: '',
    isActive: true,
    imgUrl: '',
    textColor: '#000000',
    type: 'course',
    backgroundColor: '#ffffff'
  };
  search = '';
  areas: Area[] = [];
  color: any = '';
  isOpened = false;
  titleModal = 'Nuevo registro';

  constructor(
    private queryDbService: QueryDbService,
    private validateService: ValidateService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getAreas();
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
    this.isOpened = true;
  }

  closeNav(){
    document.getElementById("mySidebar")!.style.width = "0";
    document.getElementById("main")!.style.marginLeft= "0";
    this.isOpened = false;
  }

  onActionOption(rowInfo: OutputType<Area>){
    this.selected = {...rowInfo.rowData}
    if (rowInfo.type === 'delete'){
      //todo: delete
      this.loading = true;
      this.queryDbService
        .deleteDoc('areas',`${rowInfo.rowData.id}`)
        .subscribe(()=>{
          console.log('deleted')
          this.areas = this.areas.filter(item=> item.id != rowInfo.rowData.id);
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
      description: '',
      title: '',
      isActive: true,
      imgUrl: '',
      textColor: '#000000',
      type: 'course',
      backgroundColor: '#ffffff'
    };
    this.submited = false;
    this.titleModal = 'Nuevo registro';
    this.btnOpenModal.nativeElement.click();
  }

  getAreas(){
    this.loading = true;
    this.queryDbService.getAllDocs<Area>('areas')
      .subscribe(data=>{
        console.log(data)
        this.areas = data;
        this.loading = false;
      })
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

    if (!this.validateService.object(rest, ['description', 'title', 'imgUrl'])){
      this.submited = true;
      return;
    }
    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    if (id == ''){
      this.queryDbService.addDoc('areas', rest)
        .subscribe((response)=>{
          this.areas.push({
            id: response.id,
            ...rest
          });
          const collectionName = rest.title.toLowerCase().replace(" ", "_")
          this.loading = false;
          this.showToast('success', 'Información', 'Dato creado correctamente');
        });
    }else{
      this.queryDbService
        .updateDoc('areas', `${id}`, rest)
        .subscribe(()=>{
          this.areas = this.areas.map(item=>{
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

  onFilter(event: Area[]){
    console.log(event)
    this.areas = event;
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
