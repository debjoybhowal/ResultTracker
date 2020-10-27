import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  avg_percentage=84.7;
  
  constructor() { }

  ngOnInit(): void {
  }

}
