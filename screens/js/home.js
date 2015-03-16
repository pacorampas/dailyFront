var ScreenHome = (function(){
	var rootScreen = Routing.rootScreen();
	var panels = [];
	var panelMax = 0;
	var panelActive = 0;
	var tabs = null;
	var header = null;
	var swipe = null;
	var menuButtons, menuPanel, progressPassed,  powerOffButton;

	function fakePractice(){
		document.getElementById('fake-to-practice').addEventListener('click', function(){
			Routing.goTo('practice');
		})
		document.getElementById('fake-to-practice-errors').addEventListener('click', function(){
			Routing.goTo('practiceError');
		})
		document.getElementById('fake-to-wizard').addEventListener('click', function(){
			navigator.notification.alert(
			    'For entring to the wizard open and close the app!',
			    function(){},
			    'Activate wizard',
			    'Ok'
			);
			if(localStorage.wizard){
				delete localStorage.wizard;
			}
		})

		document.getElementById('fake-dev-data').addEventListener('click', function(){
			navigator.notification.alert(
			    'Close and open the app to have the start dev data',
			    function(){},
			    'Dev data',
			    'Ok'
			);
			if(localStorage.dev){
				delete localStorage.dev;
			}
		})
	}
	fakePractice();

	function generateTabs(){
		for(key in arguments){
			Routing.goTo(arguments[key], 'home');
		}
		tabs = rootScreen.querySelector('.tabs').children;
		for(var i = 0; i < tabs.length; i++){
			tabAction(tabs[i], i);
		}
		panels = rootScreen.querySelector('#home-panels-wrapper');
		panelMax = panels.querySelectorAll('.panel').length-1;
	}

	function tabAction(tab, value){
		tab.addEventListener('click', function(){
			swipe.goToStep(value);
		});
	}

	document.addEventListener('nextStepEvent', function (e) {
		panelActive = e.step;
		tabCurrent();
	}, false);

	function tabCurrent(){
		var tab = tabs[panelActive];
		if(tab.classList.contains('current')){
			return;
		}
		for(var i = 0; i < tabs.length; i++){
			tabs[i].classList.remove('current');
		}
		tab.classList.add('current');
		header.classList.remove('is-header-review');
		header.classList.remove('is-header-daily');
		header.classList.add('is-header-'+tab.dataset.tab);
		
		console.log(tab.dataset.tab);
	}

	function menuListeners(){
		menuPanel = rootScreen.querySelector('#menu-panel');
		menuButtons = rootScreen.querySelectorAll('.menu-button');
		for(var i = 0; i < menuButtons.length; i++){
			menuButtons[i].addEventListener('click', function(e){
				e.stopPropagation();
				if(menuPanel.hidden) {
					menuPanel.hidden = false;
				} else {
					menuPanel.hidden = true;
				}
			})
		}
		progressPassed = rootScreen.querySelector('.progress-passed');
		progressPassed.textContent = practiceService.calculatePassed();
		document.addEventListener('uploadedActives', function(){
			progressPassed.textContent = practiceService.calculatePassed();
		})

		powerOffButton = rootScreen.querySelector('#power-off');
		
		powerOffButton.addEventListener('click', function(){
			navigator.notification.confirm(
	            'Do you really want to exit?',
	            closeApp,
	            'Exit',
	            ['Cancel','OK']
	        );
			
		})
		function closeApp(buttonIndex){
			if (buttonIndex==2){
        		navigator.app.exitApp();
        	}
		}
	}

	function open(){
		generateTabs('daily', 'review');
		header = document.getElementById('header-home');
		var wrapper = document.getElementById('home-panels-wrapper');
		swipe = scrollPanes(wrapper);
		menuListeners();
		printDatesAlarms();
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

	open();

}(Routing));