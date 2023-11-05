import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FirstRunComponent } from './first-run/first-run.component';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
   schemas: [CUSTOM_ELEMENTS_SCHEMA],
   declarations: [AppComponent, FirstRunComponent],
   imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
   providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
   bootstrap: [AppComponent],
})
export class AppModule { }
