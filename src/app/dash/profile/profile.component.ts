import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import {
  ApexNonAxisChartSeries,
  ChartComponent,
  ApexResponsive,
  ApexChart,
  ApexFill,
  ApexDataLabels,
  ApexLegend,
  ApexTheme,
} from 'ng-apexcharts';
import { SubjectService } from '../subject/subject.service';
import { TermService } from '../term/term.service';

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  theme: ApexTheme;
};
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  @ViewChild('chart0') chart1: ChartComponent;
  public chartOptions1: Partial<ChartOptions>;
  @ViewChild('chart1') chart2: ChartComponent;
  public chartOptions2: Partial<ChartOptions>;

  profile;
  allData;
  subjectList;
  subjectAverage;
  termData;
  PieData;
  examobj;
  examData;
  user_id: string;
  pwd: string;

  form: FormGroup;
  showExamModal: boolean = false;
  showDeleteExamModal: boolean = false;
  showEditExamModal: boolean = false;
  subjectListAny;

  showSubjectAddModal:boolean=false;

  constructor(
    private profileService: ProfileService,
    private subjectService: SubjectService,
    private termService:TermService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      examname: new FormControl('', [Validators.required]),
      totalexam: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
      exammarks: new FormControl('', [
        Validators.required,
        Validators.pattern('[0-9]*'),
      ]),
    });
  }

  get f() {
    return this.form.controls;
  }

  addexam() {
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.showExamModal = false;
      this.examobj = {
        exam_name: this.form.controls.examname.value,
        full_marks: this.form.controls.exammarks.value,
        exam_no: this.form.controls.totalexam.value,
        stud_id: this.user_id,
        pass: this.pwd,
      };
      // console.log(JSON.stringify(this.examobj));
      this.profileService
        .addExamStruct(this.examobj)
        .subscribe((response: any) => {
          this.examData = response.response;
          this.loadPieChartData();
          console.log(this.examData);
        });
    }
  }
  chartData() {
    let posts;
    console.log("Pie"+this.PieData.response);
    posts = this.PieData.response;
    let exam_name = [];
    let full_marks = [];
    let exam_no = [];
    posts.forEach((character) => {
      exam_name.push(character.exam_name);
      full_marks.push(parseInt(character.full_marks));
      exam_no.push(parseInt(character.exam_no));
    });
    console.log(exam_name);
    console.log(full_marks);
    console.log(exam_no);
    this.chartOptions1 = {
      series: exam_no,
      chart: {
        width: 380,
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },
      labels: exam_name,
      fill: {
        type: 'gradient',
      },
      legend: {
        formatter: function (val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };

    this.chartOptions2 = {
      series: full_marks,
      chart: {
        width: 380,
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },
      theme: {
        mode: 'light',
        palette: 'palette8',
      },
      labels: exam_name,
      fill: {
        type: 'gradient',
      },
      legend: {
        formatter: function (val, opts) {
          return val + ' - ' + opts.w.globals.series[opts.seriesIndex];
        },
        markers: {
          fillColors: ['#FCAE3F', '#8A3FFC'],
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
  ngOnInit(): void {
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.profileService
        .getProfileInfo(this.user_id, this.pwd)
        .subscribe((response: any) => (this.profile = response.response));

      this.profileService
        .getAllBasicData(this.user_id, this.pwd)
        .subscribe((response: any) => (this.allData = response));
      this.loadTermData();

      this.profileService
        .getAllSubjectData(this.user_id, this.pwd)
        .subscribe((response: any) => {
          this.subjectList = response.response;
          this.subjectAverage = response.average.response;
        });
      this.loadPieChartData();
      this.loadSubjectListAny();
    }

    this.EditExamForm.get('exam_id').valueChanges.subscribe(val => {
      //compare value and set other control value
      let exam_name=this.PieData.response.find((res)=>res.ass_id==val).exam_name
      this.EditExamForm.get("new_exam_name").setValue(exam_name);
    });
  }

  
  loadPieChartData() {
    this.PieData = undefined;
    this.chartOptions1 = undefined;

    this.chartOptions2 = undefined;
    this.profileService
      .getExamInfo(this.user_id, this.pwd)
      .subscribe((response: any) => {
        this.PieData = response;
        this.chartData();
      });
  }
  openExamAddModal() {
    this.showExamModal = true;
  }

  //Delete Exam Structure
  deleteExamForm: FormGroup = new FormGroup({
    exam_id: new FormControl('',Validators.required),
  });
  openExamDeleteModal() {
    this.showDeleteExamModal = true;
    
    this.deleteExamForm.markAsUntouched();
  }

  onDeleteExam(){
    console.log(this.deleteExamForm.controls.exam_id.value);
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.showDeleteExamModal = false;
      this.examobj = {
        ass_id: this.deleteExamForm.controls.exam_id.value,
        stud_id: this.user_id,
        pass: this.pwd,
      };
      // console.log(JSON.stringify(this.examobj));
      this.profileService
        .deleteExamStruct(this.examobj)
        .subscribe((response: any) => {
          this.examData = response.response;
          this.loadPieChartData();
          console.log(this.examData);
        });
    }
  }
  //Update Exam Modal
  openExamEditModal() {
    this.showEditExamModal = true;
    
    this.EditExamForm.markAsUntouched();
  }
  EditExamForm: FormGroup = new FormGroup({
    exam_id: new FormControl('',Validators.required),
    new_exam_name:new FormControl('',Validators.required)
  });


  onUpdateExam(){
   // console.log(this.EditExamForm.controls.exam_id.value+" "+this.EditExamForm.controls.new_exam_name.value);
   if (localStorage.getItem('user_id')) {
    this.user_id = localStorage.getItem('user_id');
    this.pwd = localStorage.getItem('pwd');
    this.showEditExamModal = false;
    this.examobj = {
      ass_id: this.EditExamForm.controls.exam_id.value,
      exam_name: this.EditExamForm.controls.new_exam_name.value,
      stud_id: this.user_id,
      pass: this.pwd,
    };
    // console.log(JSON.stringify(this.examobj));
    this.profileService
      .addExamStruct(this.examobj)
      .subscribe((response: any) => {
        this.examData = response.response;
        this.loadPieChartData();
        console.log(this.examData);
      });
  }
  }
  /*Subject related*/ 
  addSubjectForm: FormGroup = new FormGroup({
    sub_name: new FormControl('', Validators.required),
    term_id: new FormControl('',Validators.required),
  });
  termListDropDown;
  loadSubjectListAny() {
    this.subjectList = undefined;
    this.subjectService
      .getSubjectList(this.user_id, this.pwd)
      .subscribe((response: any) => {
        this.subjectListAny = response.response;
      });
  }
  changeTermId(e) {
    console.log(e.target.value);
  }
  openSubjectModal() {
    this.addSubjectForm.markAsUntouched();
    this.addSubjectForm.get("sub_name").reset();  
    this.termListDropDown = undefined;
    this.showSubjectAddModal = true;
    this.subjectService
      .getTermList(this.user_id, this.pwd)
      .subscribe((response: any) => {
        this.termListDropDown = response.response;
      });
  }
  onAddSubject() {
    this.showSubjectAddModal = false;
    this.subjectService
      .addsub(this.user_id, this.pwd, this.addSubjectForm.value)
      .subscribe((response: any) => {
        this.loadSubjectListAny();
      });
  }


  /*Term Related*/

  showAddTermModal = false;
  termAddForm = new FormGroup({
    term_name: new FormControl('', [Validators.required]),
  });

  get term_name_add() {
    return this.termAddForm.get('term_name');
  }
  loadTermData(){
    this.termData=undefined;
    this.termService
    .getTermInfo(this.user_id, this.pwd)
    .subscribe((response: any) => {
      this.termData = response;
      console.log(this.termData)
    });
  }
  openTermAddModal(){
    this.showAddTermModal=true;
  }
  onAddTerm() {
    if (this.termAddForm.valid) {
      console.log(JSON.stringify(this.termAddForm.value));
      this.showAddTermModal = false;

      if (localStorage.getItem('user_id')) {
        this.user_id = localStorage.getItem('user_id');
        this.pwd = localStorage.getItem('pwd');
        this.termService
          .addTerm(this.user_id, this.pwd, this.termAddForm.value)
          .subscribe((response: any) => {
            this.loadTermData()
          });
      }
    }
  }
}
