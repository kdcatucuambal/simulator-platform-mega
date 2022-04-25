import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import {TableModule} from "primeng/table";
import {ToolbarModule} from "primeng/toolbar";
import {FormsModule} from "@angular/forms";
import { CutTextPipe } from './pipes/cut-text.pipe';
import {LoaderComponent} from "./components/loader/loader.component";



@NgModule({
  declarations: [
    TableComponent,
    CutTextPipe,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    TableModule,
    ToolbarModule,
    FormsModule
  ],
  exports: [
    TableComponent,
    LoaderComponent,
    CutTextPipe
  ]
})
export class SharedModule { }
