import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { CustomValidators } from './custom.validators';
import { ConfirmedValidator } from './confirmed.validator';
import { LoginService } from '../login.service';
import { Router } from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form;
  loginForm: FormGroup;
  showLoading:boolean=false;

  showMyContainer: boolean = false;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(13),
          CustomValidators.noSpecial,
          CustomValidators.notSpace,
        ]),
        studentname: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
          CustomValidators.noSpecial,
          CustomValidators.notNumber,
        ]),
        primaryEmail: new FormControl('', [
          Validators.required,
          Validators.email,
        ]),
        pwd: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
          CustomValidators.notSpace,
        ]),
        cpwd: new FormControl('', [Validators.required]),
      },
      {
        validator: ConfirmedValidator('pwd', 'cpwd'),
      }
    );
    this.loginForm = this.fb.group({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(13),
        CustomValidators.noSpecial,
        CustomValidators.notSpace,
      ]),
      pwd: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
        CustomValidators.notSpace,
      ]),
    });
    this.chartOptions = {
      series: [
        {
          data: [11, 14, 16, 15, 18, 20, 23],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ['#6c757d'],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Yearly app subscribers progression',
        align: 'center',
        style: {
          color: undefined,
          fontFamily: 'Arial, sans-serif',
          fontWeight: 600,
      },
      },
      grid: {
        borderColor: 'gold',
        row: {
          colors: ['#000', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0,
        },
      },
      markers: {
        size: 1,
      },
      xaxis: {
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020'],
        title: {
          text: 'year',
          style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 300,
            cssClass: 'apexcharts-yaxis-title',
        },
        },
      },
      yaxis: {
        title: {
          text: 'number of users in lakhs',
          style: {
            color: undefined,
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fontWeight: 100,
            cssClass: 'apexcharts-yaxis-title',
        },
        },
        min: 5,
        max: 40,
        
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5,
      },
    };
  }

  get f() {
    return this.form.controls;
  }
  get fl() {
    return this.loginForm.controls;
  }
  onLogin() {
    console.log(this.loginForm.value);
    
    this.showLoading=true;
    this.loginService.login(this.loginForm.value).subscribe((result: any) => {
      if (result.code == 202) {
        console.log('Successfully Logged In');
        localStorage.setItem('username', result.username);
        localStorage.setItem('pwd', this.loginForm.get('pwd').value);
        localStorage.setItem('user_id', result.user);

        this.router.navigate(['dash', 'home']);
      } else if (result.code == -302) {
        console.log('INVALID USERNAME AND PASSWORD');
      } else if (result.code == -9999) {
        console.log('Parameter error');
      } else {
        console.log('Something went wrong');
      }
      this.showLoading=false;
    });
  }

  ngOnInit(): void {}
}
