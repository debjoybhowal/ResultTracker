import { NavComponent } from './../nav/nav.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Params, Router } from '@angular/router';
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
import { ToastrService } from 'ngx-toastr';

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
  websiteList: any = ['chemistry', 'english', 'computer', 'biology'];

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  termData;
  termList;
  showEditTermModal = false;
  deleteTermModal = false;
  showTermModal = false;
  termMarks;
  constructor(
    private toastr: ToastrService,
    private termService: TermService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  series: { name: string; data: number[] }[] = [];

  subjects: string[] = [];
  user_id: string;
  paramLoaded: boolean = false;
  pwd: string;
  term_id: number;
  term_name: string = '';
  ngOnInit(): void {
    this.user_id = localStorage.getItem('user_id');
    this.pwd = localStorage.getItem('pwd');

    this.route.paramMap.subscribe((item: any) => {
      if (item.params.id) {
        this.loadChart(item.params.id);
        this.paramLoaded = true;
      }
    });
    this.loadTermData();
  }

  loadTermData() {
    this.termData = undefined;
    this.termService
      .getTermInfo(this.user_id, this.pwd)
      .subscribe((response: any) => {
        if (response.code == 202) {
          if (!this.paramLoaded && response.response.length > 0) {
            this.router.navigate([
              'dash',
              'term',
              response.response[0].term_id,
            ]);
          } else {
            this.chartOptions = {};
            this.termMarks = [];
          }
          this.termData = response.response;
        } else {
          this.toastr.error('Something went wrong!');
        }
      });
  }

  loadChart(term_id: number) {
    this.chartOptions = undefined;
    this.subjects = [];
    this.series = [];
    this.termService
      .getTermWiseSubject(this.user_id, this.pwd, term_id)
      .subscribe((data: any) => {
        console.log(data);
        if (data.code == 202) this.setupData(data);
        else this.toastr.error('Something went wrong!');
      });
  }
  setupData(data: any) {
    let exam = data.exam;
    this.termMarks = data.marks;
    console.log(data);
    this.term_name =
      data.marks.length > 0
        ? data.marks[0].length > 0
          ? data.marks[0][0].term_name
          : ''
        : '';
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
    //Fixing chart display issue for small screen
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  editTermForm: FormGroup = new FormGroup({
    term_name: new FormControl('', Validators.required),
  });

  opendelTermModal(id) {
    this.deleteTermModal = true;
    this.term_id = id;
  }

  openEditTermModel(id, name) {
    this.showEditTermModal = true;
    this.term_id = id;
    this.term_name = name;
    this.editTermForm.get('term_name').setValue(this.term_name);
    this.termService
      .getTermList(this.user_id, this.pwd)
      .subscribe((response: any) => {
        if (response.code == 202) this.termList = response.response;
        else this.toastr.error('Something went wrong!');
      });
  }
  ondel() {
    this.deleteTermModal = false;
    console.log(this.user_id);
    console.log(this.pwd);
    console.log(this.term_id);
    this.termService
      .delterm(parseInt(this.user_id), this.pwd, this.term_id)
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.loadTermData();
          this.toastr.warning('Term deleted successfully');
        } else this.toastr.error('Something went wrong!');
      });
  }
  onEdit() {
    this.showEditTermModal = false;
    this.termService
      .editterm(
        parseInt(this.user_id),
        this.pwd,
        this.term_id,
        this.editTermForm.value.term_name
      )
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.toastr.success('Term updated successfully');
          this.loadTermData();
        } else {
          this.toastr.error('Something went wrong!');
        }
      });
  }
  form = new FormGroup({
    term_name: new FormControl('', [Validators.required]),
  });

  get term_name_add() {
    return this.form.get('term_name');
  }
  onSubmit(data) {
    if (this.form.valid) {
      console.log(JSON.stringify(data));
      this.showTermModal = false;

      if (localStorage.getItem('user_id')) {
        this.user_id = localStorage.getItem('user_id');
        this.pwd = localStorage.getItem('pwd');
        this.termService
          .addTerm(this.user_id, this.pwd, data)
          .subscribe((response: any) => {
            if ((response.code = 202)) {
              this.toastr.success('Term added successfully');
              this.loadTermData();
            }else
            this.toastr.error("Something went wrong!");
          });
      }
    }
  }
  openTermModal() {
    this.showTermModal = true;
  }
}
