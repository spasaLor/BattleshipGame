export class Ship{
    length;
    hits;
    sunk;
    x;
    y;
    vertical;
    
    constructor(length,x,y,val){
        this.length=length;
        this.hits=0;
        this.sunk=false;
        this.x=x;
        this.y=y;
        this.vertical=val;
    }
    get length(){
        return this.length;
    }
    get hits(){
        return this.hits;
    }
    isSunk(){
        if(this.hits === this.length){
            this.sunk= true;
        }
        return this.sunk;
    }

    hit(){
        this.hits++;
    }

    get coordinates(){
        return {x:this.x, y:this.y}
    }
    get vertical(){
        return this.vertical;
    }
}