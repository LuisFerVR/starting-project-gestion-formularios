import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, of } from 'rxjs';

function mustContainQuestionMark(control:AbstractControl){
  if(control.value.includes('?')){
    return null;
  }
  return {doesNotContainQuestionMark:true};
}

function emailIsUnique(control:AbstractControl){
  if(control.value !=='test@gmail.com'){
    return of(null);
  }
  return of({emailIsNotUnique:true});
}

let initialEmailValue='';
const savedForm = window.localStorage.getItem('saved-login-form');
if(savedForm){
  const parsedForm = JSON.parse(savedForm);
  const email = parsedForm.email;
  initialEmailValue=email;
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports:[ReactiveFormsModule]
})

export class LoginComponent implements OnInit{
  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    email:new FormControl(initialEmailValue,{
      validators:[Validators.email, Validators.required],
      asyncValidators:[emailIsUnique]
    }),
    password:new FormControl('',{
      validators:[Validators.required,Validators.minLength(6),mustContainQuestionMark]
    }),
  });

  get emailIsInvalid(){
    return this.form.controls.email.touched && this.form.controls.email.dirty && this.form.controls.email.invalid
  }

  get passwordIsInvalid(){
    return this.form.controls.password.touched && this.form.controls.password.dirty && this.form.controls.password.invalid
  }

  ngOnInit() {
    /* const savedForm = window.localStorage.getItem('saved-login-form');
    if(savedForm){
      const parsedForm = JSON.parse(savedForm);
      const email = parsedForm.email;
      this.form.patchValue({
        email:email
      });
    } */
    const subscription = this.form.valueChanges.pipe(debounceTime(500)).subscribe({
      next:value=>window.localStorage.setItem('saved-login-form',JSON.stringify({email: value.email}))
    });
    this.destroyRef.onDestroy(()=>subscription.unsubscribe());
  }


  onSubmit(){
    console.log(this.form);
    const enteredEmail = this.form.value.email;
    const enteredPassword = this.form.value.password;
    console.log(enteredEmail, enteredPassword);
  }
}