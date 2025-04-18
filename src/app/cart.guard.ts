import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export const cartGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService)
  const router = inject(Router)
  const http = inject(HttpClient)
  const userApi = 'http://127.0.0.1:3000/users/firebase/'
  let userId : any = ''
  const userId$ = new BehaviorSubject<string>('')
  const firebase_uid = auth.loggedUser?.uid
  if (!firebase_uid) {
    return router.navigate(['/error']).then(() => false)
  }
  http.get<{ id: string }>(userApi + firebase_uid).subscribe({
    next: (response) => {
      userId = response.id
      userId$.next(response.id)
    },
    error: (error) => {
      console.error('Error fetching user ID:', error)
    }
  })
  return true
}
