import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  avg_percentage = 84.7;

  profile;
  allData;
  user_id: string;
  pwd: string;

  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.dataservice
        .getProfileInfo(this.user_id, this.pwd)
        .subscribe((response: any) => (this.profile = response.response));

      this.dataservice
        .getAllBasicData(this.user_id, this.pwd)
        .subscribe((response: any) => (this.allData = response));
    }
  }
}
