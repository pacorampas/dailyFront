var ScreenPracticeError = (function(){
	var rootScreen;
	var checkButton;
	var buttonQuit;
	var composer, composerWrapper;
	var daily;
	var cardServ;
	var continueWrapper, continueButton;

	//---Diferencia con practice.js--
	var ratioPassed;
	var counterLifes;
	var exitButton;
	var lifes;
	var isOpened;

	function open(){
		isOpened = true;
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

		//---Diferencia con practice.js--
		exitButton = continueWrapper.querySelector('#exit-button');
		counterLifes = rootScreen.querySelector('#counter-lifes');
		ratioPassed = rootScreen.querySelector('#ratio-passed');
		ratioPassed.textContent = practiceService.calculatePassed();
		printCounter();
		lifes = practiceService.removeLife();
		alarmService.setLifeAlarm(lifes);
	}

	function runComposer(){
		var composerTextarea = rootScreen.querySelector('#composer-textarea');
		var composerTextareaCopy = rootScreen.querySelector('#composer-textarea-copy');
		composer = new composerService(composerTextarea, composerTextareaCopy);
	}

	function runCard(){
		//---Diferencia con practice.js--
		daily = practiceService.errorDaily();
		if(!cardServ){
			cardServ = new cardService( rootScreen.querySelector('#practice-card'), false );
		}
		var practiceData = {value: daily.contexts[0].value, explanation: false};
		cardServ.printData(practiceData);
	}

	var quitForce = false;
	function quit(){
		if(quitForce) {
			userAnswerQuit(2);
			return;
		}

		navigator.notification.confirm(
			'Are you sure? You will lose a life if you quit the practice.', 
			userAnswerQuit, 
			'Quit practice', 
			['Cancel', 'Exit']
		);
		function userAnswerQuit(button){
			if(button == 2) {
				cardServ = null;
				Routing.back(close);
			}
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
		//---Diferencia con practice.js--
		if(response){
			alarmService.cancellAlarmById(2+lifes);
			lifes = practiceService.addLife();
			activesService.updateActive(daily.id, true);
			ratioPassed.textContent = practiceService.calculatePassed();
			cardServ.changeBackText('CORRECT');
			if(practiceService.getErrors().length > 0){
				continueWrapper.classList.add('two-buttons');
				continueButton.addEventListener('click', refresh);
				exitButton.addEventListener('click', quit);
				continueWrapper.querySelector('p').textContent = 'Well done! Do you want to continue to another one?';
			}else{
				continueButton.addEventListener('click', quit);
				continueWrapper.classList.remove('two-buttons');
				continueWrapper.querySelector('p').textContent = 'Catched up! You haven\'t any failed expression.';
			}
		} else {
			printCounter();
			cardServ.wrongAnswer(daily.contexts[0].answers[0], valueCheking);
			if(practiceService.getLifes() > 0){
				exitButton.addEventListener('click', quit);
				continueButton.addEventListener('click', refresh);
				cardServ.changeBackText('WRONG');
				continueWrapper.classList.add('two-buttons');
				continueWrapper.querySelector('p').textContent = 'Next time! You have '+practiceService.getLifes()+' lives left. Do you want to try again?';
				activesService.updateActive(daily.id, false);
			}else{
				continueButton.addEventListener('click', quit);
				continueWrapper.classList.remove('two-buttons');
				cardServ.changeBackText('WRONG');
				continueWrapper.querySelector('p').textContent = 'Whoops! You have\'t lifes. You should wait a while for getting a life.';
				activesService.updateActive(daily.id, false);
			}
		}

		composerWrapper.hidden = true;
		setTimeout(function(){
			cardServ.flipToBack();
			setTimeout(function(){
				continueWrapper.hidden = false;
			}, 300);
		}, 600);
	}

	//---Diferencia con practice.js--
	function printCounter(){
		var classAttr = counterLifes.getAttribute('class');
		var pos = classAttr.search('life-count-');
		var lifeClassPrev = classAttr.substr(pos, 12);
		var lifeClassNew = 'life-count-'+practiceService.getLifes();
		classAttr = classAttr.replace(lifeClassPrev, lifeClassNew );
		counterLifes.setAttribute('class', classAttr);
	}

	//---Diferencia con practice.js--
	function refresh() {
		quitForce = false;
		continueButton.removeEventListener('click', quit);
		continueButton.removeEventListener('click', refresh);
		exitButton.removeEventListener('click', quit);
		composer.clean();
		lifes = practiceService.removeLife();
		alarmService.setLifeAlarm(lifes);
		runCard();
		cardServ.flipToFront();
		continueWrapper.hidden = true;
		setTimeout(function(){
			composerWrapper.hidden = false;
		},500);
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
		continueButton.removeEventListener('click', quit);
		continueButton.removeEventListener('click', refresh);
		exitButton.removeEventListener('click', quit);
		continueButton = null;

		daily = null;
		composer = null;

		//---Diferencia con practice.js--
		counterLifes = null;
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

//respuesta uno contexto uno expression cuarta

Routing.setController(ScreenPracticeError);
