import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {LoginComponent} from "./pages/login/login.component";
import {LayoutSiteComponent} from "./components/layout-site/layout-site.component";
import {PracticeComponent} from "./pages/practice/practice.component";
import {TestComponent} from "./components/test/test.component";
import {SimulatorComponent} from "./pages/simulator/simulator.component";
import {LayoutSimulatorComponent} from "./components/layout-simulator/layout-simulator.component";

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // },
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
      },
      {
        path: 'practice/:id',
        component: PracticeComponent
      }
    ]
  },
  {
    path: 'simulator',
    component: LayoutSimulatorComponent,
    children: [
      {
        path: ':id',
        component: SimulatorComponent
      }
    ]
  },
  {
    path: 'testing',
    component: TestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WebsiteRoutingModule { }
