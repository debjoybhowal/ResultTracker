import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  private url="https://jsonblob.com/api/722b58bd-190b-11eb-8971-e7c4526873b0";

  
  private urlSubjects="https://atdebjoy.com/others/api/perform/get_subjects.php"
  constructor(private http: HttpClient) {}
  getPosts() {
    return this.http.get(this.url);
  }
  getPosts2(){
    return this.http.get("https://jsonblob.com/api/0ef856d0-18dc-11eb-8971-0314eb721e3f")
  }

  getAllSubjectData(user_id:string, pwd:string){
    return this.http.get(this.urlSubjects + `?stud_id=${user_id}&pass=${pwd}`);
  }

  getSubjectFromId(user_id:string, pwd:string, sub_id:string){
    return this.http.get(this.urlSubjects+`?stud_id=${user_id}&pass=${pwd}&subject=${sub_id}`);
  }
}
