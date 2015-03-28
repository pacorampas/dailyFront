function cardService(elementCard, flipListener){
	if(flipListener === undefined) {
		flipListener = true;
	}

	this.card = elementCard;
	this.flipper = this.card.parentNode;
	this.valueFront = this.card.querySelector('.value-front');
	this.valueBack = this.card.querySelector('.value-back');

	if(flipListener){
		this.flipAction();
	}
};

cardService.prototype.printData = function(daily){
	if(!daily){
		return;
	}
	
	this.valueFront.textContent = daily.value;
	if(daily.explanation){
		this.valueBack.textContent = daily.explanation;
	}
	var fontSize = 36;
	var lin = 36;
	console.log(this.valueBack.offsetHeight +' > '+ 230);
	while(this.valueFront.offsetHeight > 230){
		fontSize--;
		this.valueFront.style.fontSize = fontSize+'px';
	}
	var fontSize = 36;
	while(this.valueBack.offsetHeight > 230){
		fontSize--;
		this.valueBack.style.fontSize = fontSize+'px';
	}
}

cardService.prototype.flipAction = function(val){
	this.flipper.addEventListener('click', function(e){
		e.stopPropagation();
		this.classList.toggle('flip');
	});
}

cardService.prototype.flipToFront = function(){
	this.flipper.classList.remove('flip');
}

cardService.prototype.changeBackText = function(text){
	this.valueBack.textContent = text;
	this.valueBack.style.fontSize = '4rem';
}

cardService.prototype.check = function(check){
	var back = this.card.querySelector('.back');
	back.setAttribute('check', check);
}

cardService.prototype.flipToBack = function(){
	this.flipper.classList.add('flip');
}