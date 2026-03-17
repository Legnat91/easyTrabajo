import {Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})

export default class Login {
  private fb=inject(FormBuilder);
  private authService=inject(AuthService);

  public errorLogin=signal(false);
  //IMPORTANTE quitar
  public loginForm=this.fb.group({
    email:['admin@easyparte.com',[Validators.required,Validators.email]],
    password:['1234',[Validators.required]]

  });

  iniciarSesion(){
    if(this.loginForm.invalid) return;
    const {email, password}=this.loginForm.value;

    const exito=this.authService.login(email!, password!);

    if(!exito){
      this.errorLogin.set(true);
    }
  }
 }
