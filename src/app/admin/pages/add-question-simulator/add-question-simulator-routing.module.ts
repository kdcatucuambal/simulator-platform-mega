import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddQuestionSimulatorComponent} from "./add-question-simulator.component";

const routes: Routes = [
  {
    path: ':id',
    component: AddQuestionSimulatorComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddQuestionSimulatorRoutingModule { }
