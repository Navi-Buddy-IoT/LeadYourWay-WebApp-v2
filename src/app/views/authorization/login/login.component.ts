import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  fb = inject(FormBuilder);
  htpp = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);
  userService = inject(UserService);
  cookieService = inject(CookieService);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  onSubmit(): void {
    this.clearCookies();
    if (!this.validateForm()) {
      alert('Form is invalid');
      return;
    }
    const rawForm = this.form.getRawValue();
    this.authService.login(rawForm.email, rawForm.password).subscribe(
      (response) => {
        this.cookieService.set('JUID', response.user.uid, 1, '/');
        this.cookieService.set('JSESSIONID', response.user.accessToken, 1, '/');
        this.router.navigate(['/home']);
      },
      (error) => {
        alert('Looks like you do not have an account. Please sign up instead.');
        this.router.navigate(['/signup']);
      }
    );
  }

  validateForm(): boolean {
    const rawForm = this.form.getRawValue();
    if (
      rawForm.email === '' ||
      rawForm.password === '' ||
      rawForm.password.length < 6
    ) {
      return false;
    }
    return true;
  }

  clearCookies() {
    this.cookieService.delete('JUID');
    this.cookieService.delete('JSESSIONID');
  }
}
