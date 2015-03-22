var ScreenFake = (function(){
	var buttonToPractice, buttonToPracticeErrors, buttonBack, buttonToWizard, buttonDevData, buttonPracticeAlarm;
	var buttonsLifeAlarm;
	var lifes;
	function open(){
		buttonToPractice = document.getElementById('fake-to-practice');
		buttonToPractice.addEventListener('click', goToPractice);

		buttonToPracticeErrors = document.getElementById('fake-to-practice-errors');
		buttonToPracticeErrors.addEventListener('click', goToPracticeErrors);

		buttonBack = document.getElementById('fake-back-button');
		buttonBack.addEventListener('click', goBack);

		buttonToWizard = document.getElementById('fake-to-wizard');
		buttonToWizard.addEventListener('click', goToWizard);

		buttonDevData = document.getElementById('fake-dev-data');
		buttonDevData.addEventListener('click', devData);

		buttonPracticeAlarm = document.getElementById('practice-alarm');
		buttonPracticeAlarm.addEventListener('click', setPracticeAlarm);

		buttonsLifeAlarm = document.querySelectorAll('.life-alarm');
		for( var i= 0; i < buttonsLifeAlarm.length; i++ ){
			buttonsLifeAlarm[i].addEventListener('click', function(){
				console.log(this.dataset.life);
				setLifeAlarm(this.dataset.life);
			});
		}

		printDatesAlarms()
	}

	function goToPractice(){
		Routing.back(close);
		Routing.goTo('practice');
	}

	function goToPracticeErrors(){
		Routing.back(close);
		Routing.goTo('practiceError');
	}

	function goBack(){
		Routing.back(close);
	}

	function goToWizard(){
		navigator.notification.alert(
		    'For entring to the wizard open and close the app!',
		    function(){},
		    'Activate wizard',
		    'Ok'
		);
		if(localStorage.wizard){
			delete localStorage.wizard;
		}
	}

	function devData(){
		navigator.notification.alert(
		    'Close and open the app to have the start dev data',
		    function(){},
		    'Dev data',
		    'Ok'
		);
		if(localStorage.dev){
			delete localStorage.dev;
		}
	}

	function printDatesAlarms(){
		var div = document.getElementById('print-dates-alarms');
		div.innerHTML = '';
		alarmService.getAllAlarms(function(alarms){
			for(var i = 0; i < alarms.length; i++){
				var p = document.createElement('p');
				var date = new Date();
				date.setTime(alarms[i].at*1000);
				p.textContent = alarms[i].id+' - '+date;
				div.appendChild(p);
			}
		});
	}

	function close(){
		buttonToPractice.removeEventListener('click', goToPractice);
		buttonToPractice = null;

		buttonToPracticeErrors.removeEventListener('click', goToPracticeErrors);
		buttonToPracticeErrors = null;

		buttonBack.removeEventListener('click', goBack);
		buttonBack = null;

		buttonToWizard.removeEventListener('click', goToWizard);
		buttonToWizard = null;

		buttonDevData.removeEventListener('click', devData);
		buttonDevData = null;

		buttonPracticeAlarm.removeEventListener('click', setPracticeAlarm);
		buttonPracticeAlarm = null;
	}

	function setPracticeAlarm() {
		var isDate = new Date();

		isDate.setMinutes( (isDate.getMinutes() + 1) ); //le sumamos las horas para que suene en ahora + rand horas

		cordova.plugins.notification.local.schedule({
	        id: 1,
	        title: 'Put in practice',
	        text: 'Our teacher is waiting you for testing your progress',
	        at: isDate,
	        badge: 1,
	        data: 'Practice'
	    });
	}

	function setLifeAlarm(lifes){
		console.log(this);
		if (lifes == 3 || lifes === null || lifes === undefined) {
			console.log('no lifes to save alarm');
			return;
		}

		var isDate = new Date();
		
		if(lifes == 0) { //mañana
			isDate.setMinutes( isDate.getMinutes() + 1 );
			console.log('Alarm +1 day');
		}
		else if(lifes == 1) { //en 3 días
			isDate.setMinutes( isDate.getMinutes() + 3 );
			console.log('Alarm +3 day');
		}
		else if(lifes == 2) { //en 7 días
			isDate.setMinutes( isDate.getMinutes() + 7 );
			console.log('Alarm +7 day');
		}
		var data = 'Life-'+lifes;
		window.plugin.notification.local.add(
			{ 	
				id: 2+parseInt(lifes),
				title: 'New life',
				text: 'You have a new life for practice errors',
				at: isDate,
				data: data
			}
		);
	}

	cordova.plugins.notification.local.on('schedule', function(notification) {
		printDatesAlarms();	   
	});

	return {
		open: open
	}

}(Routing));

Routing.setController(ScreenFake);
