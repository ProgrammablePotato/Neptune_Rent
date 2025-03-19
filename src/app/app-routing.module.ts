import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { loggedUserGuard } from './logged-user.guard';
import { CartComponent } from './cart/cart.component';
import { AdminComponent } from './admin/admin.component';
import { adminGuard } from './admin.guard';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { PcsComponent } from './pcs/pcs.component';
import { LaptopsComponent } from './laptops/laptops.component';
import { ServersComponent } from './servers/servers.component';
import { AccessoriesComponent } from './accessories/accessories.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ServicesComponent } from './services/services.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ErrorComponent } from './error/error.component';
import { UserEditorComponent } from './user-editor/user-editor.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: UserComponent, canActivate:[loggedUserGuard]},
  {path: 'cart/:id', component: CartComponent, canActivate:[loggedUserGuard]},
  {path: 'admin', component: AdminComponent, canActivate:[adminGuard], children:[{path: 'prodeditor', component: ProductEditorComponent, canActivate:[adminGuard]},
    {path: 'uview', component: UserEditorComponent, canActivate:[adminGuard]},
    {path: 'prodeditorr/:category/:id', component: ProductEditorComponent, canActivate:[adminGuard]}]},
  {path: 'pcs', component: PcsComponent},
  {path: 'laptops', component: LaptopsComponent},
  {path: 'servers', component: ServersComponent},
  {path: 'accessories', component: AccessoriesComponent},
  {path: 'aboutus', component: AboutUsComponent},
  {path: 'services', component: ServicesComponent},
  {path: 'details/:category/:id', component: ProductDetailsComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
