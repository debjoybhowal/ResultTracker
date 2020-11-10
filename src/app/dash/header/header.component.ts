import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProfileService } from './../profile/profile.service';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBar = new EventEmitter();
  form: FormGroup;
  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      message: new FormControl('', [Validators.required]),
    });
  }
  user_id: string;
  pwd: string;
  profile;
  showMapModal: boolean = false;
  showContactModal: boolean = false;
  ngOnInit(): void {
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.profileService
        .getProfileInfo(this.user_id, this.pwd)
        .subscribe((response: any) => (this.profile = response.response));
    }
  }
  get f() {
    return this.form.controls;
  }
  openMapModal() {
    this.showMapModal = true;
  }
  openContactModal() {
    this.showContactModal = true;
  }
  closeContactModal() {
    this.showContactModal = false;
    this.form.reset();
  }
  onSend() {
    console.log(this.profile.full_name);
    console.log(this.profile.email);
    console.log(this.form.controls.message.value);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    this.http
      .post(
        'https://formspree.io/f/xoqplapv',
        {
          Name: this.profile.full_name,
          From: this.profile.email,
          Message: this.form.controls.message.value,
        },
        { headers: headers }
      )
      .subscribe((response) => {
        console.log(response);
        this.toastr.success('Message Sent To Developers');
      });
    this.showContactModal = false;
    this.form.reset();
  }
}
