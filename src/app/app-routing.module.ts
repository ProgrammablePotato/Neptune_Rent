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
import { AboutUsComponent } from './about-us/about-us.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ErrorComponent } from './error/error.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { EditorMenuComponent } from './editor-menu/editor-menu.component';
import { VerifymailComponent } from './verifymail/verifymail.component';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'user', component: UserComponent, canActivate:[loggedUserGuard]},
  {path: 'cart/:id', component: CartComponent, canActivate:[loggedUserGuard]},
  {path: 'admin', component: AdminComponent, canActivate:[adminGuard],
    children:[
    {path: 'editormenu', component: EditorMenuComponent, canActivate:[adminGuard]},
    {path: 'usereditor', component: UserEditorComponent, canActivate:[adminGuard]}
  ]},
  {path: 'producteditor/:category/:id', component: ProductEditorComponent, canActivate:[adminGuard]},
  {path: 'products/:category', component: ProductsComponent, pathMatch:'prefix'},
  {path: 'aboutus', component: AboutUsComponent},
  {path: 'details/:category/:id', component: ProductDetailsComponent},
  {path: 'verifymail', component:VerifymailComponent},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
