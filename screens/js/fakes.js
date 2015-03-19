var ScreenFake = (function(){
	var buttonToPractice, buttonToPracticeErrors, buttonBack, buttonToWizard, buttonDevData;
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
	}

	return {
		open: open
	}

}(Routing));

Routing.setController(ScreenFake);
