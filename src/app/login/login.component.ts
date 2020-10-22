import { Component, OnInit } from '@angular/core';
import {FormArray,FormBuilder,FormGroup,FormControl, Validators} from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form;
  constructor(private fb: FormBuilder) { 
    this.form = this.fb.group({
      'username':new FormControl('',[
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(13)
      ]),
      'studentname':new FormControl('',[
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(30)
      ]),
      'primaryEmail': new FormControl('',[
        Validators.required,
        Validators.email
      ])
    })
  }
  get user_name(){
    return this.form.get('username');
  }
  get student_name(){
    return this.form.get('studentname');
  }
  get primary_Email() {
    return this.form.get('primaryEmail');
} 
  ngOnInit(): void {
  }

}
