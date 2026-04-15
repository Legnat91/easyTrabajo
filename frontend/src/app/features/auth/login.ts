import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { email } from '@angular/forms/signals';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})

export default class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  public errorLogin = signal(false);

  public loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]

  });

  async iniciarSesion() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;

    const exito = await this.authService.login(email!, password!);

    if (!exito) {
      this.errorLogin.set(true);
    } else {
      this.errorLogin.set(false);
    }
  }

}
