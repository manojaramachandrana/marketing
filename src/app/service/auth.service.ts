import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<any>(null);
  currentUser$: Observable<any> = this.currentUserSubject.asObservable();

  constructor(private auth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { 
    this.auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    ).subscribe(user => {
      this.currentUserSubject.next(user);
    });
  }

  async register(user: any) {
    try {
      if (user.password !== user.confirmPassword) {
        throw new Error('Password and Confirm Password do not match.');
      }

      const result = await this.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );

      if (result.user) {
        await this.firestore.collection('users').doc(result.user.uid).set({
          id: result.user.uid,
          name: user.name,
          email: user.email,
          phone: user.phone,
        });
      } else {
        throw new Error('User creation failed.');
      }

      return result;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      const result = await this.auth.signInWithEmailAndPassword(email, password);

      if (result.user) {
        this.router.navigate(['/dashboard']);
      } else {
        throw new Error('Authentication failed.');
      }

      return result;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      await this.auth.sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return this.currentUserSubject.value;
  }
}
