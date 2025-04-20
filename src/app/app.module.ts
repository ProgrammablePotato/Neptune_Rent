import { AuthService } from './auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SortPipe } from './sort.pipe';
import { AboutUsComponent } from './about-us/about-us.component';
import { AdminComponent } from './admin/admin.component';
import { CartComponent } from './cart/cart.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { EditorMenuComponent } from './editor-menu/editor-menu.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { FooterComponent } from './footer/footer.component';
import { environment } from './environments/environments';
import { AngularFireModule } from '@angular/fire/compat';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { VerifymailComponent } from './verifymail/verifymail.component';
import { SearchPipe } from './search.pipe';
import { ProductsComponent } from './products/products.component';

@NgModule({
  declarations: [
    AppComponent,
    SortPipe,
    AboutUsComponent,
    AdminComponent,
    CartComponent,
    ErrorComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    ProductDetailsComponent,
    ProductEditorComponent,
    EditorMenuComponent,
    RegisterComponent,
    UserComponent,
    UserEditorComponent,
    FooterComponent,
    VerifymailComponent,
    SearchPipe,
    ProductsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [provideHttpClient(),AuthService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
