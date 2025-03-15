import { AuthService } from './auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SortPipe } from './sort.pipe';
import { AboutUsComponent } from './about-us/about-us.component';
import { AccessoriesComponent } from './accessories/accessories.component';
import { AdminComponent } from './admin/admin.component';
import { CartComponent } from './cart/cart.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { LaptopsComponent } from './laptops/laptops.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PcsComponent } from './pcs/pcs.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { EditorMenuComponent } from './editor-menu/editor-menu.component';
import { RegisterComponent } from './register/register.component';
import { ServersComponent } from './servers/servers.component';
import { ServicesComponent } from './services/services.component';
import { UserComponent } from './user/user.component';
import { UserEditorComponent } from './user-editor/user-editor.component';
import { FooterComponent } from './footer/footer.component';
import { environment } from './environments/environments';
import { AngularFireModule } from '@angular/fire/compat';

@NgModule({
  declarations: [
    AppComponent,
    SortPipe,
    AboutUsComponent,
    AccessoriesComponent,
    AdminComponent,
    CartComponent,
    ErrorComponent,
    HomeComponent,
    LaptopsComponent,
    LoginComponent,
    NavbarComponent,
    PcsComponent,
    ProductDetailsComponent,
    ProductEditorComponent,
    EditorMenuComponent,
    RegisterComponent,
    ServersComponent,
    ServicesComponent,
    UserComponent,
    UserEditorComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FormsModule,
  ],
  providers: [provideHttpClient(),AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
