import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  
  url = 'https://atdebjoy.com/others/api/perform/basic_details.php'; 

  constructor( private http: HttpClient) { }

  getProfileInfo(){
    return this.http.get(this.url+"?profile&stud_id=42&pass=1234abcd");
  }

  getAllBasicData(){
    return this.http.get(this.url+"?stud_id=42&pass=1234abcd");
  }
}
