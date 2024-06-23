import { Routes } from '@angular/router';
import { SignupComponent } from './views/authorization/signup/signup.component';
import { LoginComponent } from './views/authorization/login/login.component';
import { HomeComponent } from './views/core/home/home.component';
import { ProfileComponent } from './views/core/profile/profile.component';
import { ReservationComponent } from './views/core/reservation/reservation.component';
import { CreateComponent } from './views/core/create/create.component';
import { PaymentComponent } from './views/core/payment/payment.component';
import { BicycleComponent } from './views/core/bicycle/bicycle.component';
import { ProfileEditComponent } from './views/core/profile-edit/profile-edit.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { authGuard } from './pipelines/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'signup', pathMatch: 'full' },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', canActivate: [authGuard], component: HomeComponent },
  // { path: 'home', component: HomeComponent },
  // { path: 'profile', canActivate: [authGuard], component: ProfileComponent },
  // {
  //   path: 'profile/edit',
  //   canActivate: [authGuard],
  //   component: ProfileEditComponent,
  // },
  // {
  //   path: 'reservation',
  //   canActivate: [authGuard],
  //   component: ReservationComponent,
  // },
  // { path: 'create-bike', canActivate: [authGuard], component: CreateComponent },
  // {
  //   path: 'payment-method',
  //   canActivate: [authGuard],
  //   component: PaymentComponent,
  // },
  // { path: 'bicycles', canActivate: [authGuard], component: BicycleComponent },
  { path: '**', component: PageNotFoundComponent },
];
