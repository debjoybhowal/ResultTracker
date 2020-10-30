import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
  subjectListAny;
  subjectLoaded: string = '';
  termList;

  showSubjectAddModal: boolean = false;

  paramLoaded: boolean = false;
  @ViewChild('chart1') chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  @ViewChild('chart2') chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;
  constructor(
    private dataservice: SubjectService,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  addSubjectForm : FormGroup= new FormGroup({
    sub_name: new FormControl(""),
    term_id:new FormControl("")
  })
  ngOnInit() {
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');

      this.dataservice
        .getAllSubjectData(this.user_id, this.pwd)
        .subscribe((data) => {
          this.bdata = data;
          this.chartData2();
        });
      this.route.paramMap.subscribe((route: any) => {
        if (route.params.id) {
          this.paramLoaded = true;
          this.chartOptions1 = undefined;
          this.dataservice
            .getSubjectFromId(this.user_id, this.pwd, route.params.id)
            .subscribe((data: any) => {
              this.cdata = data;
              console.log('cdata');
              console.log(this.cdata);
              this.chartData1();
            });
        }
      });

      this.dataservice
        .getAllSubjectData(this.user_id, this.pwd)
        .subscribe((response: any) => {
          if (!this.paramLoaded && response.response.length > 0)
            this.location.go('/dash/subject/' + response.response[0].sub_id);
          this.subjectList = response.response;
        });
      this.dataservice
        .getSubjectList(this.user_id, this.pwd)
        .subscribe((response: any) => {
          this.subjectListAny = response.response;
        });
    }
  }

  chartData1() {
    let posts1;
    posts1 = this.cdata.response;
    let termsChart = [];
    let marks1 = [];
    let p;
    this.subjectLoaded = posts1.length > 0 ? posts1[0].subject_name : '';
    console.log('posts1');
    console.log(posts1);
    posts1.forEach((character) => {
      termsChart.push(
        character.assesment_number > 1
          ? character.exam_name + ' ' + character.assesment_number
          : character.exam_name
      );
      marks1.push(character.percentage);
    });
    console.log(termsChart);

    this.chartOptions1 = {
      series: [
        {
          name: 'Score',
          data: marks1,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          endingShape: 'flat',
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '%';
        },
        offsetY: 20,
        style: {
          fontSize: '12px',
          colors: ['#ffffff'],
        },
      },

      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: termsChart,
        tickPlacement: 'on',
      },
      yaxis: {
        title: {
          text: 'Score',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
      },
    };
  }
  chartData2() {
    let overall;
    let posts;
    let percent = [];
    let termsChart = [];
    console.log(this.bdata);
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
        type: 'bar',
      },
      plotOptions: {
        bar: {
          columnWidth: '50%',
          endingShape: 'flat',
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '%';
        },
        offsetY: 20,
        style: {
          fontSize: '12px',
          colors: ['#ffffff'],
        },
      },

      xaxis: {
        labels: {
          rotate: -45,
        },
        categories: termsChart,
        tickPlacement: 'on',
      },
      yaxis: {
        title: {
          text: 'Score',
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'horizontal',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 0.85,
          opacityTo: 0.85,
          stops: [50, 0, 100],
        },
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

  onSubmit(data) {
    //this.http.post("https://jsonblob.com/1b6c8e99-1a7f-11eb-84f5-bfbe1e4eff0a",JSON.stringify(data));
    console.log(JSON.stringify(data));
    //this.dataservice.addsub(data).subscribe((result: any) => {
    console.log(JSON.stringify(data));
    //});
    this.showSubjectAddModal = false;
    /////////////////////////////////////////////////////////////////////////////////////////////
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.dataservice
        .addsub(this.user_id, this.pwd, data)
        .subscribe((response: any) => {
          console.log(response);
        });
      //this.dataservice.addsub(data).subscribe((response: any) => (this.profile = response.response));
    }
  }

  onAdd(){
    console.log(this.addSubjectForm.value)
    this.dataservice.addsub(this.user_id,this.pwd,this.addSubjectForm.value).subscribe((response:any)=>{
      console.log(response);
    })
  }

  changeTermId(e) {
    console.log(e.target.value)
    this.addSubjectForm.get('term_id').setValue(e.target.value, {
      onlySelf: true
    })
  }

  openSubjectModal(){
    this.termList=undefined;
    this.showSubjectAddModal=true;
    this.dataservice.getTermList(this.user_id,this.pwd).subscribe((response:any)=>{
      console.log(response);
      this.termList=response.response;
    })
  }
}
