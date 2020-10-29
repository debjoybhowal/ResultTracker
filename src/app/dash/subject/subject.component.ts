import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
} from 'ng-apexcharts';
import { SubjectService } from './subject.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
};
@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css'],
})
export class SubjectComponent implements OnInit {
  adata;
  bdata;
  cdata;
  user_id: string;
  pwd: string;
  subjectList;
  subjectLoaded:string="";
  
  paramLoaded:boolean=false;
  @ViewChild('chart1') chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  @ViewChild('chart2') chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;
  constructor(private dataservice: SubjectService, private route:ActivatedRoute, private router:Router) {}

  ngOnInit() {
    this.dataservice.getPosts2().subscribe((data)=>{
      this.bdata= data;
      this.chartData2();
    })
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      
      this.route.paramMap.subscribe((route:any)=>{
        if(route.params.id){
          this.paramLoaded=true;
          this.chartOptions1=undefined;
          this.dataservice.getSubjectFromId(this.user_id,this.pwd,route.params.id).subscribe((data:any)=>{
            this.cdata=data;
            console.log("cdata")
            console.log(this.cdata);
            this.chartData1(); 
          })  
        }
      })


      this.dataservice.getAllSubjectData(this.user_id, this.pwd).subscribe((response:any)=>{
        if(!this.paramLoaded)
        this.router.navigate(["dash","subject",response.response[0].sub_id]);
        this.subjectList=response.response;
      })
    }

  }

  chartData1() {
    let posts1;
    posts1 = this.cdata.response;
    let termsChart = [];
    let marks1 = [];
    let p;
    this.subjectLoaded=posts1.length>0? posts1[0].subject_name:"";
    console.log("posts1");
    console.log(posts1);
    posts1.forEach((character) => {

      termsChart.push(character.assesment_number>1?(character.exam_name+" "+character.assesment_number):character.exam_name);      
      marks1.push(character.percentage);
    });
    console.log(termsChart)
    
    this.chartOptions1 = {
      series: [
        {
          name: "Score",
          data: marks1
        }
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          endingShape: "flat"
        }
      },
      dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val + "%";
            },
            offsetY: 20,
            style: {
              fontSize: "12px",
              colors: ["#ffffff"],
            },
          },

      xaxis: {
        labels: {
          rotate: -45
        },
        categories: termsChart,
        tickPlacement: "on"
      },
      yaxis: {
        title: {
          text: "Score"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      }
    };
  }
  chartData2() {

    let overall;
    let posts;
    let percent = [];
    let termsChart = [];
    overall = this.bdata.average.response;
    posts = this.bdata.response;
    posts.forEach((character) => {
      termsChart.push(character.subject_name);
      percent.push(Math.round(character.average * 10) / 10);
    });
    console.log(percent);
    console.log(overall);

    console.log(termsChart);

    
    this.chartOptions2 = {
      series: [
        {
          name: 'Score',
          data: percent,
        },
      ],
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
          endingShape: "flat"
        }
      },
      dataLabels: {
            enabled: true,
            formatter: function (val) {
              return val + "%";
            },
            offsetY: 20,
            style: {
              fontSize: "12px",
              colors: ["#ffffff"],
            },
          },
  
      xaxis: {
        labels: {
          rotate: -45
        },
        categories: termsChart,
        tickPlacement: "on"
      },
      yaxis: {
        title: {
          text: "Score"
        }
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100]
        }
      },
      title: {
        text: 'student marks' + 'having overall average of ' + ' ' + overall,

        offsetY: 320,
        align: 'center',
        style: {
          color: '#444',
        },
      },
    };
  }

  
}

