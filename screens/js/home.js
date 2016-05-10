var ScreenHome = (function(){
	var rootScreen = Routing.rootScreen();
	var panels = [];
	var panelMax = 0;
	var panelActive = 0;
	var tabs = null;
	var header = null;
	var swipe = null;
	var menuButtons, swipeMenu, progressPassed,  powerOffButton, settingsButton, menuOverlay;

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
			swipe.goToPage(value, 0, 200);
		});
	}

	document.addEventListener('changedStepEvent', function () {
		panelActive = swipe.currentPage.pageX;
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
	}

	function menuListeners(){
		swipeMenu = swipeMenuService('swiper-menu', 280);
		menuButtons = rootScreen.querySelectorAll('.menu-button');
		menuOverlay = document.querySelector('.menu-overlay');
		for(var i = 0; i < menuButtons.length; i++){
			menuButtons[i].addEventListener('click', function(e){
				e.stopPropagation();
				swipeMenu.toggle(400, function(opened){
					menuOverlay.hidden = !opened;
					if(opened){
						menuOverlay.style.opacity = 0.7;
					}else{
						menuOverlay.style.opacity = 0;
					}
				});
			})
		}

		var prevPerc = 0;
		document.addEventListener('openningMenuEvent', function(event){
			perc = event.percentage.toFixed(1);
			if(prevPerc === perc){
				return;
			}
			prevPerc = perc;
			if(perc >= 0.7){
				perc = 0.7;
			}
			menuOverlay.hidden = false;
			if(parseFloat(perc) === 0){
				menuOverlay.hidden = true;
			}
			menuOverlay.style.opacity = perc;
		})

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

		/*settingsButton = rootScreen.querySelector('#settings-button');
		settingsButton.addEventListener('click', function(){
			Routing.goTo('fakes');
		})*/
	}

	function open(){
		generateTabs('daily', 'review');
		header = document.getElementById('header-home');
		var wrapper = document.getElementById('home-panels-wrapper');

		swipe = new IScroll('#home-panels-wrapper', {
			scrollX: true,
			scrollY: false,
			momentum: false,
			click: isAndroidKitKatOrHigher(),
			snap: true,
			snapSpeed: 200,
			keyBindings: true,
			indicators: {
				el: document.getElementById('wrapper-indicator'),
				resize: false
			}
		})

		//click false dont work on android < 4.4
		function isAndroidKitKatOrHigher() {
			var version = device.version.split('.');
			return (device.platform == 'Android' &&
					(version[0] >= 5 || (version[0] == 4 && version[1] >= 4)))
		}

		var changedStepEvent = document.createEvent('Event');
		changedStepEvent.initEvent('changedStepEvent', true, true);

		swipe.on('scrollEnd', function() {
		    document.dispatchEvent(changedStepEvent);
		});

		menuListeners();
	}

	document.addEventListener('backbutton', function(){
		if(swipeMenu.isOpened()){
			swipeMenu.close(200, function(){
				menuOverlay.hidden = true;
				menuOverlay.style.opacity = 0;
			});
		}
		else if(ScreenReview.isOpenedDropDown()){
			ScreenReview.closeDropDown();
		}
		else if(ScreenReview.isOpenedSelector()){
			ScreenReview.closeSelector();
		}
		else if(ScreenReview.isOpenedModal()){
			ScreenReview.closeModal();
		}
		else if(typeof(ScreenPractice) !== "undefined" && ScreenPractice.isOpened()){
			ScreenPractice.quit();
		}
		else if(typeof(ScreenPracticeError) !== "undefined" && ScreenPracticeError.isOpened()){
			ScreenPracticeError.quit();
		}
		else {
			navigator.app.exitApp();
		}
	})

	function goToPane(value){
		swipe.goToPage(value, 0, 200);
	}

	return {
		open: open,
		goToPane: goToPane
	}

}(Routing));

Routing.setController(ScreenHome);
