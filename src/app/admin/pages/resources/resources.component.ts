import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Column, OutputType} from "../../../shared/components/table/table.component";
import {FileInfo, StorageService} from "../../../services/firestore/storage.service";
import {ValidateService} from "../../../services/validate/validate.service";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrls: ['./resources.component.scss'],
  providers: [MessageService]
})
export class ResourcesComponent implements OnInit {

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
  selected: FileInfo = {
    id: '',
    name: '',
    description: '',
    url: '',
    title: '',
    isActive: true
  }

  file: File = null;

  search = '';

  data: FileInfo[] = [];
  isOpened = false;
  titleModal = 'Nuevo registro'

  constructor(
    private validateService: ValidateService,
    private messageService: MessageService,
    private storageService: StorageService
  ) {
  }

  ngOnInit(): void {
    this.getData();
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

  onChangeFile(event){
    const [file] = event.target.files as File[];
    this.file = file;
  }


  onActionOption(rowInfo: OutputType<FileInfo>) {
    this.selected = {...rowInfo.rowData}
    if (rowInfo.type === 'delete') {
      this.loading = true;

      this.storageService.deleteFile(this.selected.id, this.selected.name)
        .subscribe(()=>{
          this.data = this.data.filter(item => item.id != rowInfo.rowData.id);
          this.loading = false;
          this.showToast('success', 'Información', 'Dato eliminado correctamente');
        });

    } else {
      this.submited = false;
      this.titleModal = 'Editar registro';
      this.btnOpenModal.nativeElement.click();
    }
  }

  onAddRegister() {
    this.selected = {
      id: '',
      name: '',
      description: '',
      url: '',
      title: '',
      isActive: true
    };
    this.submited = false;
    this.titleModal = 'Nuevo registro';
    this.btnOpenModal.nativeElement.click();
  }

  getData() {
    this.loading = true;
    this.storageService.getAllFiles().subscribe(data => {
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

    if (!this.validateService.object(rest, ['description', 'title'])) {
      this.submited = true;
      return;
    }
    this.loading = true;
    this.btnCloseModal.nativeElement.click();
    if (id == '') {
      this.storageService.pushFile(this.file, rest).subscribe((response) => {
        this.data.push({
          id: response.id,
          ...rest
        });
        this.file = null;
        this.loading = false;
        this.showToast('success', 'Información', 'Dato creado correctamente');
      });
    } else {

      this.storageService.updateInfoFile(id, rest).subscribe(() => {
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
        this.file = null;
        this.showToast(
          'success',
          'Información',
          'Dato actualizado correctamente');
      });
    }

  }

  onFilter(event: FileInfo[]) {
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
