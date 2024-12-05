import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseUrl = `${environment.baseApiUrl}/api/books`;

  constructor(private http: HttpClient) {}

  getBookById(bookId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${bookId}`);
  }

  createBook(bookData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, bookData);
  }
}
