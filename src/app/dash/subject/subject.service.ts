import {​ HttpClient }​ from '@angular/common/http';
import {​ Injectable }​ from '@angular/core';
@Injectable({​
  providedIn: 'root',
}​)
export class SubjectService {​
  private delurl="https://atdebjoy.com/others/api/perform/del_subject.php";
  private editurl="https://atdebjoy.com/others/api/perform/update_subject_name.php";
  private url =
    'https://atdebjoy.com/others/api/perform/get_subjects.php';
  private urlSubjects =
    'https://atdebjoy.com/others/api/perform/get_subjects.php';
    private urlTerm="https://atdebjoy.com/others/api/perform/get_list_term.php";
    private addSubject="https://atdebjoy.com/others/api/perform/add_subject.php";
  constructor(private http: HttpClient) {​}​
  getPosts(user_id: string, pwd: string) {​
    return this.http.get(this.url+ `?stud_id=${​user_id}​&pass=${​pwd}​`);
  }​
  delsub(user_id: string, pwd: string, id){​
    return this.http.post(this.delurl,
      JSON.stringify({​ sub_id:id, stud_id: user_id, pass: pwd }​)
    );
  }​
  editsub(user_id: string, pwd: string, id1,name){​
    return this.http.post(this.editurl,JSON.stringify({​sub_id:id1,stud_id:user_id,pass:pwd,sub_name:name}​));
  }​​
  getAllSubjectData(user_id: string, pwd: string) {​
    return this.http.get(this.urlSubjects + `?stud_id=${user_id}&pass=${pwd}`);
  }​
  getSubjectFromId(user_id: string, pwd: string, sub_id: string) {​
    return this.http.get(
      this.urlSubjects +`?stud_id=${user_id}&pass=${pwd}&subject=${sub_id}`
    );
  }​
  getSubjectList(user_id: string, pwd: string) {​
    console.log(pwd)
    return this.http.get(
      this.urlSubjects +`?stud_id=${user_id}&pass=${pwd}&list`
    );
  }​
  addsub(user_id: string, pwd: string, body) {​
    return this.http.post(
      this.addSubject,
      JSON.stringify({​ ...body, stud_id: user_id, pass: pwd }​)
    );
  }​
  getTermList(user_id: string, pwd: string){​
    return this.http.get(this.urlTerm +`?stud_id=${user_id}&pass=${pwd}`);
  }​
}​
    
    
  
  

