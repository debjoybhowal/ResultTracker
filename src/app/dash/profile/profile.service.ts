import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {

  url = 'https://atdebjoy.com/others/api/perform/basic_details.php';
  url2 = 'https://atdebjoy.com/others/api/perform/term_wise_subjects.php';
  
  constructor(private http: HttpClient) {}
  getProfileInfo(user_id: string, pwd: string) {
    return this.http.get(this.url + `?profile&stud_id=${user_id}&pass=${pwd}`);
  }
  getTermInfo(user_id: string, pwd: string) {
    return this.http.get(this.url2 + `?profile&stud_id=${user_id}&pass=${pwd}`);
  }
  getAllBasicData(user_id: string, pwd: string) {
    return this.http.get(this.url + `?stud_id=${user_id}&pass=${pwd}`);
  }
}
