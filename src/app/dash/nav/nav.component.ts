import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  @Input() showMobile:boolean;
  @Output() showMobileChange=new EventEmitter();
  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  logOut(){
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("pwd");
    this.router.navigate(['login']);
  }

  toggleSideMobile(){
    this.showMobile=!this.showMobile;
    this.showMobileChange.emit(this.showMobile);
  }

}
