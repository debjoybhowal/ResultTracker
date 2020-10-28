import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from './home.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  profile;
  allData;
  user_id: string;
  pwd: string;
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private dataservice: HomeService) {}

  
  ngOnInit(): void {
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.dataservice
        .getProfileInfo(this.user_id, this.pwd)
        .subscribe((response: any) => (this.profile = response.response));

      this.dataservice
        .getAllBasicData(this.user_id, this.pwd)
        .subscribe((response: any) => {
          this.allData = response;
          this.loadChartData();
        });
    }
  }

  //Loading the chart
  loadChartData() {

    //Organizing the data
    let posts;
    let marks = [];
    let termsChart = [];
    posts = this.allData.all.response;
    posts.forEach((character) => {
      termsChart.push(character.term_name);
      marks.push(Number(character.marks));
    });

    this.chartOptions = {
      series: [
        {
          name: 'Score',
          data: marks,
        },
      ],
      chart: {
        height: 350,
        type: 'area',
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'category',
        categories: termsChart,
        labels:{
          hideOverlappingLabels:true,
          showDuplicates:true,
          trim:true,
        }
        
      },
    };
  }
}
