import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'filter' })
export class customFilter implements PipeTransform {
  transform(data: any): string {
    for (let obj of data) {
      for (let key in obj) {
        return obj[key];
      }
  }
  }
}