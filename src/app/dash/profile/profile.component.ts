import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;

  profile;
  allData;
  termData;
  user_id: string;
  pwd: string;
  constructor(private dataservice: ProfileService) { 
    this.series= [2,1],
    this.chart= {
      width: 380,
      type: "donut"
    },
    this.dataLabels= {
      enabled: false
    },
    this.fill= {
      type: "gradient"
    },
    this.legend= {
      formatter: function(val, opts) {
        return val + " - " + opts.w.globals.series[opts.seriesIndex];
      }
    },
    this.labels= ["Internals", "Final"],
    this.responsive= [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: "bottom"
          }
        }
      }
    ]
  }

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
        
        this.dataservice
        .getTermInfo(this.user_id, this.pwd)
        .subscribe((response: any) => (this.termData = response));

    }
  }

}
