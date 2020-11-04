import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TermService {
  url: string="https://atdebjoy.com/others/api/perform/get_term_wise_subjects.php";
  
  apiurl: string="https://atdebjoy.com/others/api/perform/term_wise_subjects.php";
  
  url2: string='https://atdebjoy.com/others/api/perform/add_term.php';

  urlTerm: string='https://atdebjoy.com/others/api/perform/get_list_term.php';

  delurl: string='https://atdebjoy.com/others/api/perform/del_term.php';

  editurl: string='https://atdebjoy.com/others/api/perform/update_term.php';
  constructor(private http: HttpClient) { }

  getTermWiseSubject(stud_id:string, pass: string,term_id:number){
    return this.http.get(this.url+`?stud_id=${stud_id}&pass=${pass}&term=${term_id}`);
  }
  getTermInfo(user_id: string, pwd: string) {
    return this.http.get(this.apiurl + `?stud_id=${user_id}&pass=${pwd}&asc`);
  }
  addTerm(user_id: string, pwd: string, body){
    return this.http.post(this.url2, JSON.stringify({ term_name:body.term_name, stud_id:user_id, pass:pwd }));

  }

  getTermList(user_id: string, pwd: string){​
    return this.http.get(this.urlTerm +`?stud_id=${user_id}&pass=${pwd}`);
  }​

  delterm(user_id: number, pwd: string, term_id:number){​
    return this.http.post(this.delurl,
      JSON.stringify({​ term_id: term_id, stud_id: user_id, pass: pwd }​)
    );
  }​

  editterm(user_id: number, pwd: string, id1,name){​
    return this.http.post(this.editurl,JSON.stringify({​term_id:id1,stud_id:user_id,pass:pwd,term_name:name}​));
  }​​
}
