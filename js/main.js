// DOM ELEMENTS
const canv = document.querySelector("#main");
const game = document.querySelector("#game");
const attemptCounter = document.querySelector("#attempts");
const winMatchedCnt = document.querySelector("#matched-cnt");
const winTimeCnt = document.querySelector("#time-cnt");
const winAttemptCnt = document.querySelector("#attempt-cnt");
const winPercentCnt = document.querySelector("#correct-percent");
const winDiff = document.querySelector("#diff-cnt");
const winDiv = document.querySelector("#scores");
const restartButton = document.querySelector("#restart");
const variantsDiv = document.querySelector("#variants");

// CONSTANTS
const delayTime = 1000;
// should be in cards directory
// should contain a.mp3 and i.png
const all_filenames = [
	"saul",
	"amogus",
	"waltuh",
	"moyai",
	"hector",
	"iphone",
	"bonk",
	"glass",
	"avocado",
	"natalya",
	"notification",
	"skull",
	"xmax",
	"pufferfish",
	"toilet",
	"harumachi",
	"burger",
	"burgir",
];
const attemptText = "Wrongs: ";
const matchedText = "Cards matched: ";
const timeText = "Time spent: ";
const attemptCntText = "Times clicked: ";
const percentText = "Accuracy: ";
const beatenText = "You have beaten: ";

// GLOBAL VARS
var selected = null;
var blocked = false;
var allCards = [];
var attempts = 0;
var corrects = 0;
var start = null;
var frcount = 2;
var diffChosen = null;
var filenames = [];

// SHUFFLE FILES
all_filenames_shuffled = all_filenames
		.map(value => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

// VARIANTS
const variants = {
	"2 pairs (⭐)" : {width: 2, cards: all_filenames_shuffled.slice(0, 2)}, 
	"4 pairs (⭐⭐)" : {width: 4, cards: all_filenames_shuffled.slice(0, 4)}, 
	"6 pairs (⭐⭐)" : {width: 4, cards: all_filenames_shuffled.slice(0, 6)}, 
	"8 pairs (⭐⭐⭐)" : {width: 4, cards: all_filenames_shuffled.slice(0, 8)},
	"12 pairs (⭐⭐⭐⭐)" : {width: 6, cards: all_filenames_shuffled.slice(0, 12)},
}


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
	
	if (start == null)
		start = Date.now();
	
	card.selectItem();
	
	if ((selected == null)){
		selected = card;
		return;
	}
	
	if (selected.img == card.img){
		setTimeout(() => {blocked = false;});
		corrects += 2;
		if (corrects === allCards.length)
			showWinScreen();
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

function prettifyTime(ms){
	let s = Math.floor(ms / 1000) % 60;
	let m = Math.floor(ms / 1000 / 60) % 60;
	let h = Math.floor(ms / 1000 / 60 / 60);
	
	return h + ":" + m + ":" + s;
}

function showWinScreen(){
	let elapsed = Date.now() - start;
	function showScore(){
		game.style.display = 'none';
		
		winMatchedCnt.innerHTML = matchedText + "<b>" + filenames.length + "</b>";
		winTimeCnt.innerHTML = timeText + "<b>" + prettifyTime(elapsed) + "</b>";
		winAttemptCnt.innerHTML = attemptCntText + "<b>" + (attempts + filenames.length) + "</b>";
		winPercentCnt.innerHTML = percentText + "<b>" + Math.floor(filenames.length * 2 / (attempts + filenames.length * 2) * 100) + "%" + "</b>";
		winDiff.innerHTML = beatenText + "<b>" + diffChosen + "</b>";
		winDiv.className = "scores-show";
	}
	game.className = "null-opacity";
	setTimeout(showScore, 1000);
}

function startGame(){
	variantsDiv.style.display = "none";
	genCards();
	updateAttempts();
	setGrid();
}

function selectFilenames(variant){
	for (let variant in variants){
		let elem = document.createElement("div");
		elem.innerHTML = variant;
		elem.className = "var-option";
		elem.onclick = (() => {
			frcount = variants[variant].width;
			filenames = variants[variant].cards;
			setTimeout(startGame, 1000);
			variantsDiv.className += " null-opacity";
			diffChosen = variant;
		});
		variantsDiv.appendChild(elem);
	}
}

selectFilenames("4 pairs");

addEventListener("resize", (event) => {setGrid();});
restartButton.onclick = (() => {location.reload();});