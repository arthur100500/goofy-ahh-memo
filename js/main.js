// DOM ELEMENTS
const canv = document.querySelector("#main");
const attemptCounter = document.querySelector("#attempts");

// CONSTANTS
const delayTime = 1000;
// should be in cards directory
// should contain a.mp3 and i.png
const filenames_mini = ["notification", "skull", "toilet", "xmax"];
const filenames = ["saul", "amogus", "waltuh", "moyai", "hector", "iphone", "bonk", "glass", "avocado", "natalya", "notification", "skull", "xmax", "pufferfish"];
const attemptText = "Wrongs: ";
const frcount = 7;

// GLOBAL VARS
var selected = null;
var blocked = false;
var allCards = [];
var attempts = 0;

function genCards(){
	for (const element of filenames) {
		let img = 'cards/' + element + '/i.png';
		for(let i = 0; i < 2; i++){
			let audio = new Audio('cards/' + element + '/a.mp3');
			audio.volume = 0.2;
			let c = new Card(img, audio);
			c.innerElem.onclick = () => {selectCard(c)}
			allCards.push(c);
		}
	}
	allCards = allCards
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);
		
	for (const element of allCards) {
		canv.appendChild(element.elem);
	}
}

function updateAttempts(){
	attemptCounter.innerHTML = attemptText + "<b>" + attempts + "</b>";
	attempts += 1;
}

function selectCard(card){
	if (blocked) 
		return;
	
	if (card.isSelected)
		return;
	
	card.selectItem();
	
	if ((selected == null)){
		selected = card;
		return;
	}
	
	if (selected.img == card.img){
		setTimeout(() => {blocked = false;});
	}
	else {
		let selectedcp = selected;
		updateAttempts();
		setTimeout(() => {
			selectedcp.deselectItem();
			card.deselectItem();
			blocked = false;
		}, delayTime);
	}
	
	blocked = true;
	selected = null;
}

class Card{
	constructor(img, audio){
		this.img = img;
		this.isSelected = false;
		this.elem = document.createElement("div");
		this.elem.className = "flip-card";
		this.innerElem = document.createElement("div");
		this.innerElem.className = "flip-card-inner";
		this.innerElem.innerHTML = `    
<div class="flip-card-front">
	⭐️
</div>
<div class="flip-card-back">
	<img class="card-img" src="${this.img}">
</div>`
		this.elem.appendChild(this.innerElem);
		this.audio = audio;
	}
	
	
	getElem(){
		return this.elem;
	}
	
	selectItem(){
		this.audio.play();
		this.elem.className = "flip-card-selected";
		this.isSelected = true;
	}
	
	deselectItem(){
		this.elem.className = "flip-card";
		this.isSelected = false;
	}
}


function setGrid(){
	canv.style.gap = "" + 80 / frcount + "px";
	
	if(window.innerHeight < window.innerWidth){
		canv.style.gridTemplateColumns = "1fr ".repeat(frcount);
	}
	else {
		canv.style.gridTemplateColumns = "1fr ".repeat(filenames.length / frcount * 2);
	}
}

genCards();
updateAttempts();

setGrid();
addEventListener("resize", (event) => {setGrid();});