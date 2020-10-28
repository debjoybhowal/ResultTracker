import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  
  url = 'https://atdebjoy.com/others/api/perform/'; 

  constructor( private http: HttpClient) { }

  
}
