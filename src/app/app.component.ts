import { Component } from '@angular/core';
import { GuardsCheckEnd, GuardsCheckStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading:boolean;
  constructor(private router: Router){
    this.router.events.subscribe(event => {
      if (event instanceof GuardsCheckStart) {
        this.loading = true;
        console.log("GuardStart")
      }     
      if (event instanceof GuardsCheckEnd) {
        this.loading = false;
        console.log("GuardEnd")
      } 
    });
  }
}
