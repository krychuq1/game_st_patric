import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material";

@Component({
  selector: 'game-over-dialog',
  templateUrl: './game-over.html',
  styleUrls: ['./game-over.scss']

})

export class GameOverDialog  {

  constructor(public dialogRef: MatDialogRef<GameOverDialog>,
              @Inject(MAT_DIALOG_DATA) public data: any){
  }

  close(){
    this.dialogRef.close();
  }

}
