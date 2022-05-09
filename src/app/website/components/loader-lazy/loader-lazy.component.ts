import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loader-lazy',
  templateUrl: './loader-lazy.component.html',
  styleUrls: ['./loader-lazy.component.scss']
})
export class LoaderLazyComponent implements OnInit {

  @Input() loading: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
