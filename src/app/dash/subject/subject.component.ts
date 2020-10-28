import { Component, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('chart1') chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  @ViewChild('chart2') chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;
  constructor(private dataservice: SubjectService) {}

  ngOnInit() {
    this.dataservice.getPosts().subscribe((data) => {
      this.adata = data;
      this.chartData1();
    });
    this.dataservice.getPosts2().subscribe((data)=>{
      this.bdata= data;
      this.chartData2();
    })
  }

  chartData1() {
    let posts;
    posts = this.adata.response;
    let termsChart = [];
    let marks1 = [];
    let marks2 = [];
    let finaleach = [];
    posts.forEach((character) => {
      if (
        character.assignment_id == '21' &&
        character.assesment_number == '1'
      ) {
        marks1.push(character.marks);
        termsChart.push(character.subject_name);
      } else if (
        character.assignment_id == '21' &&
        character.assesment_number == '2'
      ) {
        marks2.push(character.marks);
        termsChart.push(character.subject_name);
      } else {
        finaleach.push(character.marks);
        termsChart.push(character.subject_name);
      }
    });

    console.log(marks1);
    console.log(marks2);
    console.log(finaleach);
    let unique = [...new Set(termsChart)];

    console.log(unique);

    this.chartOptions1 = {
      series: [
        {
          name: 'internal 1',
          data: marks1,
        },
        {
          name: 'internal 2',
          data: marks2,
        },
        {
          name: 'Final exam',
          data: finaleach,
        },
      ],
      chart: {
        type: 'bar',
        height: 350,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },

      xaxis: {
        categories: unique,
      },
      yaxis: {
        title: {
          text: 'marks',
        },
      },
      fill: {
        opacity: 1,
      },
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
      percent.push(character.average);
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
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return val + '%';
        },
        offsetY: 20,
        style: {
          fontSize: '12px',
          colors: ['#304758'],
        },
      },

      xaxis: {
        type: 'category',
        categories: termsChart,
        position: 'top',
        labels: {
          offsetY: -18,
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
          offsetY: -35,
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
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + '%';
          },
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
}
