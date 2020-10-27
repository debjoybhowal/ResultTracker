import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  avg_percentage=84.7;

  profile;
  allData;
  
  constructor(private dataservice: DataService
    ) { }

  ngOnInit(): void {

    this.dataservice.getProfileInfo().subscribe((response:any) => this.profile=response.response);

    this.dataservice.getAllBasicData().subscribe((response:any) =>this.allData = response);
    

  }

}
