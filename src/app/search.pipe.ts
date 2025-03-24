import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(things:any[], word:string): any {
    if (!things) return null;
    if(!word) return things
    return things.filter(
      (elem)=>{
        return elem.name.toLowerCase().includes(word.toLowerCase())
      }
    )
  }

}
