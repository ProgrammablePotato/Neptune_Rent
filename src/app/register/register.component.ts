import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControlOptions, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup

  user: any

  constructor(private fb: FormBuilder, private auth:AuthService, private router:Router) {
    const formOptions: AbstractControlOptions = { validators: this.passwordsMatch }
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        passwordAgain: ['', Validators.required],
      },
      formOptions
    )
  }

  passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const group = control as FormGroup;
    const password = group.get('password')?.value;
    const passwordAgain = group.get('passwordAgain')?.value;
  
    return password === passwordAgain ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.registerForm.valid) {
      try {
        this.auth.registerUser(this.registerForm.value.email, this.registerForm.value.password);
        console.log('Form:', this.registerForm.value);
        this.registerForm.reset();
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      alert('Kérlek minden hibát javíts ki regisztráció előtt.');
    }
  }
}