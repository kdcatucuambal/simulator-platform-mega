import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'likes'
})
export class LikesPipe implements PipeTransform {

  transform(votes: string[], value: boolean): string {
    let account = 0;
    votes.forEach(vote => {
      const [id, voted] = vote.split(':');
      if (voted == value.toString()) {
        account++;
      }
    })
    return account.toString()
  }

}
