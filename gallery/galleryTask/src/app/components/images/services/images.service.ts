import { Injectable } from '@angular/core';
import { AjaxRequestService } from 'src/app/shared/services/ajax-request.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  constructor(private ajaxRequest: AjaxRequestService) { }
  apiUrl = 'https://localhost:44361/api/Images';

  getAllImages() {
    return this.ajaxRequest.get<any>(`${this.apiUrl}`);
  }

  insertNewImg(model: any) {
    return this.ajaxRequest.post<any>(`${this.apiUrl}/insertNewImg`, model);
  }

  downloadImg(fileName) {
    return this.ajaxRequest.download(`${this.apiUrl}/downloadImg/${fileName}`);
  }

  deleteImg(fileName) {
    return this.ajaxRequest.get(`${this.apiUrl}/deleteImg/${fileName}`);
  }

  deleteAllImgs(){
    return this.ajaxRequest.get(`${this.apiUrl}/deleteAllImgs`);
  }
}
