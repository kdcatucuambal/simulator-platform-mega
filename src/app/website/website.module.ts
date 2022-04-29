import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WebsiteRoutingModule } from './website-routing.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CardComponent } from './components/card/card.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { TestComponent } from './components/test/test.component';
import {SharedModule} from "../shared/shared.module";
import { LayoutSiteComponent } from './components/layout-site/layout-site.component';
import { PracticeComponent } from './pages/practice/practice.component';
import {QuillModule} from "ngx-quill";
import { SetColorDirective } from './directives/set-color.directive';
import { QuestionCardComponent } from './components/question-card/question-card.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { SimulatorComponent } from './pages/simulator/simulator.component';
import { SidebarSimulatorComponent } from './components/sidebar-simulator/sidebar-simulator.component';
import { LayoutSimulatorComponent } from './components/layout-simulator/layout-simulator.component';


@NgModule({
  declarations: [
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    CardComponent,
    HeaderComponent,
    FooterComponent,
    CarouselComponent,
    TestComponent,
    LayoutSiteComponent,
    PracticeComponent,
    SetColorDirective,
    QuestionCardComponent,
    PaginatorComponent,
    SimulatorComponent,
    SidebarSimulatorComponent,
    LayoutSimulatorComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    SharedModule,
    QuillModule.forRoot({
      modules: {
        toolbar: {
          handlers: {}
        }
      }
    })
  ]
})
export class WebsiteModule { }
