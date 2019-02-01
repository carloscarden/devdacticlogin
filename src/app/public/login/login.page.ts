import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './../../services/authentication.service';
import { FormGroup, FormControl, Validators,FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';




@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  data = '';
  
  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

     // reset login status
     this.authService.logout();

     // reset login status
     this.authService.logout();

     // get return url from route parameters or default to '/'
     
     this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
     console.log(this.returnUrl);

  }
  get f() { return this.loginForm.controls; }

  onSubmit(){
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authService.login(this.f.username.value, this.f.password.value).pipe(first())
    .subscribe(
        data => {
           this.loading=false;
           this.error='';
           this.router.navigate(['/members/details']);
        },
        error => {
            this.error = error;
            this.loading = false;
        });;
  }

}
