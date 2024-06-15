import {Ship} from './ship';

export class Gameboard{
    rows={};
    shipParts;

    constructor(){
        this.shipParts=15;
        for (let i =0;i<10;i++){
            this.rows[i]=new Array(10).fill(false);
        }
    }

    placeShip(size,xCoord,yCoord,vertical){
        xCoord = parseInt(xCoord, 10);
        yCoord = parseInt(yCoord, 10);
        size = parseInt(size,10);

        let ship = new Ship(size,xCoord,yCoord,vertical);
        if (vertical) {
            if (yCoord + size > 10) {
                throw new Error("Ship goes out of bounds vertically");
            }
        } else {
            if (xCoord + size > 10) {
                throw new Error("Ship goes out of bounds horizontally");
            }
        }
        if(vertical){
            for(let i =0;i<size;i++){
                if (this.rows[yCoord + i][xCoord]) {
                    throw new Error("Overlap detected");
                }
                this.rows[yCoord+i][xCoord] = ship;
            }
        }
        else{
           for(let i=0;i<size;i++){
                if (this.rows[yCoord][xCoord + i]) {
                    throw new Error("Overlap detected");
                }
                this.rows[yCoord][xCoord+i] = ship;
           }
        }
    }

    receiveAttack(xCoord,yCoord){
        let ship;
        if(this.rows[yCoord][xCoord] !== false){
            ship =this.rows[yCoord][xCoord];
            ship.hit();
            this.rows[yCoord][xCoord]="hit";
        }else{
            this.rows[yCoord][xCoord]="miss";
        }
    }

    checkAllShipsSunk(){
        let count=0;
        for(let i=0;i<10;i++){
            for (let j=0;j<10;j++){
                if(this.rows[i][j] === 'hit')
                    count++;
            }
        }
       return (count === this.shipParts);
    }

    render(container){
        container.innerHTML='';
        for(let i=0;i<10;i++){
            for (let j=0;j<10;j++){
                if(this.rows[i][j] === false){
                    let empty=document.createElement('div');
                    empty.classList.add('emptyCell');
                    empty.dataset.x=j;
                    empty.dataset.y=i;
                    container.appendChild(empty);
                }
                else if(this.rows[i][j] === 'hit'){
                    let hit=document.createElement('div');
                    hit.classList.add('hitCell');
                    hit.dataset.x=j;
                    hit.dataset.y=i;
                    container.appendChild(hit);
                }
                else if(this.rows[i][j] === 'miss'){
                    let miss=document.createElement('div');
                    miss.classList.add('missCell');
                    miss.dataset.x=j;
                    miss.dataset.y=i;
                    container.appendChild(miss);
                }
                else{
                    let ship=document.createElement('div');
                    ship.classList.add('shipCell');
                    ship.dataset.x=j;
                    ship.dataset.y=i;
                    container.appendChild(ship);
                }
            }
        }
    }
    removeShip(x, y, size, vertical) {
        x = parseInt(x, 10);
        y = parseInt(y, 10);
        size = parseInt(size,10);

        if (vertical) {
            for (let i = 0; i < size; i++) {
                this.rows[y + i][x] = false;
            }
        } else {
            for (let i = 0; i < size; i++) {
                this.rows[y][x + i] = false;
            }
        }
    }

}
