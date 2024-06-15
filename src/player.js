import { Gameboard } from "./gameboard";

export class Player{
    type;
    board;
    name;

    constructor(type,name){
        this.board=new Gameboard();
        this.type=type;
        this.name=name;
    }
    set board(board){
        this.board=board;
    }
    get name(){
        return this.name;
    }
}