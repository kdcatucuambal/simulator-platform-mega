import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {CoursesComponent} from "./pages/courses/courses.component";
import {HomeComponent} from "./pages/home/home.component";
import {AreasComponent} from "./pages/areas/areas.component";
import {CarouselComponent} from "./pages/carousel/carousel.component";
import {TitlesComponent} from "./pages/titles/titles.component";
import {AlertsComponent} from "./pages/alerts/alerts.component";
import {SubTopicsComponent} from "./pages/sub-topics/sub-topics.component";
import {LayoutComponent} from "./components/layout/layout.component";
import {SimulatorsComponent} from "./pages/simulators/simulators.component";
import {ResourcesComponent} from "./pages/resources/resources.component";
import {AdminAuthGuard} from "../guards/admin-auth.guard";
import {RandomSimulatorComponent} from "./pages/random-simulator/random-simulator.component";
import {StudentsComponent} from "./pages/students/students.component";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'courses',
        component: CoursesComponent
      },
      {
        path: 'topics',
        component: AreasComponent
      },
      {
        path: 'carousel',
        component: CarouselComponent
      },
      {
        path: 'titles',
        component: TitlesComponent
      },
      {
        path: 'alerts',
        component: AlertsComponent
      },
      {
        path: 'sub-topics',
        component: SubTopicsComponent
      },
      {
        path: 'simulators',
        component: SimulatorsComponent
      },
      {
        path: 'students',
        component: StudentsComponent
      },
      {
        path: 'random-simulator',
        component: RandomSimulatorComponent
      },
      {
        path: 'resources',
        component: ResourcesComponent
      },
      {
        path: 'questions',
        loadChildren: () => import('./pages/questions/questions.module').then(m => m.QuestionsModule)
      },
      {
        path: 'simulator-setting',
        loadChildren: () => import('./pages/add-question-simulator/add-question-simulator.module').then(m => m.AddQuestionSimulatorModule)
      }
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
