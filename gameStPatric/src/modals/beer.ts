export class BeerModel{
  positionX: number;
  positionY: number;
  speed: number;
  id: string;
  img: HTMLElement;
  constructor(positionX, positionY: number, speed, id, img: HTMLElement){
    this.positionX = positionX;
    this.speed = speed;
    this.id = id;
    this.img = img;
    this.positionY = positionY;

  }
}
