import { Component, OnInit } from '@angular/core';
import {FormArray,FormBuilder,FormGroup,FormControl, Validators} from '@angular/forms';
import {CustomValidators} from './custom.validators';
import { ConfirmedValidator } from './confirmed.validator';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form;
  loginForm:FormGroup;
  
  showMyContainer: boolean = false;


  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router) { 
    this.form = this.fb.group({
      'username':new FormControl('',[
        Validators.required,
        Validators.minLength(5),
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
    this.loginForm=this.fb.group({
      'username':new FormControl('',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(13),
        CustomValidators.noSpecial,
        CustomValidators.notSpace
      ]),
      'pwd':new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        CustomValidators.notSpace
      ]),
    })
  }
  
   get f(){
    return this.form.controls;
  }
   get fl(){
     return this.loginForm.controls;
   }
   onLogin(){
     console.log(this.loginForm.value);
    this.loginService.login(this.loginForm.value).subscribe((result:any)=>{
      if(result.code==202){
        console.log("Successfully Logged In")
        localStorage.setItem("username",result.username);
        localStorage.setItem("pwd",this.loginForm.get('pwd').value);
        localStorage.setItem("user_id", result.user);
        
        this.router.navigate(['dash','home'])
      }else if(result.code == -302){
        console.log("INVALID USERNAME AND PASSWORD");
      }else if(result.code == -9999){
        console.log("Parameter error");
      }else{
        console.log("Something went wrong");
      }
    });
   }
  
  ngOnInit(): void {
  }

}
