import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  kereso = new BehaviorSubject<string>('')

  getSearchWord() {
    return this.kereso;
  }
}
