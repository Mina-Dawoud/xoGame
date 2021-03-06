import { Component } from '@angular/core';
import { xoModel } from './xo.model';
import { ValueTransformer } from '../../node_modules/@angular/compiler/src/util';
import { Howl } from 'howler'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private firstCharacter = 'X';
  private secondCharacter = 'O';
  character = this.firstCharacter;
  nextOrder = 0;
  winnerIndexes: number[];
  xoTable: xoModel[];
  isStop: boolean;
  xCounter: number = 0;
  oCounter: number = 0;
  successIndexes: number[][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  celebrationSound = new Howl({
    src:["./../assets/audios/cheer.mp3"],
    html5: true
  });

  constructor() {
    this.reset();
  }

  private fillXOTableWithEmpty() {
    this.xoTable = [];
    for (let index = 0; index < 10; index++) {
      this.xoTable.push(new xoModel());
    }
  }

  changeCharacter() {
    this.character = this.character === this.firstCharacter ? this.secondCharacter : this.firstCharacter;
  }

  setCharacter(index: number) {
    if (!this.isExists(index) && !this.isStop) {
      this.xoTable[index].value = this.character;
      this.xoTable[index].order = this.nextOrder++;
      this.checkWinner();
      this.changeCharacter();
    }
  }

  backOneStep() {
    if (!this.isStop) {
      const indexOfMaxOrder = this.xoTable.findIndex(cell => cell.order === this.nextOrder - 1);
      this.xoTable[indexOfMaxOrder].value = '';
      this.xoTable[indexOfMaxOrder].order = -1;
      this.nextOrder--;
      this.changeCharacter();
    }
  }

  private isExists(index: number) {
    return this.xoTable[index].value;
  }

  getStyle(index: number) {
    if (this.winnerIndexes.includes(index)) {
      return 'success';
    }
    return this.xoTable[index].value === this.firstCharacter ? 'firstCharacter-style' : 'secondCharacter-style';
  }

  private checkWinner() {
    const indexesOfCurrentCharacter: number[] = [];
    this.xoTable.forEach((cell, index) => {
      if (cell.value === this.character) {
        indexesOfCurrentCharacter.push(index);
      }
    });

    this.successIndexes.forEach(indexes => {
      if (indexesOfCurrentCharacter.includes(indexes[0])
        && indexesOfCurrentCharacter.includes(indexes[1])
        && indexesOfCurrentCharacter.includes(indexes[2])) {
        this.winnerIndexes = indexes;
        if (this.character === this.firstCharacter) {
          this.xCounter++;
          document.getElementById("xo-container").classList.add('celebration');
          this.playCelebration();
          debugger
          setTimeout(() => {
            debugger
            document.getElementById("xo-container").classList.remove('celebration');
            this.pauseCelebration();
          }, 3000);
        } else {
          this.oCounter++;
        }
        this.isStop = true;
        return;
      }
    });
  }

  reset() {
    this.winnerIndexes = [];
    this.character = this.firstCharacter;
    this.fillXOTableWithEmpty();
    this.isStop = false;
  }

  isWinner(character: string) {
    return this.winnerIndexes.length > 0 && character !== this.character;
  }

  playCelebration(){
    this.celebrationSound.play();
  }

  pauseCelebration(){
    this.celebrationSound.pause();
  }
}
