import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private apiKey = "1a26dd6a7d84418bbf7170ff9536e01c"
  private apiUrlTech = 'https://newsapi.org/v2/top-headlines?category=technology&apiKey='
  private apiUrlAccessories = 'https://newsapi.org/v2/everything?q=pc+accessories&apiKey='
  private apiUrlPc = 'https://newsapi.org/v2/everything?q=PC&apiKey='
  private apiUrlLaptop = 'https://newsapi.org/v2/everything?q=laptop&apiKey='
  private apiUrlServers = 'https://newsapi.org/v2/everything?q=servers&apiKey='
  private apiUrlServices = 'https://newsapi.org/v2/everything?q=networking&apiKey='

  news:any = []

  constructor(private http: HttpClient) {}

  getTechNews(): Observable<any> {
    return this.http.get<any>(`${this.apiUrlTech}${this.apiKey}`)
  }

  getTechNewsNew(): Promise<Observable<any>> {
    return new Promise((resolve) => {
      if (this.news.length > 0) {
        resolve(this.news)
      } else {
        this.http.get(`${this.apiUrlTech}${this.apiKey}`).subscribe((news:any) => {
          this.news = news.articles.slice(0, 5)
          resolve(this.news)
        })
      }
    })
  }

  getAccessNews(): Observable<any> {
    return this.http.get(`${this.apiUrlAccessories}${this.apiKey}`)
  }

  getPcNews(): Observable<any> {{
    return this.http.get(`${this.apiUrlPc}${this.apiKey}`)
  }}

  getLaptopNews(): Observable<any> {{
    return this.http.get(`${this.apiUrlLaptop}${this.apiKey}`)
  }}

  getServerNews(): Observable<any> {{
    return this.http.get(`${this.apiUrlServers}${this.apiKey}`)
  }}

  getServiceNews(): Observable<any> {{
    return this.http.get(`${this.apiUrlServices}${this.apiKey}`)
  }}
}
