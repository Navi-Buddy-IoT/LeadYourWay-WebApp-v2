import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../../services/auth.service';
import { UserService } from '../../../services/user.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogBoxComponent } from '../../../components/shared/dialog-box/dialog-box.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  authService = inject(AuthService);
  cookieService = inject(CookieService);
  dialog = inject(MatDialog);

  form = this.fb.nonNullable.group({
    email: ['', Validators.required],
  });

  onSubmit(): void {
    this.clearCookies();
    if (!this.validateForm()) {
      alert('Form is invalid');
      return;
    }
    const rawForm = this.form.getRawValue();
    this.authService.forgotPassword(rawForm.email).subscribe(
      (response) => {
        const dialogRef: MatDialogRef<any> = this.dialog.open(
          DialogBoxComponent,
          {
            data: {
              title: 'Password Reset Email Sent',
              message:
                'An email has been sent to you with instructions on how to reset your password. Please check your email and follow the instructions provided',
            },
          }
        );
        this.router.navigate(['/login']);
      },
      (error) => {
        const dialogRef: MatDialogRef<any> = this.dialog.open(
          DialogBoxComponent,
          {
            data: {
              title: 'Password Reset Email Sent',
              message:
                'An email has been sent to you with instructions on how to reset your password. Please check your email and follow the instructions provided',
            },
          }
        );
        this.router.navigate(['/signup']);
      }
    );
    // this.authService.login(rawForm.email, rawForm.password).subscribe(
    //   (response) => {
    //     this.cookieService.set('JUID', response.user.uid, 1, '/');
    //     this.cookieService.set('JSESSIONID', response.user.accessToken, 1, '/');
    //     this.router.navigate(['/home']);
    //   },
    //   (error) => {
    //     alert('Looks like you do not have an account. Please sign up instead.');
    //     this.router.navigate(['/signup']);
    //   }
    // );
  }

  validateForm(): boolean {
    const rawForm = this.form.getRawValue();
    if (rawForm.email === '') {
      return false;
    }
    return true;
  }

  clearCookies() {
    this.cookieService.delete('JUID');
    this.cookieService.delete('JSESSIONID');
  }
}
