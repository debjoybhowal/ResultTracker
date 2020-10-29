import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexStroke,
  ApexYAxis,
} from 'ng-apexcharts';
import { TermService } from './term.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
};

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css'],
})
export class TermComponent implements OnInit {
    

  websiteList:any= ['chemistry', 'english', 'computer','biology']


  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private dataService: TermService, private route: ActivatedRoute) {}

  series: { name: string; data: number[] }[] = [];

  subjects: string[] = [];
  
  user_id: string;
  pwd: string;
  ngOnInit(): void {
    
    this.user_id = localStorage.getItem('user_id');
    this.pwd = localStorage.getItem('pwd');


    this.route.paramMap.subscribe((item:any)=>{
      if(item.params.id){
        this.loadChart(item.params.id)
      }
    })

    
  }

  loadChart(term_id:number){
    this.chartOptions=undefined;
    this.subjects=[];
    this.series=[];
    this.dataService.getTermWiseSubject(this.user_id,this.pwd,term_id).subscribe((data: any) => {
      this.setupData(data);
    });
  }
  setupData(data: any) {
    let exam = data.exam;
    console.log(data);
    exam.forEach((exam_item: any) => {
      let full_marks = exam_item.full_marks;
      for (let i = 0; i < exam_item.exam_no; i++) {
        let exam_name = exam_item.exam_name;
        if (exam_item.exam_no > 1) {
          exam_name += ' ' + (i + 1);
        }

        let values = [];
        data.marks.forEach((marks_items) => {
          let filtered_mark = marks_items.filter((marks_item: any) => {
            return (
              marks_item.exam_id == exam_item.exam_id &&
              i + 1 == marks_item.exam_no
            );
          });
          let value =
            filtered_mark.length > 0
              ? (Number(filtered_mark[0].marks) * 100) / full_marks
              : 0;
          values.push(value);
        });
        this.series.push({
          name: exam_name,
          data: values,
        });
      }
    });
    console.log(this.series);
    data.marks.forEach((marks_item: any) => {
      if (marks_item.length > 0) {
        this.subjects.push(marks_item[0].sub_name);
      }
    });
    console.log(this.subjects);
    this.loadAllSubjectCategory();
  }
  loadAllSubjectCategory() {
    this.chartOptions = {
      series: this.series,
      chart: {
        type: 'bar',
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: true,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#fff'],
        },
      },
      stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
      },
      xaxis: {
        categories: this.subjects,
      },
      yaxis: {
        max: 100,
      },
    };
  }
}
