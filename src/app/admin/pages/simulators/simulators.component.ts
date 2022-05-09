import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {SimulatorInfo} from "../../../models/AreaModel";
import {QueryDbService} from "../../../services/firestore/query-db.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-simulators',
  templateUrl: './simulators.component.html',
  styleUrls: ['./simulators.component.scss'],
  providers: [MessageService]
})
export class SimulatorsComponent implements OnInit {

  loading = false;
  submited = false;
  @ViewChild('closeModal') btnCloseModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openModal') btnOpenModal!: ElementRef<HTMLButtonElement>;
  columns: Column[] = [
    {header: 'Código', field: 'id', type: 'text'},
    {header: 'Título', field: 'title', type: 'text'},
    {header: 'Descripción', field: 'description', type: 'text'},
    {header: 'Estado', field: 'isActive', type: 'html-active'}
  ];

  selected: SimulatorInfo = {
    id: '',
    description: '',
    title: '',
    isActive: true,
    imgUrl: '',
    textColor: '#000000',
    type: 'Simulador',
    backgroundColor: '#ffffff',
    instructions: '',
    minutes: 0,
    questions: ''
  };

  search = '';
  data: SimulatorInfo[] = [];
  isOpened = false;
  titleModal = 'Nuevo Simulador';

  types = ['Simulador', 'Mini-simulador'];

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

  onActionOption(rowInfo: OutputType<SimulatorInfo>) {
    this.selected = {...rowInfo.rowData}
    if (rowInfo.type === 'delete') {
      this.loading = true;
      this.queryDbService
        .deleteDoc('simulators', `${rowInfo.rowData.id}`)
        .subscribe(() => {
          this.data = this.data.filter(item => item.id != rowInfo.rowData.id);
          this.loading = false;
          this.showToast('success', 'Información', 'Dato eliminado correctamente');
        })
    }

    if (rowInfo.type === 'edit'){
      this.submited = false;
      this.titleModal = 'Editar Simulador';
      this.btnOpenModal.nativeElement.click();
    }

    if (rowInfo.type === 'redirect'){
      this.router.navigate(['/admin/simulator-setting', rowInfo.rowData.id]).then();
    }

  }

  onAddRegister() {
    this.selected = {
      id: '',
      description: '',
      title: '',
      isActive: true,
      imgUrl: '',
      textColor: '#000000',
      type: 'Simulador',
      backgroundColor: '#ffffff',
      instructions: '',
      minutes: 0,
      questions: ''
    };
    this.submited = false;
    this.titleModal = 'Nuevo Simulador';
    this.btnOpenModal.nativeElement.click();
  }

  getData() {
    this.loading = true;
    this.queryDbService.getAllDocs<SimulatorInfo>('simulators')
      .subscribe(data => {
        this.data = data;
        this.loading = false;
      })
  }

  onChangeRadio(value: boolean) {
    this.selected.isActive = value;
  }

  onSave() {
    Object
      .keys(this.selected)
      .forEach(k =>
        this.selected[k] = typeof this.selected[k] == 'string' ? this.selected[k].trim() : this.selected[k]);
    const {id, ...rest} = this.selected;

    if (!this.validateService.object(rest, ['description', 'title', 'imgUrl', 'instructions', 'type'])) {
      this.submited = true;
      return;
    }

    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    if (id == '') {
      this.queryDbService.addDoc('simulators', rest)
        .subscribe((response) => {
          this.data.push({
            id: response.id,
            ...rest
          });
          this.loading = false;
          this.showToast('success', 'Información', 'Dato creado correctamente');
        });
    } else {
      this.queryDbService
        .updateDoc('simulators', `${id}`, rest)
        .subscribe(() => {
          this.data = this.data.map(item => {
            if (item.id == id) {
              return {
                ...this.selected
              }
            } else {
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

  onFilter(event: SimulatorInfo[]) {
    this.data = event;
  }


  showToast(severity = 'success', summary = 'Acción realizada', detail = 'Acción realizada') {
    this.messageService.add(
      {
        severity,
        summary,
        detail
      });
  }
}
