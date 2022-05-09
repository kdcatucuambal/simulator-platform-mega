import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {LayoutSiteComponent} from "./components/layout-site/layout-site.component";
import {PracticeComponent} from "./pages/practice/practice.component";
import {TestComponent} from "./components/test/test.component";
import {SimulatorComponent} from "./pages/simulator/simulator.component";
import {LayoutSimulatorComponent} from "./components/layout-simulator/layout-simulator.component";
import {RegisterComponent} from "./pages/register/register.component";
import {ResetPasswordComponent} from "./pages/reset-password/reset-password.component";
import {AuthGuard} from "../guards/auth.guard";
import {SimulatorsInfoComponent} from "./pages/simulators-info/simulators-info.component";
import {ProfileComponent} from "./pages/profile/profile.component";



const routes: Routes = [
  {
    path: '',
    redirectTo: '/inicio',
    pathMatch: 'full'
  },
  {
    path: 'site',
    component: LayoutSiteComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'login',
        component: LoginComponent
      }
    ]
  },
  {
    path: 'inicio',
    component: HomeComponent
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
    path: 'login',
    component: LoginComponent
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
