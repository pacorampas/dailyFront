function cardService(elementCard, flipListener){
	if(flipListener === undefined) {
		flipListener = true;
	}

	this.card = elementCard;
	this.flipper = this.card.parentNode;

	if(flipListener){
		this.flipAction();
	}
};

cardService.prototype.printData = function(daily){
	if(!daily){
		return;
	}
	
	var valueFront = this.card.querySelector('#value-front');
	var valueBack = this.card.querySelector('#value-back');
	valueFront.textContent = daily.value;
	if(daily.explanation){
		valueBack.textContent = daily.explanation;
	}
	var fontSize = 36;
	var lin = 36;
	while(valueFront.offsetHeight > 260){
		fontSize--;
		valueFront.style.fontSize = fontSize+'px';
	}
	var fontSize = 36;
	while(valueBack.offsetHeight > 260){
		fontSize--;
		valueBack.style.fontSize = fontSize+'px';
	}
}

cardService.prototype.flipAction = function(val){
	this.flipper.addEventListener('click', function(e){
		e.stopPropagation();
		e.preventDefault();
		this.classList.toggle('flip');
	});
}

cardService.prototype.flipToFront = function(){
	this.flipper.classList.remove('flip');
}

cardService.prototype.changeBackText = function(text){
	var valueBack = this.card.querySelector('#value-back');
	valueBack.textContent = text;
	valueBack.style.fontSize = '4rem';
}

cardService.prototype.check = function(check){
	var back = this.card.querySelector('.back');
	back.setAttribute('check', check);
}

cardService.prototype.flipToBack = function(){
	this.flipper.classList.add('flip');
}