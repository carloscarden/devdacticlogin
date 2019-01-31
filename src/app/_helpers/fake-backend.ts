import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { User } from '../_models/User';
import { Inspeccion } from '../inspeccion';
import { AuthenticationService } from '../services/authentication.service';

/*
The fake backend provider enables the example to run without a backend / backendless,

It's implemented using the HttpInterceptor class that was introduced in Angular 4.3 as part of the new
HttpClientModule. By extending the HttpInterceptor class you can create a custom interceptor to modify 
http requests before they get sent to the server. In this case the FakeBackendInterceptor intercepts 
certain requests based on their URL and provides a fake response instead of going to the server.



*/
@Injectable()
export class FakeBackend implements HttpInterceptor{
    private inspeccionCollection:Inspeccion[] = [
        { id: 1, task: 'task1', priority: 1, createdAt: 1 },
        { id: 2, task: 'task2', priority: 2, createdAt: 3 },
        { id: 3, task: 'task3', priority: 3, createdAt: 4 },
        { id: 4, task: 'task4', priority: 4, createdAt: 5 },
        { id: 5, task: 'task5', priority: 5, createdAt: 6 }
      ];

    constructor(private authenticationService: AuthenticationService) { } 

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("Entra al fakeBackend");
        const users: User[] = [
            { id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }
        ];

        const authHeader = request.headers.get('Authorization');
        const isLoggedIn = authHeader && authHeader.startsWith('Bearer fake-jwt-token');

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {

            // authenticate - public
            if (request.url.endsWith('/users/authenticate') && request.method === 'POST') {
                console.log("El usuario es");
                const user = users.find(x => x.username === request.body.username && x.password === request.body.password);
                if (!user) return error('Username or password is incorrect');
                return ok({
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    token: `fake-jwt-token`
                });
            }

            // get ALL Inspecciones
            if (request.url.endsWith('/members/inspecciones') && request.method === 'GET') {
                if (!isLoggedIn) return unauthorised();
                return ok(this.inspeccionCollection);
            }

            // add Inspecciones
            if (request.url.endsWith('/members/inspecciones') && request.method === 'POST') {
                const inspeccionNueva = request.body.inspeccion;
                if (!isLoggedIn) return unauthorised();
                this.inspeccionCollection.push(inspeccionNueva);
                return ok("Nueva Inspeccion Agregada");
            }

            // delete Inspecciones
            if (request.url.endsWith('/members/inspecciones/delete') && request.method === 'POST') {
                if (!isLoggedIn) return unauthorised();
                const inspeccionIndex = this.inspeccionCollection.findIndex(x => x.id === request.body.id);
                if (inspeccionIndex==-1) return error('Username or password is incorrect');
                this.inspeccionCollection.splice(inspeccionIndex,1);
                return ok("La inspeccion se elimino");
            }

            // get an Inspeccion
            if (request.url.endsWith('/members/inspecciones/details') && request.method === 'POST') {
                if (!isLoggedIn) return unauthorised();
                const inspeccion = this.inspeccionCollection.find(x => x.id === request.body.id);
                if (!inspeccion) return error('Username or password is incorrect');
                return ok(inspeccion);
            }

            

            // pass through any requests not handled above
            return next.handle(request);
        }))
        // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());

        // private helper functions

        function ok(body) {
            return of(new HttpResponse({ status: 200, body }));
        }

        function unauthorised() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ status: 400, error: { message } });
        }
    }
}
