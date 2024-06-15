import { Gameboard } from "./gameboard";
import{Player} from './player';
import './style.css';
import img1 from './1.png';
import img2 from './2.png';
import img3 from './3.png';
import img4 from './4.png';
import img5 from './5.png';

const images = [img5, img4, img3, img2, img1];
const shipState={};
let currentTurn='player1';

function changeTurn(player1,player2){
    let cover1= document.querySelector('.cover1');
    let cover2= document.querySelector('.cover2');

    (currentTurn === 'player1')? currentTurn='player2': currentTurn='player1';
    updateCovers(cover1,cover2,player1,player2);
}

function updateCovers(cover1,cover2,player1,player2) {
    let board1= document.querySelector('.board1');
    let board2= document.querySelector('.board2');

    if (currentTurn === 'player1') {
        player1.board.render(board1);
        player2.board.render(board2);
        let cells =document.querySelectorAll('.board2 .shipCell');
        for(let cell of cells){
            cell.style.backgroundColor='azure';
            cell.style.border='1px solid gray';
        }
        cover1.style.display = 'flex';
        cover2.style.display = 'none';
    } else {
        player2.board.render(board2);
        player1.board.render(board1);
        if(player2.type==='pc'){
            let cells =document.querySelectorAll('.board2 .shipCell');
            for(let cell of cells){
                cell.style.backgroundColor='azure';
                cell.style.border='1px solid gray';
            }
        }
        
        let cells =document.querySelectorAll('.board1 .shipCell');
        for(let cell of cells){
            cell.style.backgroundColor='azure';
            cell.style.border='1px solid gray';
        }
        cover1.style.display = 'none';
        cover2.style.display = 'flex';
    }
}

function openModal(){
    let body=document.querySelector('body');
    let cont =document.createElement('div');
    cont.classList.add('modalContainer');
    let modal=document.createElement('div');
    modal.classList.add('modalContent');
    let text=document.createElement('h2');
    text.textContent=currentTurn+" WINS!";
    let btn=document.createElement('button');
    btn.type='button';
    btn.textContent='New Game';
    btn.classList.add('modalButton');
    btn.addEventListener('click',()=>{
        cont.style.display='none';
        home();
    });

    modal.append(text,btn);
    cont.appendChild(modal);
    body.append(cont);

}

function pcTurn(player1,player2){
    let cont1= document.querySelector('.board1');
    let x=Math.floor(Math.random()*10);
    let y=Math.floor(Math.random()*10);
    if(player1.board.rows[y][x] === 'hit' || player1.board.rows[y][x] === 'miss'){
        x=Math.floor(Math.random()*10);
        y=Math.floor(Math.random()*10);
    }
    player1.board.receiveAttack(x,y);
    player1.board.render(cont1);

    changeTurn(player1,player2);
}

function attack(e,player1,player2){
    let cell=e.target;
    let x=cell.dataset.x;
    let y=cell.dataset.y;

    if(!x || !y)
        return;
    if(currentTurn === 'player1'){
        player2.board.receiveAttack(x,y);
    }
    else{
        player1.board.receiveAttack(x,y);
    }
    
    if(player1.board.checkAllShipsSunk() || player2.board.checkAllShipsSunk()){
        openModal();
        return;
    }
    if(player2.type==='pc'){
        setTimeout(()=>pcTurn(player1,player2),2000);   
        changeTurn(player1,player2); 
    }
    else{
        changeTurn(player1,player2);
    }
       
}

function handleChange(e,board,grid){
    const xValue=e.target.parentElement.parentElement.querySelector('input[id="x"]').value;
    const yValue=e.target.parentElement.parentElement.querySelector('input[id="y"]').value;
    const vertical= e.target.parentElement.parentElement.querySelector('input[id="vertical"]').checked;
    const length=e.target.parentElement.parentElement.parentElement.querySelector('.top p').innerText.slice(-1);
    let shipId=length;

    if (shipState[shipId]) {
        const { x, y, vertical: oldvertical } = shipState[shipId];
        board.removeShip(x, y, length, oldvertical);
    }

    if(xValue && yValue){
        if(isValidPlacement(board,length,xValue,yValue,vertical)){
            board.placeShip(length,xValue,yValue,vertical);
            shipState[shipId]={ x: xValue, y: yValue, vertical: vertical };
        }
        board.render(grid);
    }
}

function game(pl1,pl2='pc'){
    let player1 = new Player('real',pl1);
    let player2;
    if(pl2 === 'pc'){
        player2 = new Player('pc','PC');
    }
    else{
        player2 = new Player('real',pl2);
    }
    let body=document.querySelector('body');
    body.innerHTML='';
    let cont = document.createElement('div');
    cont.classList.add('newContainer');
    let title=document.createElement('h2');
    title.innerText='Place your ships';
    cont.appendChild(title);
    let left=document.createElement('div');
    left.classList.add('leftContainer');
    let grid = document.createElement('div');
    grid.classList.add('grid');
    let gb= new Gameboard();
    gb.render(grid);
    left.appendChild(grid);
    cont.appendChild(left);

    let right=document.createElement('div');
    right.classList.add('rightContainer');
    
    for(let i=5;i>=1;i--){
        let item=document.createElement('div');
        item.classList.add('rightItem');
        let cont3=document.createElement('div');
        cont3.classList.add('top');
        let img=document.createElement('img');
        img.src=images[5-i];
        img.classList.add('shipImage');
        let p=document.createElement('p');
        p.innerText='Length: '+i;
        cont3.append(img,p);
        let cont4=document.createElement('div');
        cont4.classList.add('bottom');
        let xCont=document.createElement('div');
        xCont.classList.add('labelCont');
        let xL = document.createElement('label');
        xL.for='x';
        xL.innerText='X';
        let x=document.createElement('input');
        x.type='num';
        x.id='x';
        x.required=true;
        x.dataset.len=i
        xCont.append(xL,x);
        let yCont=document.createElement('div');
        yCont.classList.add('labelCont');
        let yL = document.createElement('label');
        yL.for='x';
        yL.innerText='Y';
        let y=document.createElement('input');
        y.type='num';
        y.id='y';
        y.required=true;
        y.dataset.len=i
        let check=document.createElement('input');
        check.type='checkbox';
        check.checked=false;
        check.id='vertical';
        let lbl=document.createElement('label');
        lbl.for='vertical';
        lbl.textContent='Vertical';
        let checkCont=document.createElement('div');
        checkCont.classList.add('labelCont');
        checkCont.append(lbl,check);
        x.addEventListener('change',(e)=>{
            handleChange(e,gb,grid);
        });
        y.addEventListener('change',(e)=>{
            handleChange(e,gb,grid);
        });
        check.addEventListener('change',(e)=>{
            handleChange(e,gb,grid);
        });
        yCont.append(yL,y);
        cont4.append(xCont,yCont,checkCont);
        item.append(cont3,cont4);
        right.appendChild(item);
    }
    let btnCont=document.createElement('div');
    btnCont.classList.add('btnContainer');
    let btn = document.createElement('button');
    btn.type='button';
    btn.innerText='Start Game';
    btn.addEventListener('click',()=>{
        startGame(gb,player1,player2);
    });
    btnCont.appendChild(btn);
    cont.appendChild(right);
    cont.appendChild(btnCont);
    body.appendChild(cont);
   
}

function buildPCBoard() {
    let board=new Gameboard()
    for (let i = 5; i >= 1; i--) {
        let placed = false;
        while (!placed) {
            let x = Math.floor(Math.random() * 10);
            let y = Math.floor(Math.random() * 10);
            let vert= Math.random() <0.5;

            if (isValidPlacement(board, i, x, y,vert)) {
                board.placeShip(i, x, y, vert);
                placed = true;
            }
        }
    }
    return board;
}

function isValidPlacement(board, size, x, y,vertical) {
    x = parseInt(x, 10);
    y = parseInt(y, 10);
    size = parseInt(size,10);

    if(vertical){
        if (y + size > 10) return false;
        for (let i = 0; i < size; i++) {
            if (board.rows[y + i][x]) return false;
        }
    }else{
        if (x + size > 10) return false;
        for (let i = 0; i < size; i++) {
            if (board.rows[y][x + i]) return false;
        }
    }
    return true;
}

function startGame(board,player1,player2){
    document.body.innerHTML='';
    let title = document.createElement('h1');
    title.id = 'title';
    title.innerText = 'BATTLESHIP';

    let container = document.createElement('div');
    container.classList.add('container');

    let div1 = document.createElement('div');
    div1.classList.add('player1');

    let player1Title = document.createElement('h2');
    player1Title.innerText = 'Your Board';

    let board1 = document.createElement('div');
    board1.classList.add('board1');

    let cover1 = document.createElement('div');
    cover1.classList.add('cover1');
    cover1.innerText = 'Your Turn';

    div1.appendChild(player1Title);
    div1.appendChild(board1);
    div1.appendChild(cover1);

    let div2 = document.createElement('div');
    div2.classList.add('player2');

    let player2Title = document.createElement('h2');
    player2Title.innerText = 'Opponent Board';

    let board2 = document.createElement('div');
    board2.classList.add('board2');

    let cover2 = document.createElement('div');
    cover2.classList.add('cover2');
    cover2.innerText = "Opponent's turn";

    div2.appendChild(player2Title);
    div2.appendChild(board2);
    div2.appendChild(cover2);

    container.appendChild(div1);
    container.appendChild(div2);

    document.body.appendChild(title);
    document.body.appendChild(container);
    cover2.style.display='none';

    player1.board=board;
    player2.board=buildPCBoard();   
    player1.board.render(board1);
    player2.board.render(board2);
    if(player2.type==='pc'){
        let cells =document.querySelectorAll('.board2 .shipCell');
        for(let cell of cells){
            cell.style.backgroundColor='azure';
            cell.style.border='1px solid gray';
        }
    }
    console.log(player2);
    board1.addEventListener('click',(e)=>attack(e,player1,player2));
    board2.addEventListener('click',(e)=>attack(e,player1,player2));
    updateCovers(cover1,cover2,player1,player2);
}

function handleGamemode(){
    let name = document.getElementById('name').value;
    let vs = document.getElementsByName('vs');
    for(let elem of vs ){
        if (elem.checked && elem.value ==='pc')
            game(name);
        else if ( elem.checked && elem.value==='hu')
            game(name,'player 2');
    }
}

function home(){
    document.body.innerHTML='';
    let cont = document.createElement('div');
    cont.classList.add('homeContainer');
    let h2 = document.createElement('h2');
    h2.textContent='BATTLESHIPS';
    h2.id='title';
    cont.appendChild(h2);
    let formCont=document.createElement('div');
    let left=document.createElement('div');
    left.classList.add('left');
    let h3=document.createElement('label');
    h3.textContent='Insert your name';
    h3.for='name';
    left.appendChild(h3);
    let input=document.createElement('input');
    input.type='text';
    input.id='name'
    input.required=true;
    left.appendChild(input);
    formCont.appendChild(left);
    
    let right=document.createElement('div');
    right.classList.add('right');
    let h32 = document.createElement('h3');
    h32.innerText='Select gamemode';

    right.appendChild(h32);
    let cont2=document.createElement('div');
    cont2.classList.add('innerRight');
    let div3=document.createElement('div');
    let div4=document.createElement('div');
    let lbl1=document.createElement('label');
    lbl1.textContent='play versus the PC';
    lbl1.for='vsPc';
    let lbl2=document.createElement('label');
    lbl2.textContent='play versus your friend (local)';
    lbl2.for='vsHu';

    let input2=document.createElement('input');
    input2.type='radio';
    input2.id='vsPc';
    input2.name='vs';
    input2.checked='true';
    input2.value='pc';
    let input3=document.createElement('input');
    input3.type='radio';
    input3.id='vsHu';
    input3.name='vs';
    input3.value='hu';
    div3.append(input2,lbl1);
    div4.append(input3,lbl2);
    cont2.append(div3,div4);
    right.appendChild(cont2);
    formCont.appendChild(right);
    let btn=document.createElement('button');
    btn.type='button';
    btn.innerText='Continue';
    btn.addEventListener('click',handleGamemode);
    cont.appendChild(formCont);
    cont.appendChild(btn);
    document.body.appendChild(cont);
}
home();
