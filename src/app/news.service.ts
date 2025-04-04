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

  getTechNews(category:string): Promise<Observable<any>> {
    return new Promise((resolve) => {
      if (this.news.length > 0) {
        resolve(this.news)
      } else {
        this.http.get<any>(`${this.apiUrls[this.urlKeywords.indexOf(category)]}${this.apiKey}`).subscribe({
          next: (news)=> {
            this.news = news.articles.slice(0, 5)
            resolve(this.news)
          },
          error: (error) => {
            console.log(error)
          }
        })
      }
    })
  }
  
}
