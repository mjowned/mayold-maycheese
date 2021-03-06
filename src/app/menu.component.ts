import { Component, Pipe, PipeTransform, OnInit } from '@angular/core';

import { Room } from "../models/room";
import { Tile } from "../models/tile";
import { Template } from "../models/template";
import { HttpService } from "../services/http.service";

@Pipe({name: 'roomFilter'})
export class RoomFilterPipe implements PipeTransform {
    transform(value: any, state: String): Room[] {
      if(!value || !state){ return value; }
      var rooms = [];
      value.forEach(element => {
        if(element.state == state){
          rooms.push(element);  
        }
      });
      return rooms;
    }
}

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./app.component.css'],
  providers: [HttpService]
})
export class MenuComponent implements OnInit {

  constructor(private httpService: HttpService){}

  title = 'Tour of Rooms';
  rooms: Room[];
  selectedRoom: Room;
  selectedTemplate: Template;
  selectedState: String;
  templates: Template[];
  minPlayers = 2;
  maxPlayers = 5;

  ngOnInit(): void{
    this.load()
  }
  load(): void {
    this.httpService.getOpenRooms().then(rooms => this.rooms = rooms);
    this.httpService.getRoomTemplates().then(templates => this.templates = templates);
  }
  onRoomSelect(room: Room): void {
    this.selectedRoom = room;
    
    // Show data about which players are in the room
    // this.httpService.getPlayersByGame(room.id).then(response => {
    //   let players = "";
    //   response.forEach(element => {
    //     players += "\n " + element._id
    //   });
    //   alert("There are " + response.length + " players in this room. \n" + players)
    // });
  }
  joinRoom(room: Room): void {
    this.isPlayerInRoom(room, (check: Boolean) => { 
      if(check){
        alert("You are already in this room, silly! :p")
      }
      else{
        this.httpService.postJoinRoom(room.id);
        alert("Join successful!")
      }
    })
  }

  // ,,
  // !!! TILE MATCHING LOGICA MOET IN DE CLIENT !!!
  // ^^

  // Works with callback
  isPlayerInRoom(room: Room, callback: (boolean) => void): void { 
    this.httpService.getPlayersByGame(room.id).then(response => {
      let match = response.find(player => player._id == "wm.aarts@student.avans.nl")
      callback(match)
    });
  }

  onTemplateSelect(template: Template): void {
    this.selectedTemplate = template;
  }
  createRoom(): void {
    let min = this.minPlayers
    let max = this.maxPlayers
    let template = this.selectedTemplate
    if(min >= max){
      alert("Maximum amount of players must be higher than the minimum amount of players!");
    } else if(min < 2 || max < 2 ){
      alert("Minimal and maximal amount of players both have to be at least 2!");
    } else if(template == undefined){
      alert("No template selected!");
    } else{
      // Do the POST request
      this.httpService.postNewRoom(template, min, max).then(r => alert("Room creation successful!"));
    }
  }
}
