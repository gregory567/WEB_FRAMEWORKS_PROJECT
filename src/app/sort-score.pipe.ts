import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sortScore'
})

export class SortScorePipe implements PipeTransform {
  transform(array: any[]): any[] {
    if (!Array.isArray(array)) {
      return array;
    }

    return array.sort((a, b) => {
      const scoreA = a.score;
      const scoreB = b.score;

      if (scoreA < scoreB) {
        return 1;
      } else if (scoreA > scoreB) {
        return -1;
      } else {
        return 0;
      }
    });
  }
}
