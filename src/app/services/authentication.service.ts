import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const TOKEN_KEY='auth_token';
/*

ADDING AUTHENTICATION PROVIDER AND GUARD

This service will handle the login/logout and in our case perform just dummy operations.

Normally you would send the credentials to your server and then get something like a token 
Back. In our case we skip that part and directly store a token inside the Ionic Storage. 
Then we use our BehaviorSubject to tell everyone that the user is now authenticated.

Other pages can subscribe to this authenticationState or check if the user is authenticated
using the current value of the Subject.

Although we don’t have any real Server attached, the logic and flow is nearly the same 
so you could use this as a base for your own authentication class.


*/
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);
  /*
   We have added a check to the constructor so we look for a stored token once the 
  app starts.
   By doing this, we can automatically change the authentication state if the user was 
  previously logged in. In a real scenario you could add an expired check here.
  */
  constructor(private storage:Storage, private platform:Platform) { 
    this.platform.ready().then(() => {
      this.checkToken();
    });

  }

  login(){
    return this.storage.set(TOKEN_KEY, 'Bearer 1234567').then(() => {
      this.authenticationState.next(true);
    });
  }

  logout(){
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
    });

  }

  isAuthenticated(){
    return this.authenticationState.value;
  }

  checkToken() {
    this.storage.get(TOKEN_KEY).then(res => {
      if (res) {
        this.authenticationState.next(true);
      }
    })
  }


}
