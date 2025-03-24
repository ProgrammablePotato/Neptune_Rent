import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searcher = new BehaviorSubject("")
  constructor() { }

  getSearchWord(){
    return this.searcher
  }
  public setSearchWord(word:string){
    this.searcher.next(word)
  }
}
