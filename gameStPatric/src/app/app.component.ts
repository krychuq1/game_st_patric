import {AfterViewInit, Component} from '@angular/core';
import * as GyroNorm from 'gyronorm/dist/gyronorm.complete';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit{

  title = 'app';
  gn;
  position;
  all;
  ball;
  currentPosition;
  maxWidth;
  ngAfterViewInit(): void {
    this.ball = document.getElementById('ball');
    this.ball.style.marginLeft = '100px';
    // this.currentPosition =this.ball.style.marginLeft.substring(0, this.ball.style.marginLeft.length -2);

    // console.log(this.ball.style, "this is margin");
  }

  constructor(){
    this.maxWidth = window.innerWidth - 40;
    console.log('max width, ', this.maxWidth);
    this.currentPosition = 100;
    // this.gn = new this.GyroNorm();
    this.gn = new GyroNorm();

    this.gn.init().then(()=> {
      this.gn.start(data =>{
        this.all = data;
        this.position = -1 * (data.dm.gx);
        if(this.ball){
          this.setBallPostion(this.position);
          // this.ball.style.marginLeft = this.position + 'px';
        }
      });
    })
  }

  setBallPostion(value){
      this.currentPosition = this.currentPosition + 4 * value;
      this.currentPosition = Math.round(this.currentPosition);

    if(this.currentPosition>0 && this.currentPosition <= this.maxWidth){
      this.ball.style.marginLeft = Math.round(this.currentPosition) + 'px';
    }else{
      if(this.currentPosition > this.maxWidth){
        this.currentPosition = this.maxWidth;
      }else {
        this.currentPosition = 0;

      }
    }
  }
}
