import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ToastrService } from 'ngx-toastr';
import { SubjectService } from './subject.service';
import { CustomValidators } from 'src/app/login/custom.validators';
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
  subjectListWithMarks;
  user_id: string;
  pwd: string;
  subjectList;
  subjectListAny;
  subjectLoaded: string = '';
  termList;
  current_id;
  current_sub;
  current_term;
  showSubjectAddModal: boolean = false;
  deleteSubjectAddModal: boolean = false;
  showSubjectEditModal: boolean = false;
  paramLoaded: boolean = false;
  @ViewChild('chart1') chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  @ViewChild('chart2') chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;
  constructor(
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private location: Location,
    private toastr: ToastrService
  ) {}
  addSubjectForm: FormGroup = new FormGroup({
    sub_name: new FormControl('', [
      Validators.required,
      CustomValidators.noSpecial
    ]),
    term_id: new FormControl('', Validators.required),
  });
  editSubjectForm: FormGroup = new FormGroup({
    sub_name: new FormControl('', [
      Validators.required,
      CustomValidators.noSpecial
    ]),
  });
  ngOnInit() {
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.route.paramMap.subscribe((route: any) => {
        if (route.params.id) {
          this.loadSpecificSubject(route.params.id);
          //this.toastr.success("successfully loaded data of subject");
        }
      });
      this.subjectService
        .getAllSubjectData(this.user_id, this.pwd)
        .subscribe((response: any) => {
          if (response.code == 202) {
            this.subjectList = response;
            this.chartData2();
          } else {
            this.toastr.error('Something went wrong!');
          }
        });
      this.loadSubjectListAny();
      //this.toastr.info('loading backend data');
    }
  }
  nana;
  loadSpecificSubject(id) {
    this.paramLoaded = true;
    this.chartOptions1 = undefined;
    this.subjectListWithMarks = undefined;
    this.subjectService
      .getSubjectFromId(this.user_id, this.pwd, id)
      .subscribe((data: any) => {
        if (data.code == 202) {
          this.subjectListWithMarks = data;
          this.chartData1();
        } else {
          this.toastr.error('Something went wrong!');
        }
      });
  }
  loadSubjectListAny() {
    this.subjectListAny = undefined;
    this.subjectService
      .getSubjectList(this.user_id, this.pwd)
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.subjectListAny = response.response;
          if (
            !this.paramLoaded &&
            response.response &&
            response.response.length > 0
          ) {
            this.location.go('/dash/subject/' + response.response[0].sub_id);
            this.loadSpecificSubject(response.response[0].sub_id);
          }
          if (this.subjectListAny && this.subjectListAny.length <= 0) {
            this.chartOptions1 = {};
            this.subjectListWithMarks = { response: [] };
          }
        } else this.toastr.error('Something went wrong!');
      });
  }
  chartData1() {
    let posts1;
    posts1 = this.subjectListWithMarks.response;
    let termsChart = [];
    let marks1 = [];
    this.subjectLoaded = posts1.length > 0 ? posts1[0].subject_name : '';
    posts1.forEach((character) => {
      termsChart.push(
        character.assesment_number > 1
          ? character.exam_name + ' ' + character.assesment_number
          : character.exam_name
      );
      marks1.push(character.percentage);
    });
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
    overall = this.subjectList.average.response;
    posts = this.subjectList.response;
    posts.forEach((character) => {
      termsChart.push(character.subject_name);
      percent.push(Math.round(character.average * 10) / 10);
    });
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
  onAdd() {
    this.showSubjectAddModal = false;
    this.subjectService
      .addsub(this.user_id, this.pwd, this.addSubjectForm.value)
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.loadSubjectListAny();
          this.toastr.success('added new subject');
        } else this.toastr.error('Something went wrong!');
      });
  }
  changeTermId(e) {
    this.addSubjectForm.get('term_id').setValue(e.target.value, {
      onlySelf: true,
    });
  }
  editTermId(e) {
    this.editSubjectForm.get('term_id').setValue(e.target.value, {
      onlySelf: true,
    });
  }
  openSubjectModal() {
    this.addSubjectForm.markAsUntouched();
    this.addSubjectForm.get('sub_name').reset();
    this.termList = undefined;
    this.showSubjectAddModal = true;
    this.subjectService
      .getTermList(this.user_id, this.pwd)
      .subscribe((response: any) => {
        if(response.code==202)
        this.termList = response.response;
        else
        this.toastr.error("Something went wrong!");
      });
  }
  opendelSubjectModal(id, name) {
    this.deleteSubjectAddModal = true;
    this.current_id = id;
    this.current_sub = name;
  }
  openEditSubjectModal(id, name, term) {
    this.showSubjectEditModal = true;
    this.current_id = id;
    this.current_sub = name;
    this.current_term = term;
    this.editSubjectForm.get('sub_name').setValue(this.current_sub);
    this.subjectService
      .getTermList(this.user_id, this.pwd)
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.termList = response.response;
        } else {
          this.toastr.error('Something went wrong');
        }
      });
  }
  ondel() {
    this.deleteSubjectAddModal = false;
    this.subjectService
      .delsub(this.user_id, this.pwd, this.current_id)
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.loadSubjectListAny();
          this.toastr.warning('Subject deleted successfully!');
        } else this.toastr.error('Something went wrong!');
      });
  }
  onEdit() {
    this.showSubjectEditModal = false;
    this.subjectService
      .editsub(
        this.user_id,
        this.pwd,
        this.current_id,
        this.editSubjectForm.value.sub_name
      )
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.toastr.success("Subject updated successfully")
          this.loadSubjectListAny();
        } else this.toastr.error('Something went wrong');
      });
    this.loadSubjectListAny();
    //this.toastr.warning('editing the selected subject');
  }
}
