import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { ComponentsComponent } from './components/components.component';
import { ProfileComponent } from './examples/profile/profile.component';
import { SignupComponent } from './examples/signup/signup.component';
import { LandingComponent } from './examples/landing/landing.component';
import { NucleoiconsComponent } from './components/nucleoicons/nucleoicons.component';
import { QuestionnaireComponent } from './components/questionnaire/questionnaire.component';
import { TypographyComponent } from './components/typography/typography.component';
import { BasicelementsComponent } from './components/basicelements/basicelements.component';
const routes: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    children: [
      { path: 'home/:id/:quest/:formulaire', component: BasicelementsComponent },
      { path: 'terminé', component: TypographyComponent },
      { path: 'devis/:identifiant', component: NucleoiconsComponent },
      // Add more paths and components as needed
    ],
  }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: true
    })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
