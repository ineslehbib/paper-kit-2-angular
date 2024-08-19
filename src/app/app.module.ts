import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { Routes } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { ExamplesModule } from './examples/examples.module';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';

import { HttpClientModule } from '@angular/common/http';
import { TypographyComponent } from './components/typography/typography.component';
import { ThousandsSeparatorPipe } from './components/pipes/thousands-separator.pipe';

const routes: Routes = [
  { path: 'CRM/:id/:quest/:formulaire', component: QuestionnaireComponent },
  { path: 'CRM/terminé', component: TypographyComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
     
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    ComponentsModule,
    ExamplesModule,
    AppRoutingModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
