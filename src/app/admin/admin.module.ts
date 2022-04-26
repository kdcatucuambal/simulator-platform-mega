import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {AdminRoutingModule} from './admin-routing.module';
import {LoginComponent} from './pages/login/login.component';
import {HomeComponent} from './pages/home/home.component';
import {SharedModule} from "../shared/shared.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastModule} from 'primeng/toast';
import {CoursesComponent} from './pages/courses/courses.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {AreasComponent} from './pages/areas/areas.component';
import {CarouselComponent} from './pages/carousel/carousel.component';
import {TitlesComponent} from './pages/titles/titles.component';
import {AlertsComponent} from './pages/alerts/alerts.component';
import {QuillModule} from "ngx-quill";
import { AlertToBgPipe } from './pipes/alert-to-bg.pipe';
import { SubTopicsComponent } from './pages/sub-topics/sub-topics.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SimulatorsComponent } from './pages/simulators/simulators.component';

@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent,
    CoursesComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    AreasComponent,
    CarouselComponent,
    TitlesComponent,
    AlertsComponent,
    AlertToBgPipe,
    SubTopicsComponent,
    LayoutComponent,
    SimulatorsComponent
  ],
  exports: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    QuillModule.forRoot({
      modules: {
        toolbar: {
          handlers: {}
        }
      }
    })
  ]
})
export class AdminModule {
}