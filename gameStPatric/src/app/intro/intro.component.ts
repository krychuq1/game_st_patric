import {AfterViewChecked, AfterViewInit, ApplicationRef, ChangeDetectorRef, Component, NgZone} from '@angular/core';
import {isRejected} from "q";
import {HttpClient} from "@angular/common/http";

@Component({
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss']
})
export class IntroComponent {


  isReady: boolean;


  constructor( ) {
    this.isReady = false;
    // this.http.get('../../assets.')
  }
  setIsReady(){
    this.isReady = true;
    console.log('here')

  }
}

