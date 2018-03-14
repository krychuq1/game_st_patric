export class CloudModel{
  positionY: number;
  positionX: number;
  speed: number;
  id: string;
  img: HTMLElement;
  constructor(positionY: number, positionX: number, speed, id, img: HTMLElement){
    this.speed = speed;
    this.id = id;
    this.img = img;
    this.positionY = positionY;
    this.positionX = positionX;

  }
}
