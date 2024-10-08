import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

function fnEqualsValues(controlName1:string, controlName2:string){
  return(control:AbstractControl)=>{
    const val1 = control.get(controlName1)?.value;
    const val2 = control.get(controlName2)?.value;
  
    if(val1 === val2){
      console.log('passwords are equal');
      return null;
    }
  
    return {valuesNotEqual:true};
  }
}

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
  imports:[ReactiveFormsModule]
})
export class SignupComponent {
  form = new FormGroup({
    email:new FormControl('',{
      validators:[Validators.email, Validators.required]
    }),
    passwords:new FormGroup({
      password:new FormControl('',{
        validators:[Validators.required,Validators.minLength(6)]
      }),
      confirmPassword:new FormControl('',{
        validators:[Validators.required,Validators.minLength(6)]
      })
    },{
      validators:[fnEqualsValues('password','confirmPassword')]
    }),
    firstName: new FormControl('',{
      validators:[Validators.required]
    }),
    lastName: new FormControl('',{
      validators:[Validators.required]
    }),
    address: new FormGroup({
      street: new FormControl('',{
        validators:[Validators.required]
      }),
      number: new FormControl('',{
        validators:[Validators.required]
      }),
      postalCode: new FormControl('',{
        validators:[Validators.required]
      }),
      city: new FormControl('',{
        validators:[Validators.required]
      })
    }),
    role: new FormControl<'student'|'teacher'|'employee'|'founder'|'other'>('student',{
      validators:[Validators.required]
    }),
    source:new FormArray([
      new FormControl(''),
      new FormControl(''),
      new FormControl('')
    ]),
    agree: new FormControl(false,{validators:[Validators.required]}),
  });

  onSubmit(){
    if(this.form.invalid){
      console.log('Form is invalid');
      return ;
    }

    console.log(this.form);
  }

  onReset(){
    this.form.reset();
  }
}
