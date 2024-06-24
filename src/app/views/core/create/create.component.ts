import { Component, inject } from '@angular/core';
import {
  Validators,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
  FormBuilder,
} from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Bicycle } from '../../../models/bicycle.model';
import { UserService } from '../../../services/user.service';
import { BicycleService } from '../../../services/bicycle.service';
import { Router } from '@angular/router';
import { DialogBoxComponent } from '../../../components/shared/dialog-box/dialog-box.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { CookieService } from 'ngx-cookie-service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { HeaderComponent } from '../../../components/shared/header/header.component';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOption,
    CommonModule,
    MatSelect,
    HeaderComponent,
  ],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss',
})
export class CreateComponent {
  userService = inject(UserService);
  bicycleService = inject(BicycleService);
  cookieService = inject(CookieService);
  router = inject(Router);
  dialog = inject(MatDialog);
  fb = inject(FormBuilder);

  firstFormGroup: FormGroup = this.fb.group({
    title: ['', Validators.required],
    model: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', Validators.required],
    size: ['', Validators.required],
  });
  secondFormGroup: FormGroup = this.fb.group({
    address: ['', Validators.required],
    city: ['', Validators.required],
    state: ['', Validators.required],
  });
  thirdFormGroup: FormGroup = this.fb.group({
    image: [''],
  });

  bicycle: Bicycle | null = null;

  ngOnInit() {
    const id = this.cookieService.get('JUID');
    this.userService.getItem(id).subscribe((data) => {
      if (data.cards.length <= 0) {
        const dialogRef: MatDialogRef<any> = this.dialog.open(
          DialogBoxComponent,
          {
            data: {
              title: 'Oops!',
              message:
                'In order to publish a bicycle you need to add a payment method first.',
            },
          }
        );
        this.router.navigate(['/profile']);
      }
    });
  }

  onSubmit() {
    const id = this.cookieService.get('JUID');
    if (!this.validateForms()) {
      const dialogRef: MatDialogRef<any> = this.dialog.open(
        DialogBoxComponent,
        {
          data: {
            title: 'Oops!',
            message: 'Please fill out all the fields',
          },
        }
      );
      return;
    }

    this.validateForm1();

    this.bicycle = {
      id: 0,
      bicycleName: this.firstFormGroup.get('title')?.value,
      bicycleDescription: this.firstFormGroup.get('description')?.value,
      bicyclePrice: this.firstFormGroup.get('price')?.value,
      bicycleSize: this.firstFormGroup.get('size')?.value,
      bicycleModel: this.secondFormGroup.get('model')?.value,
      imageData: this.thirdFormGroup.get('image')?.value,
      temperature: 0,
      velocity: 0,
      latitude: -12,
      longitude: -77,
    };

    this.bicycleService
      .createItem(Number(id), this.bicycle)
      .subscribe((data) => {
        const dialogRef: MatDialogRef<any> = this.dialog.open(
          DialogBoxComponent,
          {
            data: {
              title: 'Success!',
              message: 'Your bicycle has been published',
            },
          }
        );
        this.router.navigate(['/search']);
      });

    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.thirdFormGroup.reset();
  }

  validateForms() {
    if (
      this.firstFormGroup.valid &&
      this.secondFormGroup.valid &&
      this.thirdFormGroup.valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  validateForm1() {
    if (this.firstFormGroup.get('title')?.value.length > 50) {
      alert('The bicycle title needs to be shorter');
      return;
    }
    if (this.firstFormGroup.get('price')?.value > 1000000) {
      alert('Put a reasonable price for the bicycle');
      return;
    }
    if (this.firstFormGroup.get('price')?.value <= 0) {
      alert('Put a reasonable price for the bicycle');
      return;
    }
  }
}
