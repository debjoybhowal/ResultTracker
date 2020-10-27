import { Component, OnInit } from '@angular/core';
import {FormArray,FormBuilder,FormGroup,FormControl, Validators} from '@angular/forms';
import {CustomValidators} from './custom.validators';
import { ConfirmedValidator } from './confirmed.validator';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form;
  
  showMyContainer: boolean = true;


  constructor(private fb: FormBuilder) { 
    this.form = this.fb.group({
      'username':new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(13),
        CustomValidators.noSpecial,
        CustomValidators.notSpace
      ]),
      'studentname':new FormControl('',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30),
        CustomValidators.noSpecial,
        CustomValidators.notNumber
      ]),
      'primaryEmail': new FormControl('',[
        Validators.required,
        Validators.email
      ]),
      'pwd':new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        CustomValidators.notSpace
      ]),
      'cpwd':new FormControl('',[
        Validators.required
      ])},
       { 
        validator: ConfirmedValidator('pwd', 'cpwd')
      }
    )
  }
  
   get f(){
    return this.form.controls;
  }
   
  
  ngOnInit(): void {
  }

}
