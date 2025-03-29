import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiKey = "1a26dd6a7d84418bbf7170ff9536e01c"
  private apiUrls = [
    'https://newsapi.org/v2/top-headlines?category=technology&apiKey=',
    'https://newsapi.org/v2/everything?q=pc+accessories&apiKey=',
    'https://newsapi.org/v2/everything?q=PC&apiKey=',
    'https://newsapi.org/v2/everything?q=laptop&apiKey=',
    'https://newsapi.org/v2/everything?q=servers&apiKey=',
    'https://newsapi.org/v2/everything?q=networking&apiKey='
  ]
  private urlKeywords = [
    'all',
    'accessories',
    'pcs',
    'laptops',
    'servers',
    'services'
  ]

  news:any = []

  constructor(private http: HttpClient) {}

  getTechNews(category:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrls[this.urlKeywords.indexOf(category)]}${this.apiKey}`)
  }
  getTechNewsNew(category:string): Promise<Observable<any>> {
    return new Promise((resolve) => {
      if (this.news.length > 0) {
        resolve(this.news)
      } else {
        this.http.get(`${this.apiUrls[this.urlKeywords.indexOf(category)]}${this.apiKey}`).subscribe((news:any) => {
          this.news = news.articles.slice(0, 5)
          resolve(this.news)
        })
      }
    })
  }
  // getAccessNews(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(`${this.apiUrlAccessories}${this.apiKey}`).subscribe({
  //       next: (data) => resolve(data),
  //       error: (err) => reject(err)
  //     });
  //   });
  // }
  // getPcNews(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(`${this.apiUrlPc}${this.apiKey}`).subscribe({
  //       next: (data) => resolve(data),
  //       error: (err) => reject(err)
  //     });
  //   });
  // }
  // getLaptopNews(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(`${this.apiUrlLaptop}${this.apiKey}`).subscribe({
  //       next: (data) => resolve(data),
  //       error: (err) => reject(err)
  //     });
  //   });
  // }
  // getServerNews(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(`${this.apiUrlServers}${this.apiKey}`).subscribe({
  //       next: (data) => resolve(data),
  //       error: (err) => reject(err)
  //     });
  //   });
  // }
  // getServiceNews(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.http.get(`${this.apiUrlServices}${this.apiKey}`).subscribe({
  //       next: (data) => resolve(data),
  //       error: (err) => reject(err)
  //     });
  //   });
  // }
}
