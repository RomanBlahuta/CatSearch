import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgxsModule } from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from "@ngxs/devtools-plugin";
import {MatButton} from "@angular/material/button";
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {AppState} from "./store/app.state";
import {HttpClientModule} from "@angular/common/http";
import {MatCheckbox} from "@angular/material/checkbox";
import { ReactiveFormsModule } from '@angular/forms';
import {NgOptimizedImage} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    NgxsModule.forRoot([AppState], {developmentMode: /** !environment.production */ false}),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    MatButton,
    MatTabGroup,
    MatTab,
    MatCard,
    MatCardContent,
    MatCardTitle,
    MatLabel,
    MatInput,
    MatFormField,
    MatCheckbox,
    NgOptimizedImage,
    MatProgressSpinner,
  ],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
