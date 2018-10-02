import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AccessService } from '../../core/services/access.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userForm = this.fb.group({
    username: ['',
      [ Validators.required, Validators.pattern('[^ @]*@[^ @]*') ]],
    password: ['',
      [ Validators.required, Validators.minLength(8) ]]
  });
  errorMsg: string;
  showError = false;

  constructor(
    private accessService: AccessService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    console.log(`Form status: (${this.userForm.valid}) ${this.userForm.value}`)
    if (this.userForm.valid) {
      const user: User = {
        username: this.userForm.value.username,
        password: this.userForm.value.password
      };
      this.accessService.login(user)
        .then(() => this.router.navigate(['/home']))
        .catch((err) => {
          this.showError = true;
          this.errorMsg = err.error.error_description;
          console.log(err);
        });
    } else {
      this.showError = true;
      this.errorMsg = `Invalid form value`;
    }
  }

  onCloseError() {
    this.showError = false;
  }

  onReset() {
    this.userForm.reset();
  }
}
