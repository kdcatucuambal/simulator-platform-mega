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
        component: LoginComponent
      },
      {
        path: 'practicar/:id',
        component: PracticeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'registro',
        component: RegisterComponent
      },
      {
        path: 'restablecer-clave',
        component: ResetPasswordComponent
      },
      {
        path: 'nuestros-simuladores',
        component: SimulatorsInfoComponent
      },
      {
        path: 'perfil',
        component: ProfileComponent
      }
    ]
  },

  {
    path: 'resultados',
    component: ResultsComponent
  },
  {
    path: 'simulador',
    component: LayoutSimulatorComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':id',
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
