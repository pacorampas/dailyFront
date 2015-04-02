var ScreenWizard = (function(){
	var swipe = null;
	var wrapperCounterCard, buttonCounterLeft, buttonCounterRight;
	var buttonEndWizard;

	function open(){
		wrapperCounterCard = document.getElementById('wrapper-counter-card')
		buttonCounterLeft = wrapperCounterCard.querySelector('#button-counter-wizard-left');
		buttonCounterRight = wrapperCounterCard.querySelector('#button-counter-wizard-right');
		buttonCounterRight.addEventListener('click', nextStep);
		buttonCounterLeft.addEventListener('click', backStep);
		
		swipe = new IScroll('.wizard-background', {
			scrollX: true,
			scrollY: false,
			momentum: false,

			snap: true,
			snapSpeed: 400,
			keyBindings: true,
			indicators: {
				el: document.getElementById('indicator'),
				resize: false
			}
		})
		
		//click false dont work on android < 4.4
		if(device.platform == 'Android' 
		   && (device.version.substring(0, 1) == 5)
		   || (device.version.substring(0, 1) == 4 
		   	  && device.version.substring(2, 3) == 4)
		){
			swipe.options.click = true;
		}
		
		buttonEndWizard = document.getElementById('button-end-wizard');
		buttonEndWizard.addEventListener('click', goToHome);
	}

	function goToHome(){
		close();
		localStorage.wizard = false;
		Routing.goTo('home');
	}

	function close(){
		wrapperCounterCard = null;
		buttonCounterRight.removeEventListener('click', nextStep);
		buttonCounterLeft.removeEventListener('click', backStep);
		buttonCounterLeft = null;
		buttonCounterRight = null;
		console.log(swipe);
		swipe.destroy();
		console.log(swipe);
		buttonEndWizard.removeEventListener('click', goToHome);
		buttonEndWizard = null;
	}

	function nextStep(){
		swipe.next();
	}

	function backStep(){
		swipe.prev();
	}

	return {
		open: open
	}

}(Routing));

Routing.setController(ScreenWizard);
