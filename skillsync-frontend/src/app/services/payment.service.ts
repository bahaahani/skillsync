import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  getAvailablePaymentMethods(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/methods`);
  }

  initiatePayment(amount: number, currency: string, method: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/initiate`, { amount, currency, method });
  }

  confirmPayment(paymentId: string, paymentData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/confirm/${paymentId}`, paymentData);
  }

  getPaymentStatus(paymentId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/status/${paymentId}`);
  }
}