var swipeMenuService = (function(idSlideMenu, maxWidth) {
	var menu = document.getElementById(idSlideMenu);
	menu.style.webkitTransitionProperty = 'transform';
	var maxWidth = maxWidth;
	var middleWidth = maxWidth*50/100;
	var start = 0;
	var pos = 0;
	var timeStamp = null;
	var dir = 'ltr';

	menu.addEventListener('touchstart', function(){
		start = event.touches[0].pageX;
		menu.style.webkitTransitionDuration = '0';
		timeStamp = event.timeStamp;
	})

	menu.addEventListener('touchmove', function(){
		var movePos = event.touches[0].pageX;
		
		diff = movePos - start;
		start = movePos;
		pos = pos + diff;
		if(pos > maxWidth){
			return;
		}
		
		if(diff > 0){
			//open (left to right)
			dir = 'ltr';
		} else {
			//close (right to left)
			dir = 'rtl';
		}
		
		menu.style.webkitTransform = 'translate3d('+pos+'px,0,0)';
		var percentage = pos/maxWidth;
		openningMenuEvent.percentage = percentage;
		document.dispatchEvent(openningMenuEvent);
	
	})

	menu.addEventListener('touchend', function(){
		var endTimeStamp = event.timeStamp;
		var fastOpen = false;
		
		if( (endTimeStamp - timeStamp) < 200 ){
			//fast swipe
			if(dir === 'ltr'){
				open(200);
			} else {
				close(200);
			}
			var percentage = pos/maxWidth;
			openningMenuEvent.percentage = percentage;
			document.dispatchEvent(openningMenuEvent);
			return;
		}

		if(pos > middleWidth){
			open(100);
		}else{
			close(100);
		}
		var percentage = pos/maxWidth;
		openningMenuEvent.percentage = percentage;
		document.dispatchEvent(openningMenuEvent);
	})


	function open(time, callBack){
		menu.style.webkitTransitionDuration = time+'ms';
		menu.style.webkitTransform = 'translate3d('+maxWidth+'px,0,0)';
		pos = maxWidth;
		if(callBack !== undefined){
			callBack();
		}
	}

	function close(time, callBack){
		menu.style.webkitTransitionDuration = time+'ms';
		menu.style.webkitTransform = 'translate3d(0,0,0)';
		pos = 0;
		if(callBack !== undefined){
			callBack();
		}
	}				

	function toggle(time, callBack){
		var opened = false;
		if(pos === 0){
			open(time);
			opened = true;
		}else{
			close(time);
			opened = false;
		}
		if(callBack !== undefined){
			callBack(opened);
		}
	}

	var openningMenuEvent = document.createEvent('Event');
	openningMenuEvent.initEvent('openningMenuEvent', true, true);

	return {
		open: open,
		close: close,
		toggle: toggle
	}
});
