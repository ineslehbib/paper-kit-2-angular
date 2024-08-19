import { Injectable } from '@angular/core';
import { AppConfig } from '../config/config';
import { map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from 'app/components/notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class ServService {
  API: string = AppConfig.apiUrl;
  Login: string = AppConfig.login;
  password: string = AppConfig.password;

  constructor(private http: HttpClient, private modalService: NgbModal) { }


  getQuestionnaire(id: any): Observable<any> {
    return this.http.get(`${this.API}/Questionnaire?$filter=Profile_Questionnaire_Code eq '${id}'`, {
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
      withCredentials: true
    });
  };


  PostResponce(inputdata: any) {

    // return this.http.post(this.apiurl,inputdata)
    return this.http.post(`${this.API}/ReponsesQuestionnaire`, inputdata, {
      withCredentials: true
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
    });
  };
  getContact(id: any): Observable<any> {
    return this.http.get(`${this.API}/ContactList('${id}')`, {
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
      withCredentials: true
    });
  };
  getSurveyHisory(id: any): Observable<any> {
    return this.http.get(`${this.API}/SurveyHistory('${id}')`, {
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
      withCredentials: true
    });
  };
  UpdateSurveyHistory(id: any, updatedData: any, concurrencyToken: any): Observable<any> {
    const url = `${this.API}/SurveyHistory('${id}')`;

    const headers = new HttpHeaders({
      // Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`,
      'If-Match': concurrencyToken // Include the concurrency token in the request headers
    });

    return this.http.patch(url, updatedData, { headers, withCredentials: true });
  }

  PostSurveyDate(inputdata: any) {

    return this.http.post(`${this.API}/SurveyHistory`, inputdata, {
      withCredentials: true
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
    });
  };

  getParameters(): Observable<any> {
    return this.http.get(`${this.API}/ParametreMkt`, {
      withCredentials: true
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
    });
  };


  getQuoteInformation(id: any): Observable<any> {
    return this.http.get(`${this.API}/QuoteQuery?$filter=No_ eq '${id}'`, {
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
      withCredentials: true
    });
  };




  //Service web pour la partie envoie de devis par mail : 

  getVideo(inputJson: any): Observable<any> {

    return this.http.post(`http://192.168.1.198:4248/EDMSBC242/ODataV4/VideoManagement_GetVideo?company=TOYOTA`, inputJson, {
      withCredentials: true
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
    });
  };

  ChangeStatus(inputJson: any): Observable<any> {

    return this.http.post(`http://192.168.1.198:4248/EDMSBC242/ODataV4/VideoManagement_ChangeStatus?company=TOYOTA`, inputJson, {
      withCredentials: true
      // headers: {
      //   Authorization: `Basic  ${btoa(this.Login + ":" + this.password)}`
      // }
    });
  };

  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'Confirmer',
    btnCancelText: string = 'Annuler',
    dialogSize: 'sm' | 'lg' = 'sm'): Promise<boolean> {
    const modalRef = this.modalService.open(NotificationComponent, { size: dialogSize });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}


