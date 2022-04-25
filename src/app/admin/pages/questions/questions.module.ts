import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionsRoutingModule } from './questions-routing.module';
import {QuestionsComponent} from "./questions.component";
import {SharedModule} from "../../../shared/shared.module";
import {HeaderComponent} from "../../components/header/header.component";
import {ToastModule} from "primeng/toast";
import {AdminModule} from "../../admin.module";
import {QuillModule} from "ngx-quill";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    QuestionsComponent
  ],
  imports: [
    CommonModule,
    QuestionsRoutingModule,
    SharedModule,
    ToastModule,
    AdminModule,
    QuillModule.forRoot({
      modules: {
        toolbar: {
          handlers: {}
        }
      }
    }),
    FormsModule
  ]
})
export class QuestionsModule { }
