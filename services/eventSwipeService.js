function eventSwipeService(dragElement, callBackStart, callBackMove, callBackEnd){
	var self = this;
	this.draggable = dragElement;
	this.posX = 0;
	this.posY = 0;
	this.startX = 0;
	this.startY = 0;
	this.moveX = 0;
	this.moveY = 0;
	this.diffX = 0;
	this.diffY = 0;

	this.draggable.addEventListener('touchstart', function(){
		self.startX = event.touches[0].pageX;
		self.startY = event.touches[0].pageY;
	
		if(callBackStart){
			callBackStart(self);
		}
	})

	this.draggable.addEventListener('touchmove', function(){
		var prevDiffX = self.diffX;
		var prevDiffY = self.diffY;

		self.moveX = event.touches[0].pageX;
		self.moveY = event.touches[0].pageY;
		
		self.diffX = self.moveX - self.startX;
		self.diffY = self.moveY - self.startY;

		var addX = self.diffX - prevDiffX;
		var addY = self.diffY - prevDiffY;
		self.posX = self.posX + addX;
		self.posY = self.posY + addY;

		if(callBackMove){
			callBackMove(self, addX, addY);
		}
	})

	this.draggable.addEventListener('touchend', function(){
		self.diffX = 0;
		self.diffY = 0;
		if(callBackEnd){
			callBackEnd(self);
		}
	})
}

eventSwipeService.prototype.resetValues = function(){
	this.posX = 0;
	this.posY = 0;
	this.startX = 0;
	this.startY = 0;
	this.moveX = 0;
	this.moveY = 0;
	this.diffX = 0;
	this.diffY = 0;
}
	