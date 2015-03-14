var ScreenDaily = (function(){
	var rootScreen = Routing.rootScreen();
	var cardServ;
	var dailyCard, practiceCard;
	var daily;
	var buttonGoToPractice;

	var practiceActive = localStorage.practiceActive;

	function open(){
		dailyCard = document.getElementById('daily-card');
		practiceCard = document.getElementById('daily-practice-card');
		if(practiceActive == 1){
			practiceCard.parentNode.style.display = 'inline-block';
			dailyCard.parentNode.style.display = 'none';
			buttonGoToPractice = rootScreen.querySelector('#button-card-practice');
			buttonGoToPractice.addEventListener('click', goToPractice);
		} else {
			practiceCard.parentNode.style.display = 'none';
			dailyCard.parentNode.style.display = 'inline-block';
			if(!daily){
				daily = activesService.createDaily();
				cardServ = new cardService( document.getElementById('daily-card') );
				cardServ.printData(daily);
			}
		}
	}

	function goToPractice(){
		Routing.goTo('practice');
	}
	
	function refresh(){
		practiceActive = localStorage.practiceActive;
		close();
		open();
	}

	function close(){
		dailyCard = null;
		practiceCard = null;
		if(buttonGoToPractice){
			buttonGoToPractice.removeEventListener('click', goToPractice);
			buttonGoToPractice = null;
		}
	}

	document.addEventListener('practiceActive', function(){
		refresh();
	});

	document.addEventListener('dailyActive', function(){
		refresh();
	});

	document.addEventListener('refreshDaily', function(){
		daily = activesService.createDaily();
		cardServ.printData(daily);
	});

	open();

}());