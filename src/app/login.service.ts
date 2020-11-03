import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  baseUrl="https://atdebjoy.com/others/api/perform/";
  login(body){
    return this.http.post(this.baseUrl+"login.php", JSON.stringify(body));
  }
  register(body){
    return this.http.post(this.baseUrl+"register.php", JSON.stringify(body));
  }


}
