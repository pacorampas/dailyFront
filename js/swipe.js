var carrousel = (function (idWrapperPanels, idCounter){
	var step = 0;
	var maxStep = null;
	var timeStart = null;
	var touchPos = 0;
	var despl = 0;
	var timeOutId = null;
	var swiping = false;

	var element = null;
	var counter = null;

	element = document.getElementById(idWrapperPanels);
	widthWrapperAndPanels(element);
	maxStep = element.querySelectorAll('.panel-wz').length;
	if(idCounter){
		counter = document.getElementById(idCounter);
		element.dataset.step = step;
		counter.dataset.step = step;
		var numStep = 0;
		while(numStep < maxStep){
			var divStep = document.createElement('div');
			counter.appendChild(divStep);
			numStep++;
		}
		
	}
	
	element.addEventListener("touchstart", function(event){
		event.preventDefault();

		element.classList.remove('transition');
		timeStart = event.timeStamp;
		touchPos = event.touches[0].pageX;
	}, false);
	
	element.addEventListener("touchmove", function(event){
		if(!swiping){
			//element.dispatchEvent(swipingEvent);
		}
		swiping = true;
		
		event.preventDefault();
		var target = event.target;
		var newTouchPos = event.touches[0].pageX;
		var diffTouchPos = newTouchPos - touchPos;
		touchPos = newTouchPos;
		despl = despl + diffTouchPos;
		element.style.transform = 'translate3d('+despl+'px, 0px, 0px)';
	}, false);

	element.addEventListener("touchend", function(event){
		swiping = false;
		event.preventDefault();
		var timeEnd = event.timeStamp; 
		var timeDiff = timeEnd - timeStart;
		fastSwipe = false;
		if(timeDiff < 250){
			fastSwipe = true;
		}
		var theNextStep = nextStepByGesture(fastSwipe);
		goToStep(theNextStep);
	}, false);

	function transitionEnd(){
		element.classList.remove('transition');
		//to force relayout else the touch events are lost
		//http://stackoverflow.com/questions/16703157/android-4-chrome-hit-testing-issue-on-touch-events-after-css-transform
		//element.innerHTML = element.innerHTML;
		element.removeEventListener('transitionend', transitionEnd)
	}

	window.addEventListener("resize", function(){
		widthWrapperAndPanels(element);
		goToStep(step, true);
	});

	function widthWrapperAndPanels(wrapper){
		var panels = wrapper.querySelectorAll('.panel-wz');
		var lengthPanels = panels.length;
		var widthWrapper = lengthPanels * window.innerWidth;
		var widthPanels = widthWrapper/lengthPanels;
		wrapper.style.width = widthWrapper+'px';
		for(var i=0; i < lengthPanels; i++){
			panels[i].style.width = widthPanels+'px';
		}
	}

	function nextStepByGesture(fastSwipe){
		var start = window.innerWidth * (step*-1);
		var end = start - window.innerWidth;
		var width = window.innerWidth;
		var relativeDespl = Math.abs(despl - start);
		var percentage = relativeDespl*100/width;

		if(despl < start ){
			//right
			if( (fastSwipe || percentage > 35) && maxStep > step+1){
				return step+1;
			}
		}else if(despl > start ){
			//left
			if( (fastSwipe || percentage > 35) && step > 0){
				return step-1;
			}
		}
		return step;
	}

	function goToStep(newStep, notTransition){
		if(maxStep <= parseInt(newStep) || 0 > parseInt(newStep)){
			return false;
		}

		step = newStep;
		var start = window.innerWidth * (step*-1);
		touchPos = start;
		despl = start;
		if(!notTransition){
			element.addEventListener('transitionend', transitionEnd, false);
			element.classList.add('transition');
		}
		element.style.transform = 'translate3d('+despl+'px, 0px, 0px)';
		element.dataset.step = step;
		if(counter){
			counter.dataset.step = step;
		}
		
		nextStepEvent.step = step;
		//element.dispatchEvent(nextStepEvent);
	}

	var nextStepEvent = new CustomEvent(
						"nextStepEvent", 
						{
							bubbles: true,
							cancelable: true
						}
					);

	var swipingEvent = new CustomEvent(
						"swipingEvent", 
						{
							bubbles: true,
							cancelable: true
						}
					);

	return {
		goToStep: goToStep
	}
});