import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Room } from '../models/room';
import { Player } from '../models/player';
import { Tile } from "../models/tile";
import { HttpService } from "../services/http.service";

@Component({
  selector: 'room-detail',
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css'],
  providers: [HttpService]
})

export class RoomDetailComponent implements OnChanges  {
  constructor(private httpService: HttpService){}

  @Input() room: Room;

  players: Player[];
  tiles: Tile[][][];
  maxX: Number;
  maxY: Number;
  maxZ: Number;

  // On change
  ngOnChanges(changes: SimpleChanges): void{
    if(!this.room) { return; }

    // Get the tiles
     this.tiles = [[[]]];
    // Show data about the tiles
    this.httpService.getTilesByGame(this.room.id).then(response => {
      console.log(response);
      let maxX = 0, maxY = 0, maxZ = 0;
      response.forEach(element => {
        if(element.xPos > maxX) { maxX = element.xPos}
        if(element.yPos > maxY) { maxY = element.yPos}
        if(element.zPos > maxZ) { maxZ = element.zPos}
      });

      console.log("X: " + maxX + ". Y: " + maxY + ". Z: " + maxZ);

      // Initialize the array now that we know the sizes
      this.tiles = new Array(maxX);
      for(let i = 0; i < this.tiles.length; i++){
        this.tiles[i] = new Array(maxY);
        for(let j = 0; j < this.tiles[i].length; j++){
          this.tiles[i][j] = new Array(maxZ);
        }
      }

      response.forEach(element => {
        this.tiles[element.xPos][element.yPos][element.zPos] = element;
      });
      this.maxX = maxX; this.maxY = maxY; this.maxZ = maxZ;
    });

    this.players = [];
    this.httpService.getPlayersByGame(this.room.id).then(response => {
      response.forEach(element => {
        this.players.push(element)
      });
    });
  }
}