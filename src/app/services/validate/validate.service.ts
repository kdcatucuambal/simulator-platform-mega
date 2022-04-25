import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidateService {

  constructor() {
  }

  object(value: any, fields: string[] = []) {
    const keys = fields.length > 0 ? fields : Object.keys(value);
    for (const key of keys) {
      console.log(key)
      if (!value[key]) {
        return false;
      }
    }
    return true;
  }

  htmlToText(htmlValue: string){
      const doc = new DOMParser().parseFromString(htmlValue, 'text/html');
      const text = doc.body.textContent || '';
      return text.trim().replace(/\s{2,}/g, ' ');
  }


}
