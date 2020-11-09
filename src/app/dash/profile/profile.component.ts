import { Component, OnInit, ViewChild } from '@angular/core';
import { ProfileService } from './profile.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
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
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/login/custom.validators';
import { CurrencyPipe } from '@angular/common';

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

  showSubjectAddModal: boolean = false;

  constructor(
    private profileService: ProfileService,
    private subjectService: SubjectService,
    private termService: TermService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private router: Router
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
          if (response.code == 202) {
            this.examData = response.response;
            this.toastr.success('Successfully Added', this.examobj.exam_name);
            this.loadPieChartData();
            //console.log(this.examData);
          } else this.toastr.error('Something went wrong!');
        });
      this.form.reset();
    }
  }
  chartData() {
    let posts;
    console.log('Pie' + this.PieData.response);
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
        .getAllSubjectData(this.user_id, this.pwd)
        .subscribe((response: any) => {
          this.subjectList = response.response;
          this.subjectAverage = response.average.response;
        });
      this.loadPieChartData();
      this.loadSubjectListAny();
    }

    this.marksLoadData();

    this.EditExamForm.get('exam_id').valueChanges.subscribe((val) => {
      //compare value and set other control value
      let exam_name = this.PieData.response.find((res) => res.ass_id == val)
        .exam_name;
      this.EditExamForm.get('new_exam_name').setValue(exam_name);
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
        this.examFilterList = this.PieData.response.reduce(
          (acc: any[], cur: any) => {
            return [
              ...acc,
              ...Array(Number(cur.exam_no))
                .fill({
                  exam_id: cur.ass_id,
                  exam_name: cur.exam_name,
                  exam_no: 1,
                })
                .map((item, index) => ({ ...item, exam_no: index + 1 })),
            ];
          },
          []
        );
        response.response.forEach((element) => {});
        console.log(this.examFilterList);
        console.log(this.PieData.response);
      });
  }
  openExamAddModal() {
    this.showExamModal = true;
  }
  closeExamAddModal() {
    this.showExamModal = false;
    this.form.reset();
  }

  //Delete Exam Structure
  deleteExamForm: FormGroup = new FormGroup({
    exam_id: new FormControl('', Validators.required),
  });
  openExamDeleteModal() {
    this.showDeleteExamModal = true;

    this.deleteExamForm.markAsUntouched();
  }
  closeExamDeleteModal() {
    this.showDeleteExamModal = false;

    this.deleteExamForm.reset();
  }
  onDeleteExam() {
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
          if (response.code == 202) {
            this.examData = response.response;
            this.loadPieChartData();
            this.toastr.success('Exam Succesfully Deleted');
            console.log(this.examData);
          } else this.toastr.error('Something went wrong!');
        });
    }
    this.deleteExamForm.reset();
  }
  //Update Exam Modal
  openExamEditModal() {
    this.showEditExamModal = true;

    this.EditExamForm.markAsUntouched();
  }
  closeExamEditModal() {
    this.showEditExamModal = false;

    this.EditExamForm.reset();
  }
  EditExamForm: FormGroup = new FormGroup({
    exam_id: new FormControl('', Validators.required),
    new_exam_name: new FormControl('', Validators.required),
  });

  onUpdateExam() {
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
          if (response.code == 202) {
            this.examData = response.response;
            this.toastr.success(
              'Exam Name Succesfully Changed to ' + this.examobj.exam_name
            );
            this.loadPieChartData();
            console.log(this.examData);
          } else {
            this.toastr.error('Something went wrong!');
          }
        });
    }
    this.EditExamForm.reset();
  }
  /*Subject related*/
  addSubjectForm: FormGroup = new FormGroup({
    sub_name: new FormControl('', Validators.required),
    term_id: new FormControl('', Validators.required),
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
    //console.log(e.target.value);
  }
  openSubjectModal() {
    this.addSubjectForm.markAsUntouched();
    this.addSubjectForm.get('sub_name').reset();
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
  loadTermData() {
    this.termData = undefined;
    this.termService
      .getTermInfo(this.user_id, this.pwd)
      .subscribe((response: any) => {
        this.termData = response;
        console.log(this.termData);
      });
  }
  openTermAddModal() {
    this.showAddTermModal = true;
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
            if (response.code == 202) this.loadTermData();
            else this.toastr.error('Something went wrong!');
          });
      }
    }
  }

  ///Delete User
  delAcc = false;
  deleteUserForm = new FormGroup({
    pass: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
      CustomValidators.notSpace,
    ]),
  });
  delacc() {
    this.delAcc = true;
  }
  ondel() {
    this.delAcc = false;
    console.log(this.deleteUserForm.value);
    this.profileService
      .deluser(this.user_id, this.deleteUserForm.get('pass').value)
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.loadSubjectListAny();
          this.toastr.warning('good bye');
          this.logOut();
        } else if (response.code == 351) {
          this.toastr.error('Incorrect Password');          
          this.logOut();
        } else this.toastr.error('Something went wrong!');
      });
    this.deleteUserForm.reset();
  }

  marksLoadData() {
    this.filteredMarksList = undefined;
    this.profileService
      .getAllMarksData(this.user_id, this.pwd)
      .subscribe((response: any) => {
        this.allData = response;
        this.filteredMarksList = this.allData.all.response;
        this.loadTermData();
      });
  }

  //Marks add check

  marksobj;
  marksresponse;
  MarksTerm;
  MarksSubject;
  MarksExam;
  showMarksModal: boolean = false;
  FullMarksExam;

  SelectedTermId;
  SelectedSubId;
  SelectedAssId;
  SelectedAssNo;
  getMarksForm: FormGroup = new FormGroup({
    term_id: new FormControl('', Validators.required),
    sub_id: new FormControl('', Validators.required),
    ass_id: new FormControl('', Validators.required),
    marks: new FormControl('', [
      Validators.required,
      Validators.min(0),
      (control: AbstractControl) => Validators.max(this.FullMarksExam)(control),
    ]),
  });
  AddMarksOfSubject() {
    console.log(this.getMarksForm.controls);
    if (localStorage.getItem('user_id')) {
      this.user_id = localStorage.getItem('user_id');
      this.pwd = localStorage.getItem('pwd');
      this.showExamModal = false;
      this.marksobj = {
        marks: parseInt(this.getMarksForm.controls.marks.value),
        term_id: this.SelectedTermId,
        sub_id: this.SelectedSubId,
        ass_id: this.SelectedAssId,
        ass_no: this.SelectedAssNo,
        stud_id: parseInt(this.user_id),
        pass: this.pwd,
      };
      console.log(JSON.stringify(this.marksobj));
      this.profileService
        .Add_Marks(this.marksobj)
        .subscribe((response: any) => {
          if (response.code == 202) {
            this.toastr.success('Marks added successfully');
            this.marksLoadData();
          } else {
            this.toastr.error('Something went wrong!');
          }
          this.closeMarksModal();
        });
    }
  }
  ontermselect(e) {
    const found = this.MarksTerm[e.target.value];
    console.log(found);
    if (found == undefined) {
      this.MarksSubject = this.SelectedSubId = undefined;
    } else {
      this.SelectedTermId = found.term_id;
      this.MarksSubject = found.term_sub;
    }
    this.MarksExam = this.SelectedAssId = this.SelectedAssNo = this.FullMarksExam = undefined;
  }
  onsubselect(e) {
    const found = this.MarksSubject[e.target.value];
    console.log(found);
    if (found == undefined) {
      this.MarksExam = this.SelectedAssId = this.SelectedAssNo = this.FullMarksExam = undefined;
    } else {
      this.SelectedSubId = found.sub_id;
      this.MarksExam = found.sub_ass;
    }
  }
  onexamselect(e) {
    this.SelectedAssId = this.MarksExam[e.target.value].ass_id;

    this.SelectedAssNo = this.MarksExam[e.target.value].ass_no;
    this.FullMarksExam = this.MarksExam[e.target.value].full_marks;
  }
  openMarksModal() {
    this.showMarksModal = true;
    this.MarksTerm = undefined;
    this.profileService
      .markscheckup(this.user_id, this.pwd)
      .subscribe((response: any) => {
        this.MarksTerm = response.response;
        console.log('Pritam' + response.code);
      });
  }
  closeMarksModal() {
    this.showMarksModal = false;
    this.MarksTerm = this.SelectedTermId = undefined;
    this.MarksSubject = this.SelectedSubId = undefined;
    this.MarksExam = this.SelectedAssId = this.SelectedAssNo = this.FullMarksExam = undefined;
    this.getMarksForm.markAsUntouched();
    this.getMarksForm.reset({
      term_id: '',
      sub_id: '',
      ass_id: '',
      marks: '',
    });
  }

  /*Marks Filter*/

  examFilterList;
  subjectFilterList;

  selectedFilterExamID: Number = -1;
  selectedFilterExamNo: Number = -1;
  selectedFilterTerm: Number = -1;
  selectedFilterSubject: Number = -1;

  filteredMarksList;

  marksFilterModal: boolean = false;
  openMarksFilterModal() {
    this.marksFilterModal = true;
  }
  closeMarksFilterModal() {
    this.marksFilterModal = false;
  }

  onTermFilterSelect(e) {
    this.subjectFilterList = undefined;
    this.selectedFilterSubject = -1;
    if (e.target.value > -1) {
      this.subjectFilterList = this.termData.response[e.target.value].subjects;
      this.selectedFilterTerm = this.termData.response[e.target.value].term_id;
    } else {
      this.selectedFilterTerm = e.target.value;
    }
  }
  onExamFilterSelect(e) {
    if (e.target.value > -1) {
      this.selectedFilterExamID = this.examFilterList[e.target.value].exam_id;
      this.selectedFilterExamNo = this.examFilterList[e.target.value].exam_no;
    } else {
      this.selectedFilterExamID = e.target.value;
      this.selectedFilterExamNo = e.target.value;
    }
  }
  onSubjectFilterSelect(e) {
    if (e.target.value > -1) {
      this.selectedFilterSubject = this.subjectFilterList[
        e.target.value
      ].sub_id;
    } else {
      this.selectedFilterSubject = e.target.value;
    }
  }
  applyMarksFilter() {
    this.resetMarksFilter();
    this.filteredMarksList = this.filteredMarksList.filter((item) => {
      return (
        (this.selectedFilterExamID == -1 ||
          this.selectedFilterExamID == item.exam_id) &&
        (this.selectedFilterExamNo == -1 ||
          this.selectedFilterExamNo == item.exam_no) &&
        (this.selectedFilterSubject == -1 ||
          this.selectedFilterSubject == item.sub_id) &&
        (this.selectedFilterTerm == -1 ||
          this.selectedFilterTerm == item.term_id)
      );
    });
    this.closeMarksFilterModal();
  }
  resetMarksFilter(marksFilterForm?) {
    this.filteredMarksList = this.allData.all.response;
    if (marksFilterForm) {
      marksFilterForm.reset();

      this.subjectFilterList = undefined;
      this.selectedFilterSubject = -1;
      this.selectedFilterExamNo = -1;
      this.selectedFilterExamID = -1;
      this.selectedFilterTerm = -1;
      this.closeMarksFilterModal();
    }
  }

  /* CHANGE PASSWORD*/
  changePasswordModal: boolean = false;
  pwdChangeForm = new FormGroup(
    {
      old_pass: new FormControl('', [Validators.required]),
      new_pass: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        CustomValidators.notSpace,
      ]),
      cnf_pass: new FormControl('', [Validators.required]),
    },
    this.pwdMatchValidator
  );
  pwdMatchValidator(frm: FormGroup) {
    return frm.get('new_pass').value === frm.get('cnf_pass').value
      ? null
      : { mismatch: true };
  }
  openChangePasswordModal() {
    this.changePasswordModal = true;
  }
  closeChangePasswordModal() {
    this.changePasswordModal = false;
    this.pwdChangeForm.reset();
  }
  changePassword() {
    this.profileService
      .changepassword(
        this.user_id,
        this.pwdChangeForm.get('old_pass').value,
        this.pwdChangeForm.get('new_pass').value
      )
      .subscribe((response: any) => {
        if (response.code == 202) {
          this.toastr.success(
            'Please login again using the new password',
            'Password Changed'
          );
          this.logOut();
        }else if(response.code==351){
          this.toastr.error("Incorrect password");
          this.logOut();
        }else
        this.toastr.error("Something went wrong!");
        
        this.closeChangePasswordModal();
      });
  }

  logOut(){
    localStorage.removeItem("username");
    localStorage.removeItem("user_id");
    localStorage.removeItem("pwd");
    this.router.navigate(['login']);
  }
}
