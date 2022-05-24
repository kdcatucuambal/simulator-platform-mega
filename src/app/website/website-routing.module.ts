import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {LayoutSiteComponent} from "./components/layout-site/layout-site.component";
import {PracticeComponent} from "./pages/practice/practice.component";
import {SimulatorComponent} from "./pages/simulator/simulator.component";
import {LayoutSimulatorComponent} from "./components/layout-simulator/layout-simulator.component";
import {RegisterComponent} from "./pages/register/register.component";
import {ResetPasswordComponent} from "./pages/reset-password/reset-password.component";
import {AuthGuard} from "../guards/auth.guard";
import {SimulatorsInfoComponent} from "./pages/simulators-info/simulators-info.component";
import {ProfileComponent} from "./pages/profile/profile.component";
import {ResultsComponent} from "./pages/results/results.component";
import {TestComponent} from "./components/test/test.component";
import {GuardLoginGuard} from "../guards/guard-login.guard";
import {ExercisesComponent} from "./pages/exercises/exercises.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: '',
    component: LayoutSiteComponent,
    children: [
      {
        path: 'inicio',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [GuardLoginGuard]
      },
      {
        path: 'practicar/:id',
        component: PracticeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'registro',
        component: RegisterComponent,
        canActivate: [GuardLoginGuard]
      },
      {
        path: 'restablecer-clave',
        component: ResetPasswordComponent,
        canActivate: [GuardLoginGuard]
      },
      {
        path: 'nuestros-simuladores',
        component: SimulatorsInfoComponent
      },
      {
        path: 'perfil',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'ejercicios',
        component: ExercisesComponent
      }
    ]
  },

  {
    path: 'resultados',
    component: ResultsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'simulador',
    component: LayoutSimulatorComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id/:random',
        component: SimulatorComponent
      }
    ]
  },
  {
    path: 'test',
    component: TestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
