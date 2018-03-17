import {AfterViewInit, Component} from '@angular/core';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/interval';
import {BeerModel} from "../../modals/beer";
import {GameOverDialog} from "../pop-ups/game-over/game-over.component";
import {MatDialog} from "@angular/material";
import {CloudModel} from "../../modals/cloud";

@Component({
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class GameComponent implements AfterViewInit{

  position;
  character;
  currentPosition;
  maxWidth;
  maxHeight;
  test = 0;
  beer;
  beers: BeerModel[] = [];
  clouds: CloudModel[] = [];
  gameHolder;
  score = 0;
  road: HTMLElement;
  clover: HTMLElement;
  cloverPosition: number;
  heart;
  roadStart: number;
  roadEnd: number;
  health: number;
  tick;
  isRunning: boolean;
  isPhoneMoving: boolean;
  isReady: boolean;
  isGameOver: boolean;
  backgroundSong;
  gameOverSong;
  isMute: boolean;
  showPopUp: boolean;
  collectedClovers;
  showTapPopUp: boolean;
  isDesktop: boolean;
  ngAfterViewInit(): void {
    window.ondevicemotion = (event) =>{

      this.position = -1 * (event.accelerationIncludingGravity.x);
      if(this.character){
        //set position to character
        this.setcharacterPostion(this.position);
      }
    };
    //get character
    this.character = document.getElementById('character');
    this.heart = document.getElementById('heart');
    //set starting margin
    this.character.style.marginLeft = '100px';
    //set starting y postion
    this.character.style.bottom = this.maxHeight / 2 + 'px';
    //get game hoolder
    this.gameHolder = document.getElementById('gameHolder');
    this.road = document.getElementById('road');
    this.clover = document.getElementById('clover');
    this.clover.style.zIndex = '3';
    this.clover.style.bottom = '0px';

    console.log(this.clover.style);

    this.setRoad();

    this.tick = Observable.interval(42).subscribe(x => {
      if(this.isRunning){
        this.animateClover();
        this.checkOnRoad();
        this.animateHeart();
        this.animateBeers();
        this.animateClouds();
        this.addAutoDrunkMove();
      }
      this.test++;
    });
    // this.startGame();
  }

  constructor(public dialog: MatDialog){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
       console.log('user on mobile');
       this.isDesktop = false;
    }else{
      this.isDesktop = true;
    }
    //set max width minus character with
    this.maxWidth = window.innerWidth - 80;
    this.maxHeight = window.innerHeight - 80;
    this.currentPosition = 100;
    //init health
    this.health = 100;
    this.isReady = false;
    this.isMute = false;
    this.showPopUp = false;
    this.cloverPosition = 0;
    this.collectedClovers = 0;
    this.showTapPopUp = false;
  }
  startGame(){
    this.isRunning = true;
    this.isGameOver = false;
    this.health = 100;
    this.currentPosition = 100;
    this.score = 0;
    this.collectedClovers = 0;
    this.clearElements();
    this.generateBeers(6);
    this.generateCloud(3);
    this.generateStars(30);
    this.backgroundSong.play();


  }
  checkIfBeerTouched(beer){
    let charStart = this.currentPosition - 10;
    let charEnd = this.currentPosition + 45;
    // let maxY = this.maxHeight/2;
    let maxY = this.maxHeight/2 + 45;
    let minY = this.maxHeight/2 - 20;
    if(beer.positionX >= charStart && beer.positionX  <= charEnd &&
      beer.positionY >= minY &&  beer.positionY <= maxY && this.health >0){
      this.score = this.score + 0.10;
      beer.img.style.visibility = 'hidden';
      this.randomizeExistingBeer(beer)
    }

  }
  setcharacterPostion(value){
    setTimeout(()=>{
      let movecharfaster = Math.round(this.score / 2);
      this.currentPosition = this.currentPosition + 2 * value;
      this.currentPosition = this.currentPosition + movecharfaster;
      this.currentPosition = Math.round(this.currentPosition);
      if(this.currentPosition >-20 && this.currentPosition <= this.maxWidth){
        this.character.style.marginLeft = Math.round(this.currentPosition) + 'px';
      }else{
        if(this.currentPosition > this.maxWidth){
          this.currentPosition = this.maxWidth;
        }else {
          this.currentPosition = 0;
        }
      }
    },this.score*100);

  }
  addAutoDrunkMove(){
    this.currentPosition++;
  }
  generateBeers(quantity){
    this.beers = [];

    for(let i = 0; i<quantity; i++){
      let positionX = this.getRandomInt(this.roadStart, this.roadEnd);
      // let positionX = this.roadStart + 100;

      let positionY = this.getRandomInt(-150, -50);
      let id = 'beer' + i;
      let speed = this.getRandomInt(1, 8);
      // let speed = 10;

      let beerImg = document.createElement('img');
      beerImg.setAttribute('src', '../assets/beer.gif');
      beerImg.setAttribute('id', id);
      beerImg.setAttribute('class', 'beer');
      beerImg.style.left = '0px';
      beerImg.style.position = 'absolute';
      beerImg.style.bottom = positionY +'px';
      beerImg.style.height = '35px';
      beerImg.style.zIndex = '3';
      beerImg.style.left = positionX + 'px';
      this.beers.push(new BeerModel(positionX, positionY, speed, id, beerImg));
      this.gameHolder.appendChild(beerImg);
    }
  }
  generateStars(quantity){
    let positionY = 100;
    let positionX = 0;
    let temp = Math.round(this.maxWidth / quantity);
    console.log(temp)
    for(let i = 0; i<quantity; i++){
      // let positionX = this.roadStart + 100;
      let id = 'star' + i;
      // let speed = 10;
      let starImg = document.createElement('img');
      starImg.setAttribute('src', '../assets/star.png');
      starImg.setAttribute('id', id);
      starImg.setAttribute('class', 'star');
      starImg.style.left = '0px';
      starImg.style.position = 'absolute';
      starImg.style.bottom = positionY +'px';
      // beerImg.style.height = '35px';
      starImg.style.left = positionX + 'px';
      starImg.style.height = this.getRandomInt(5, 15) + 'px';
      positionY = this.getRandomInt(100, this.maxHeight);
      positionX = positionX + 12;
      // this.beers.push(new BeerModel(positionX, positionY, speed, id, beerImg));
      this.gameHolder.appendChild(starImg);
    }
  }
  animateBeers(){
    //for all beers
    this.beers.forEach((beer)=>{
      beer.positionY = beer.positionY + beer.speed;
      beer.img.style.bottom = beer.positionY + 'px';
      this.checkIfBeerTouched(beer);
      //check if beer reached max height
      if(beer.positionY > this.maxHeight + 80){
        //set random y again
        this.randomizeExistingBeer(beer);
      }
    });
  }
  animateClouds(){
    this.clouds.forEach(cloud=>{
      cloud.positionX = cloud.positionX + cloud.speed;
      cloud.img.style.left = cloud.positionX + 'px';
      console.log(cloud.positionX, this.maxWidth +100);
      if(cloud.positionX >= (this.maxWidth + 100)) {
        this.randomizeCloud(cloud);
      }
    });
  }
  animateClover(){
    if(this.collectedClovers <= 0){
      this.showTapPopUp = true;
    }else{
      this.showTapPopUp = false;
    }
    this.cloverPosition = this.cloverPosition + 4;
    if(this.cloverPosition >= (this.maxWidth + 100)){
      this.cloverPosition = -450;
    }
    this.clover.style.bottom = this.cloverPosition + 'px';
  }
  generateCloud(quantity){
    this.clouds = [];
    for(let i = 0; i<quantity; i++){
      // let positionX = this.roadStart + 100;
      let positionX = this.getRandomInt(-100, -250);
      let positionY = this.getRandomInt(100, this.maxHeight);
      let id = 'cloud' + i;
      let speed = this.getRandomInt(1, 3);
      // let speed = 10;
      let cloudImg = document.createElement('img');
      let url = '../assets/cloud'+ i + '.png';
      cloudImg.setAttribute('src', url);
      cloudImg.setAttribute('id', id);
      cloudImg.setAttribute('class', 'cloud');
      cloudImg.style.left = positionX + 'px';
      cloudImg.style.width = '90px';
      cloudImg.style.position = 'absolute';
      cloudImg.style.bottom = positionY +'px';
      cloudImg.style.zIndex = '3';

      this.clouds.push(new CloudModel(positionY, positionX, speed, id, cloudImg));
      this.gameHolder.appendChild(cloudImg);

    }
  }
  // generateClover(){
  //   let positionX = this.getRandomInt(this.roadStart, this.roadEnd);
  //   this.cloverPosition = 0;
  //   this.clover = document.createElement('img');
  //   this.clover.setAttribute('src', '../assets/clover.png');
  //   this.clover.setAttribute('class', 'clover');
  //
  //   this.clover.style.left = '0px';
  //   this.clover.style.position = 'absolute';
  //   this.clover.style.bottom =  '50px';
  //   this.clover.style.left = positionX + 'px';
  //   this.clover.style.height = '60px';
  //
  //   this.gameHolder.appendChild(this.clover);
  //
  // }
  clearElements() {
    let children = this.gameHolder.childNodes;
    children.forEach((child)=>{
      if(child.className === 'cloud' || child.className === 'beer' || child.className === 'star'){
        this.gameHolder.removeChild(child);
      }
    });
    }
  randomizeExistingBeer(beer){
    beer.positionY = this.getRandomInt(-150, -50);
    beer.positionX = this.getRandomInt(this.roadStart, this.roadEnd);
    beer.img.style.left =  beer.positionX + 'px';
    setTimeout(function () {
      beer.img.style.visibility = 'visible';
    },100);
  }
  randomizeCloud(cloud){
    //randomize y postion
    cloud.positionY = this.getRandomInt(100, this.maxHeight);
    cloud.positionX = this.getRandomInt(-100, -250);
    cloud.speed = this.getRandomInt(1,3);
    cloud.img.style.left = cloud.positionX + 'px';
    cloud.img.style.bottom = cloud.positionY +'px';
  }
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  setRoad(){
    let originalRoadWidth = this.maxWidth * 0.95;
    let roadWidth =  Math.round(originalRoadWidth -originalRoadWidth *0.26);
    console.log(roadWidth, 'road with on elf position');

    let margin = (originalRoadWidth - roadWidth) / 2;
    this.roadStart = margin + 40;
    this.roadEnd = roadWidth;
    this.road.style.width = this.maxWidth * 0.95 + 'px';

  }
  collectClover(){
    this.collectedClovers++;
    this.cloverPosition = -450;
    this.clover.style.bottom = '-450px';
  }
  checkOnRoad(){
    if(this.health <= 0){
      this.clearElements();
      if(this.isRunning){
        this.gameOver();
      }
    }
    if(this.currentPosition >= (this.roadStart-15) && this.currentPosition <= (this.roadEnd+15)){
    }else{
      this.health = this.health - 0.40;
    }

    if(this.score > 1 && this.score <= 2){
      this.showPopUp = true;
    }
    if(this.score > 2){
      this.showPopUp = false;

    }
  }
  gameOver(){
    this.backgroundSong.pause();
    this.isGameOver = true;

    // this.isRunning = !this.isRunning;
    // this.tick.unsubscribe();
    // this.dialog.open(GameOverDialog, {
    //   width: 'auto',
    //   minWidth: '300px',
    // });
  }
  animateHeart(){
    if(this.health<= 0){
      this.heart.src = "assets/heart/11.png";
    }
    if(this.health > 0 && this.health <= 5){
      this.heart.src = "assets/heart/10.png";
    }
    if(this.health > 5 && this.health <= 10){
      this.heart.src = "assets/heart/9.png";
    }
    if(this.health > 10 && this.health <= 20){
      this.heart.src = "assets/heart/8.png";
    }
    if(this.health > 20 && this.health <= 30){
      this.heart.src = "assets/heart/7.png";
    }
    if(this.health > 30 && this.health <= 40){
      this.heart.src = "assets/heart/6.png";
    }
    if(this.health > 40 && this.health <= 50){
      this.heart.src = "assets/heart/5.png";
    }
    if(this.health > 50 && this.health <= 60){
      this.heart.src = "assets/heart/4.png";
    }
    if(this.health > 60 && this.health <= 70){
      this.heart.src = "assets/heart/3.png";
    }
    if(this.health > 70 && this.health <= 80){
      this.heart.src = "assets/heart/2.png";
    }
    if(this.health > 80 && this.health <= 90){
      this.heart.src = "assets/heart/1.png";
    }
    if(this.health > 90 && this.health <= 100){
      this.heart.src = "assets/heart/0.png";
    }
  }
  setIsReady(){
    this.backgroundSong  =<HTMLAudioElement> document.getElementById("backgroundSong");
    this.gameOverSong  =<HTMLAudioElement> document.getElementById("gameOverSong");

    this.backgroundSong.volume = 0.2;
    this.isReady = true;
    // console.log('here')

  }


// Try to mute all video and audio elements on the page
   mutePage() {
    this.isMute = !this.isMute;
    let videos = Array.from(document.querySelectorAll("video"));
    let audios = Array.from(document.querySelectorAll("audio"));
     videos.forEach.call(videos, (video) => {
       video.muted =  this.isMute;
     });
     audios.forEach.call(audios, (audio) => {
       audio.muted =  this.isMute;
     });
  }
}

