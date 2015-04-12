var ScreenPractice = (function(){
	var rootScreen;
	var checkButton;
	var buttonQuit;
	var composer, composerWrapper;
	var daily;
	var cardServ;
	var continueWrapper, continueButton;
	var isOpened;

	function open(){
		isOpened = true;
		localStorage.practiceActive = 0;
		alarmService.setDailyAlarm();
		rootScreen = Routing.rootScreen();
		runCard();
		runComposer();
		checkButton = rootScreen.querySelector('#check-button');
		checkButton.addEventListener('click', check);
		buttonQuit = rootScreen.querySelector('#button-quit');
		buttonQuit.addEventListener('click', quit);
		composerWrapper = rootScreen.querySelector('#composer');
		continueWrapper = rootScreen.querySelector('#continue');
		continueButton = continueWrapper.querySelector('#continue-button');
	}

	function runComposer(){
		var composerTextarea = rootScreen.querySelector('#composer-textarea');
		var composerTextareaCopy = rootScreen.querySelector('#composer-textarea-copy');
		composer = new composerService(composerTextarea, composerTextareaCopy);
	}

	function runCard(){
		daily = activesService.getDaily();
		cardServ = new cardService( rootScreen.querySelector('#practice-card'), false );
		var practiceData = {value: daily.contexts[0].value, explanation: 'none'};
		cardServ.printData(practiceData);
	}

	var quitForce = false;
	function quit(){
		if(quitForce) {
			userAnswerQuit(2);
			return;
		}
		
		navigator.notification.confirm(
			'Are you sure? The expression will be saved as failed if you exit now.', 
			userAnswerQuit, 
			'Quit practice', 
			['Cancel', 'Exit']
		);
		
		function userAnswerQuit(button){
			if(button == 2) {
				dispatchPracticedEvendt();
				composer = null;
				daily = null;
				cardServ = null;
				Routing.back(close);
			}
		}

		function dispatchPracticedEvendt(){
			var practicedDaily = document.createEvent('Event');
    		practicedDaily.initEvent('practicedDaily', true, true);

			document.dispatchEvent(practicedDaily);
		}
	}

	function check(){
		var valueCheking = composer.text;
		if(!valueCheking){
			return;
		}
		
		var response = composer.verifyAnswer(daily.contexts[0].answers, valueCheking);
		cardServ.check(response);
		quitForce = true;
		continueButton.addEventListener('click', quit);
		if(response){
			cardServ.changeBackText('CORRECT');
			continueWrapper.querySelector('p').textContent = 'Good job! You are closest to complete all expressions.';
			activesService.updateActive(daily.id, true);
		} else {
			cardServ.wrongAnswer(daily.contexts[0].answers[0], valueCheking);
			cardServ.changeBackText('WRONG');
			continueWrapper.querySelector('p').textContent = 'You have failded this time. You can go to review to learn it.';
			activesService.updateActive(daily.id, false);
		}

		composerWrapper.hidden = true;
		setTimeout(function(){
			cardServ.flipToBack();
			setTimeout(function(){
				continueWrapper.hidden = false;
			}, 300);
		}, 600);
	}

	function close(){
		isOpened = false;
		quitForce = false;
		buttonQuit.removeEventListener('click', quit);
		buttonQuit = null;
		rootScreen = null;
		checkButton.removeEventListener('click', check);
		checkButton = null;
		continueWrapper = null;
		composerWrapper = null;
		continueButton.removeEventListener('click', check);
		continueButton = null;
	}

	function isOpened(){
		return isOpened;
	}

	return {
		open: open,
		quit: quit,
		isOpened: isOpened
	}

})();

Routing.setController(ScreenPractice);
