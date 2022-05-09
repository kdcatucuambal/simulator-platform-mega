import {Component, OnInit} from '@angular/core';
import {ValidateService} from "../../../services/validate/validate.service";
import {AuthService} from "../../../services/firestore/auth.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  email = '';
  loading = false;
  submited = false;
  success = false;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
  }

  onResetPassword() {
    this.loading = true;
    this.email = this.email.trim();
    if (!this.validateService.validateEmail(this.email)) {
      this.submited = true;
      this.loading = false;
      this.email = '';
      return;
    }

    this.authService.resetPassword(this.email).subscribe({
      next: () => {
        this.loading = false;
        this.submited = false;
        this.success = true;
      },
      error: () => {
        this.loading = false;
        this.submited = false;
        this.success = true;
      }
    })

  }

}
