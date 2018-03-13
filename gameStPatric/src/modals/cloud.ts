export class CloudModel{
  positionY: number;
  speed: number;
  id: string;
  img: HTMLElement;
  constructor(positionY: number, speed, id, img: HTMLElement){
    this.speed = speed;
    this.id = id;
    this.img = img;
    this.positionY = positionY;

  }
}
