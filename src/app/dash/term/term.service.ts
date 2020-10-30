import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  url: string="https://atdebjoy.com/others/api/perform/get_term_wise_subjects.php";
  
  apiurl: string="https://atdebjoy.com/others/api/perform/get_list_term.php";
  
  url2: string='https://atdebjoy.com/others/api/perform/add_term.php';
  constructor(private http: HttpClient) { }

  getTermWiseSubject(stud_id:string, pass: string,term_id:number){
    return this.http.get(this.url+`?stud_id=${stud_id}&pass=${pass}&term=${term_id}`);
  }
  getTermInfo(user_id: string, pwd: string) {
    return this.http.get(this.apiurl + `?stud_id=${user_id}&pass=${pwd}`);
  }
  addTerm(user_id: string, pwd: string, body){
    return this.http.post(this.url2, JSON.stringify({ term_name:body.Name, stud_id:user_id, pass:pwd }));

  }
}
