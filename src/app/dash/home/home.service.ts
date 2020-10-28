import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  url = 'https://atdebjoy.com/others/api/perform/basic_details.php'; 

  constructor( private http: HttpClient) { }

  getProfileInfo(user_id:string, pwd:string){
    return this.http.get(this.url+`?profile&stud_id=${user_id}&pass=${pwd}`);
  }

  getAllBasicData(user_id:string, pwd:string){
    return this.http.get(this.url+`?stud_id=${user_id}&pass=${pwd}`);
  }
}
