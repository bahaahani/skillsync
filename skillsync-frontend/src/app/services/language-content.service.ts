import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageContentService {
  private apiUrl = `${environment.apiUrl}/language-content`;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

  getLocalizedContent(contentKey: string): Observable<any> {
    return this.translate.onLangChange.pipe(
      switchMap(() => this.http.get(`${this.apiUrl}/${contentKey}`, {
        params: { lang: this.translate.currentLang }
      }))
    );
  }

  updateLocalizedContent(contentKey: string, content: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${contentKey}`, {
      content,
      lang: this.translate.currentLang
    });
  }
}