import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterLoginComponent } from './register-login/register-login.component';
import { RegisterComponent } from './register-login/register/register.component';
import { LoginComponent } from './register-login/login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ProviderConsumerListComponent } from './provider-consumer-list/provider-consumer-list.component';
import { AboutComponent } from './about/about.component';
import { ChatComponent } from './chat/chat.component';
import { AlertComponent } from './alert/alert.component';
import { EditTextComponent } from './edit-text/edit-text.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterLoginComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ProviderConsumerListComponent,
    AboutComponent,
    ChatComponent,
    AlertComponent,
    EditTextComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
