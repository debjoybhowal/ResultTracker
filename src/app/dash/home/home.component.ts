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
  ApexYAxis,
  ApexAnnotations,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  annotations:ApexAnnotations;
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

  constructor(private homeService: HomeService) {}

  
  ngOnInit(): void {
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.homeService
        .getProfileInfo(this.user_id, this.pwd)
        .subscribe((response: any) => (this.profile = response.response));

      this.homeService
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
    console.log(this.allData.all)
    posts.forEach((character) => {
      termsChart.push(".    "+character.term_name+"    .");
      marks.push(Number(character.percentage));
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
          showDuplicates:false,
          rotateAlways:false,
          rotate:0,
          trim:false,
          formatter: function(value, timestamp) {
            return value;
          }
        },
        tooltip:{
          enabled:false
        }
        // ,
        // tooltip: {
        //   formatter: function(val) {
        //     return val + "..."
        //   }
        // }
      },
      yaxis:{
        min:0,
        max:100
      },
      annotations: {
        yaxis: [
          {
            y: this.allData.average.response.value,
            borderColor: '#ac3fc4',
            borderWidth:3,
            label: {
              borderColor: '#ac3fc4',
              style: {
                color: '#fff',
                background: '#ac3fc4'
              },
              text: 'Avg : '+Math.round((Number(this.allData.average.response.value) + Number.EPSILON) * 10) / 10
            }
          }
        ]
      },
      
        tooltip: {
          enabled:true,
          x:{
            formatter:   function(val, opts) {
              return posts[val-1].subject_name+" - "+posts[val-1].exam_name+" #"+posts[val-1].exam_no;
            }
          },
          y:{
            formatter:   function(val, opts) {
              return val+"%";
            }
          },

          
        }
      
    };
  }
}
