var ScreenWizard = (function(){
	var swipe = null;
	var buttonCounterLeft, buttonCounterRight;
	var buttonEndWizard;

	function open(){
		buttonCounterLeft = document.getElementById('button-counter-wizard-left');
		buttonCounterRight = document.getElementById('button-counter-wizard-right');
		buttonCounterRight.addEventListener('click', nextStep);
		buttonCounterLeft.addEventListener('click', backStep);
		swipe = carrousel('wizard-wrapper', 'counter-card');

		buttonEndWizard = document.getElementById('button-end-wizard');
		buttonEndWizard.addEventListener('touchstart', goToHomePress);
		buttonEndWizard.addEventListener('touchend', goToHome);
	}

	function goToHome(){
		buttonEndWizard.classList.remove('pressed');
		close();
		localStorage.wizard = false;
		Routing.goTo('home');
	}

	function goToHomePress(){
		buttonEndWizard.classList.add('pressed');
	}

	function close(){
		buttonCounterRight.removeEventListener('click', nextStep);
		buttonCounterLeft.removeEventListener('click', backStep);
		buttonCounterLeft = null;
		buttonCounterRight = null;
		swipe = null;
		buttonEndWizard.removeEventListener('touchstart', goToHome);
		buttonEndWizard.removeEventListener('touchstart', goToHomePress);
		buttonEndWizard = null;
	}

	function nextStep(){
		var value = document.getElementById("counter-card").dataset.step;
		value++;
		swipe.goToStep(value);
	}

	function backStep(){
		var value = document.getElementById("counter-card").dataset.step;
		value--;
		swipe.goToStep(value);
	}

	open();

}(Routing));