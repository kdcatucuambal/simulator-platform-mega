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
    LayoutSiteComponent
  ],
  imports: [
    CommonModule,
    WebsiteRoutingModule,
    SharedModule
  ]
})
export class WebsiteModule { }