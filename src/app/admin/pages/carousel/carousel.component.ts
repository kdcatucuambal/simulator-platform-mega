import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {CarouselInfo} from "../../../models/AreaModel";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";



@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  providers: [MessageService]
})
export class CarouselComponent implements OnInit {

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

  selected: CarouselInfo = {
    id: '',
    description: '',
    title: '',
    isActive: true,
    imgUrl: ''
  }

  search = '';
  data: CarouselInfo[] = [];
  titleModal = 'Nuevo título';

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



  onActionOption(rowInfo: OutputType<CarouselInfo>){
    this.selected = {...rowInfo.rowData}
    if (rowInfo.type === 'delete'){
      //todo: delete
      this.loading = true;
      this.queryDbService
        .deleteDoc('courses',`${rowInfo.rowData.id}`)
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
      description: '',
      title: '',
      isActive: true,
      imgUrl: '',

    };
    this.submited = false;
    this.titleModal = 'Nuevo registro';
    this.btnOpenModal.nativeElement.click();
  }

  getData(){
    this.loading = true;
    this.queryDbService.getAllDocs<CarouselInfo>('carousel')
      .subscribe(data=>{
        this.data = data;
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
      this.queryDbService.addDoc('carousel', rest)
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
        .updateDoc('carousel', `${id}`, rest)
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


  onFilter(event: CarouselInfo[]){
    this.data = event;
  }

  showToast(
    severity = 'success',
    summary = 'Acción realizada',
    detail = 'Acción realizada'){
    this.messageService.add(
      {
        severity,
        summary,
        detail
      });
  }

}
