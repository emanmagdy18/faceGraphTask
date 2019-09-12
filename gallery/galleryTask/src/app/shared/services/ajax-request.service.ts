import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AjaxRequestService {
  constructor(private http: HttpClient) {
  }

  get<T>(url: string) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.get(url, { headers: headers }).pipe();
  }

  download(url: string) {
    return this.http.get(url, { responseType: "blob" });
  }

  post<T>(url: string, entity: T) {
    //const headers = { 'Content-Type': 'application/json' };
    return this.http.post(url, entity).pipe();
  }

  delete<T>(url: string) {
    const headers = { 'Content-Type': 'application/json' };
    return this.http.delete(url, { headers: headers }).pipe();
  }
}
