import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { NgCircleProgressModule } from 'ng-circle-progress';
=======
import { DataService } from '../data.service';
>>>>>>> e4d17d81bfc0dea17e0bc926865afa5b7745fced

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  avg_percentage = 84.7;

<<<<<<< HEAD
  avg_percentage=84.7;
  
  constructor() { }
avg_percentage=84.7;
=======
  profile;
  allData;
  user_id: string;
  pwd: string;

  constructor(private dataservice: DataService) {}
>>>>>>> e4d17d81bfc0dea17e0bc926865afa5b7745fced

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
