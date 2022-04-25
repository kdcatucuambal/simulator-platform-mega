import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddQuestionSimulatorRoutingModule } from './add-question-simulator-routing.module';
import { AddQuestionSimulatorComponent } from './add-question-simulator.component';
import {AdminModule} from "../../admin.module";
import {PickListModule} from "primeng/picklist";
import {SharedModule} from "../../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import {TableModule} from "primeng/table";
import {DialogModule} from "primeng/dialog";
import {QuillModule} from "ngx-quill";
import {ToastModule} from "primeng/toast";
import {PanelModule} from "primeng/panel";


@NgModule({
  declarations: [
    AddQuestionSimulatorComponent
  ],
  imports: [
    CommonModule,
    AddQuestionSimulatorRoutingModule,
    AdminModule,
    PickListModule,
    SharedModule,
    FormsModule,
    TableModule,
    DialogModule,
    QuillModule.forRoot({
      modules: {
        toolbar: {
          handlers: {}
        }
      }
    }),
    ToastModule,
    PanelModule
  ]
})
export class AddQuestionSimulatorModule { }
