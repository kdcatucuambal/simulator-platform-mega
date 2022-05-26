import {Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';


export interface Column{
  field: string,
  header: string,
  type: 'text' | 'html-active'
}

export interface OutputType<T>{
  rowData: T,
  type: string
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input('columns') columns: Column[] = [];
  @Input('data') data: any[] = [];
  dataFiltered: any[] = [];
  @Input('title') title: string = '';
  @Input('rows') rows: number = 0;
  @Input('totalRecords') totalRecords: number = 0;
  @Output('onActionOption') onActionOption = new EventEmitter<OutputType<any>>();
  @Output('onAddRegister') onAddRegister = new EventEmitter();
  @Input('loading') loading = false;
  @ViewChild('closeDeleteModal') btnCloseDeleteModal!: ElementRef<HTMLButtonElement>;
  @ViewChild('openDeleteModal') btnOpenDeleteModal!: ElementRef<HTMLButtonElement>;
  @Input('fieldsToFilter') fieldsToFilter: string[] = [];
  @Input('fieldId') fieldId: string = '';
  @Input('canDelete') canDelete = true;
  @Input('canAdd') canAdd = true;
  @Input('canEdit') canEdit = true;
  @Input('canSetting') canSetting = false;
  @Input('canView') canView = false;
  @Input('canReset') canReset = false;
  @Input('showSearch') showSearch = true;
  search: string = '';
  itemRef: any = null;
  isFilter = false;


  constructor() { }

  ngOnInit(): void {
    console.log(this.data)
  }

  onSearch(){

  }

  onAction<T>(rowData: T, type: string){
    if (type == 'delete'){
      this.itemRef = rowData;
      this.btnOpenDeleteModal.nativeElement.click();
    }else{
      this.onActionOption.emit({type, rowData});
    }
  }

  onFilter(){
    const dataFiltered: any[] = [];
    this.loading = true;
    for (const item of this.data) {
      for (const field of this.fieldsToFilter) {
        if(item[field].toLowerCase().indexOf(this.search.toLowerCase()) > -1){
          const dataFound = dataFiltered.find(i => i[this.fieldId].toString() == item[this.fieldId].toString())
          if (!dataFound){
            dataFiltered.push(item);
          }
        }
      }
    }
    this.isFilter = true;
    this.dataFiltered = dataFiltered;
    this.totalRecords = dataFiltered.length;
    this.loading = false;
  }

  onKeyUp(){
    if (this.search === ''){
      this.loading = true;
      this.isFilter = false;
      this.dataFiltered = [];
      this.totalRecords = this.data.length;
      this.loading = false;
    }
  }

  onConfirm(){
    this.onActionOption.emit({type: 'delete', rowData: this.itemRef});
    this.btnCloseDeleteModal.nativeElement.click();
  }

  onRegister(){
    this.onAddRegister.emit();
  }

}
