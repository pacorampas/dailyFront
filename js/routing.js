var Routing = (function(){
	var routes = {
		home: { 
			id: 'screen-home',
			html: 'screens/home.html',
			css: ['css/tabs.css', 'css/icon.css', 'css/home.css', 'css/menu.css'],
			js: ['services/cardService.js', 'screens/js/home.js']
		},
		daily: {
			id: 'screen-daily',
			html: 'screens/daily.html',
			css: ['css/daily_screen.css', 'css/card.css'],
			js: ['screens/js/daily.js']
		},
		review: {
			id: 'screen-review',
			html: 'screens/review.html',
			css: ['css/list.css', 'css/selector.css', 'css/search.css', 'css/drop_down.css'],
			js: ['screens/js/review.js']
		},
		practice: {
			id: 'screen-practice',
			html: 'screens/practice.html',
			css: ['css/practice_screen.css', 'css/card.css', 'css/icon.css'],
			js: ['services/cardService.js', 'screens/js/practice.js']
		},
		practiceError: {
			id: 'screen-practice-error',
			html: 'screens/practice.html',
			css: ['css/practice_screen.css', 'css/card.css', 'css/icon.css'],
			js: ['services/composerService.js', 'services/cardService.js', 'screens/js/practice_error.js']
		},
		wizard: {
			id: 'screen-wizard',
			html: 'screens/wizard.html',
			css: ['css/wizard.css', 'css/tabs.css', 'css/icon.css'],
			js: ['screens/js/wizard.js']
		},
		fakes: {
			id: 'screen-fakes',
			html: 'screens/fakes.html',
			css: [],
			js: ['screens/js/fakes.js']
		}
	}

	var history = [];

	function goTo(route, tabParent){
		if(tabParent === undefined) {
			tabParent = false;
		}
		
		if(tabParent){
			if(!routes[tabParent].tabs) {
				routes[tabParent].tabs = new Array();
			}
			routes[tabParent].tabs.push(route);
		} else {
			history.push(route);
		}

		if(!routes[route].css){
			routes[route].css = null;
		}

		LazyLoad.css(routes[route].css, function(){
			LazyLoad.html(routes[route].html, function(content){
				var screenElement = document.getElementById(routes[route].id);
				screenElement.innerHTML = content;
				LazyLoad.js(routes[route].js, function() {
				  screenElement.classList.add('open');
				  screenElement.style.zIndex = history.length;

				  if(routes[route].controller){
					routes[route].controller.open();
				  }

				});
			});
		})
	}

	function back(callback) {
		if(history.length == 1){
			return;
		}
		if(callback){
			callback();
		}
		var last = history.pop();
		document.getElementById(routes[last].id).classList.remove('open');
	};

	function rootScreen(){
		var theScreen = routes[history[history.length-1]];
		return document.getElementById(theScreen.id);
	}

	function setController(controller){
		var theScreen = routes[history[history.length-1]];
		theScreen.controller = controller;
		theScreen.controller.open();
	}

	return {
		goTo: goTo,
		back: back,
		rootScreen: rootScreen,
		setController: setController,
		routes: routes
	}
})();


