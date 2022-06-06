import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Column, OutputType} from "../table/table.component";
import {Table} from "primeng/table";

@Component({
  selector: 'app-lazy-table',
  templateUrl: './lazy-table.component.html',
  styleUrls: ['./lazy-table.component.scss']
})
export class LazyTableComponent implements OnInit {

  @Input('columns') columns: Column[] = [];
  @Input('data') data: any[] = [];
  dataFiltered: any[] = [];
  @Input('title') title: string = '';
  @Input('rows') rows: number = 0;
  @Input('totalRecords') totalRecords: number = 0;
  @Output('onActionOption') onActionOption = new EventEmitter<OutputType<any>>();
  @Output('onAddRegister') onAddRegister = new EventEmitter();
  @Output('onLazy') onLazy = new EventEmitter();
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


  @ViewChild('table') table: Table;

  constructor() { }

  ngOnInit(): void {

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

  loadData(event){
    this.onLazy.emit(event);
  }

  reset(){
    this.table.first = 0;
  }


}
