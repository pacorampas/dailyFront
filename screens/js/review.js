var ScreenReview = (function(){
	var rootScreen = Routing.rootScreen();
	var listReview;
	var modal;
	var cardServ;
	var selector, selectorUl, selectorLi, selectorCloseButton;
	var searchInput, searchButtons, searchInputText;
	var dropDown, dropDownButtons;
	var printedExpressions = {};
	var printedExpressionsFiltered = {};
	var searchTimeoutId;
	var buttonsGoToPractice;
	var listScroll;

	function open(){
		selectorListeners();
		searchListeners();
		dropDownListeners();

		modal = document.getElementById('modal-review');
		cardServ = new cardService( modal.querySelector('#daily-card-review') );
		modal.addEventListener('click', function(){
			modal.hidden = true;
			cardServ.flipToFront();
		})

		listReview = rootScreen.querySelector('#list-review');
		printListExpression();
		
		searchInputText = searchInput.querySelector('#search-input-text');
		searchInputText.addEventListener('keyup', function(event){
			var e = event;
			var val = this.value;
			window.clearTimeout(searchTimeoutId);
			if(val.length > 1){
				searchTimeoutId = setTimeout(function(){
					searchByWord(val);
				}, 500);
			} else {
				searchTimeoutId = setTimeout(function(){
					searchByWord('');
				}, 500);
			}
		});        
	}

	var valPrev = '';
	function searchByWord(val){
		var arrayToAdd = printedExpressionsFiltered;
		var arrayToRemove = printedExpressions;
		var classToFilter = 'filter-hide';
		
		if(valPrev.length > val.length) {
			valPrev = val;
			arrayToAdd = printedExpressions;
			arrayToRemove = printedExpressionsFiltered;
			for(key in arrayToRemove){
				if( arrayToRemove[key].value.indexOf(val) >= 0 ){
					var idExpression = arrayToRemove[key].id;
					listReview.querySelector('#review-expression-'+idExpression).classList.remove(classToFilter);
					arrayToAdd[key] = arrayToRemove[key];
					delete arrayToRemove[key];
				}
			}
			return;
		}

		valPrev = val;
		for(key in arrayToRemove){
			if( arrayToRemove[key].value.indexOf(val) < 0 ){
				var idExpression = arrayToRemove[key].id;
				listReview.querySelector('#review-expression-'+idExpression).classList.add(classToFilter);
				arrayToAdd[key] = arrayToRemove[key];
				delete arrayToRemove[key];
			}
		}
	}

	function printListExpression(){
		var actives = activesService.getActives();
		var daily = activesService.getDaily();
		for(key in actives){
			if(actives[key].idExpression == daily.id && actives[key].errors.length <= 0){
				continue;
			}
			var expression = activesService.getExressionByIdActive(actives[key].idExpression);
			printLi(expression, actives[key]);
		}
		listScroll = new IScroll('#screen-review');
	}

	function printLi(expression, active){
		var expressionObj = new Object();
		var li = document.createElement('li');
		li.dataset.id = expression.id;
		li.textContent = expression.value;
		li.id = 'review-expression-'+expression.id;
		expressionObj['id'] = expression.id;
		expressionObj['value'] = expression.value;
		printedExpressions[expression.id] = expressionObj;
		var correct = true;
		if(!active.correct){
			correct = false;
		}
		li.setAttribute('correct', correct);

		li.addEventListener('click', function(e){
			e.preventDefault();
			clickLi(this.dataset.id);
		})
		
		listReview.appendChild(li);
		return li;
	}

	function clickLi(id){
		var daily = activesService.getExressionByIdActive(id);
		if(!daily){
			return;
		}
		cardServ.printData(daily);
		modal.hidden = false;
	}

	function selectorListeners(){
		selector = rootScreen.querySelector('selector');
		selectorUl = selector.querySelector('ul');
		selectorLi = selectorUl.querySelectorAll('li');
		selectorCloseButton = selector.querySelector('#selector-close-button');
		selector.addEventListener('click', function(){
			if(selectorUl.hidden){
				selectorUl.hidden = false;
			}
		});
		selectorCloseButton.addEventListener('click', function(e){
			e.stopPropagation();
			if(!selectorUl.hidden){
				selectorUl.hidden = true;
			}
		});
		for(var i = 0; i < selectorLi.length; i++){
			selectorLi[i].addEventListener('click', function(e){
				e.stopPropagation();
				if(!selectorUl.hidden) {
					selectorUl.hidden = true;
				}
				changeActiveValueSelector(this)
			})
		}
	}

	function changeActiveValueSelector(liToActivate){
		for(var i = 0; i < selectorLi.length; i++){
			selectorLi[i].removeAttribute('active');
		}
		liToActivate.setAttribute('active', true);
		var value = liToActivate.textContent;
		document.body.classList.remove('filterPassed');
		document.body.classList.remove('filterFailed');
		document.body.classList.add('filter'+value);
		selector.querySelector('span:first-child').textContent = value;
		setTimeout(function () {
	        listScroll.refresh();
	    }, 0);
	}

	function searchListeners(){
		searchInput = rootScreen.querySelector('#search-input');
		searchButtons = rootScreen.querySelectorAll('.search-button');
		for(var i = 0; i < searchButtons.length; i++){
			searchButtons[i].addEventListener('click', function(e){
				e.stopPropagation();
				if(searchInput.hidden) {
					searchInput.hidden = false;
				} else {
					searchInput.hidden = true;
				}
			})
		}
	}

	function dropDownListeners(){
		dropDown = rootScreen.querySelector('drop-down');
		dropDownButtons = rootScreen.querySelectorAll('.drop-down-button');
		for(var i = 0; i < dropDownButtons.length; i++){
			dropDownButtons[i].addEventListener('click', function(e){
				refreshDropDownLifes();
				e.stopPropagation();
				if(dropDown.hidden) {
					dropDown.hidden = false;
				} else {
					dropDown.hidden = true;
				}
			})
		}
		
		buttonsGoToPractice = rootScreen.querySelectorAll('.go-to-practice-button');
		buttonsGoToPracticeListener();
		refreshDropDownLifes();
	}

	function buttonsGoToPracticeListener(){
		buttonsGoToPracticeRefreshDisabled();

		for(var i = 0; i < buttonsGoToPractice.length; i++){
			buttonsGoToPractice[i].addEventListener('click', goToPractice);
		}
	}

	function goToPractice(event){
		event.stopPropagation();
		event.preventDefault();
		
		if(this.dataset.disabled == 'true'){
			var message = '';
			if(practiceService.getLifes() <= 0)
				message = 'You can\'t review now because you don\'t have any life. Wait for get one.';
			else {
				message = 'Congratulationss!! You are catched up so you don\'t have errors to practice.';
			}

			navigator.notification.alert(
			    message,
			    function(){},
			    'Practice errors is disabled',
			    'Ok'
			);
			return;
		}

		Routing.goTo('practiceError');
		setTimeout(function(){
			dropDown.hidden = true;
		}, 500);
	}

	function buttonsGoToPracticeRefreshDisabled(){
		var disabled = false;
		if(practiceService.getLifes() <= 0 || practiceService.getErrors().length <= 0){
			disabled = true;
		}
	
		for(var i = 0; i < buttonsGoToPractice.length; i++){
			buttonsGoToPractice[i].dataset.disabled = disabled;
		}
	}

	function dataLifesRoot(lifes){
		//add and remove hide-lifes for force to refresh styles in android 4.1 to 4.3
		rootScreen.classList.add('hide-lifes');
		rootScreen.dataset.lifes = lifes;
		rootScreen.classList.remove('hide-lifes');
	}

	function refreshDropDownLifes(){
		buttonsGoToPracticeRefreshDisabled();

		var dropDownLifes = document.getElementById('drop-down-lifes');
		var life = dropDownLifes.querySelector('#drop-down-lifes-life');
		var alarmsText = dropDownLifes.querySelector('#drop-down-lifes-alarms');
		var text = dropDownLifes.querySelector('#drop-down-lifes-text');
		var theLifes = practiceService.getLifes();
		
		dataLifesRoot(theLifes);

		if(practiceService.getErrors() == 0){
			text.textContent = 'Congratulations you are catched up! You don\'t need practice';
		}

		if(theLifes == 0){
			life.textContent = 'Empty';
			if(practiceService.getErrors() != 0){
				text.textContent = 'You don’t have more lives. You will need to wait, sorry.';
			}
		}
		else if(theLifes == 1){
			life.textContent = 'Almost Empty';
		}
		else if(theLifes == 2){
			life.textContent = 'Almost Full';
		}
		else if(theLifes == 3){
			life.textContent = 'Full';
			alarmsText.textContent = 'Awesome! No need for waiting.';
		} 
		
		alarmService.getAlarmById([2, 3, 4], function(notifications){
			
			if(notifications !== undefined && notifications.length > 0){
				var date = new Date();
				date.setTime(notifications[0].at*1000);
				
				for(var i = 1, l = notifications.length; i < l; i++){
					var dateFor = new Date();
					dateFor.setTime(notifications[i].at*1000);
					if(dateFor < date){
						date = dateFor;
					}
				}
				var date = countDownLifes(date);
			}

			if(!date){
				return;
			}
			
			if(parseInt(date.diff) < 0){
				alarmsText.textContent = lifeSentence(theLifes)+' You have a notification to get one life right now.';
				setTimeout(refreshDropDownLifes, 5000);
			}
			else if(parseInt(date.day) > 0){
				alarmsText.textContent = lifeSentence(theLifes)+' You will get a life in '+parseInt(date.day)+' days.';
				setTimeout(refreshDropDownLifes, 1000*60*60*24);
			}
			else if(parseInt(date.hour) > 0){
				alarmsText.textContent = lifeSentence(theLifes)+' You will get a life in '+parseInt(date.hour)+' hours.';
				setTimeout(refreshDropDownLifes, 1000*60*60);
			}
			else if(parseInt(date.min) > 0){
				alarmsText.textContent = lifeSentence(theLifes)+' You will get a life in '+parseInt(date.min)+' minutes.';
				setTimeout(refreshDropDownLifes, 1000*60);
			} 
			else {
				alarmsText.textContent = lifeSentence(theLifes)+' You will get a life in '+parseInt(date.sec)+' seconds.';
				setTimeout(refreshDropDownLifes, 1000);
			}
		});
	}

	function countDownLifes(date){
		var objectDate = new Object();
		var now = new Date();
		var diff = date - now;
		objectDate.diff = diff;

		objectDate.day = diff/1000/60/60/24;
		if(objectDate.day > 1){
			diff = (diff/1000/60/60)%24;
		}
		objectDate.hour = diff/1000/60/60;
		if(objectDate.hour > 1){
			diff = (diff/1000/60)%60;
		}
		objectDate.min = diff/1000/60;
		
		objectDate.sec = diff/1000%60;
		
		return objectDate;
	}

	function lifeSentence(lifes){
		if(lifes == 1){
			return 'You have one life left.';
		}
		if(lifes == 2){
			return 'You have two lifes left.';
		}
		if(lifes == 3){
			return 'You have three lifes left.';
		}
		if(lifes == 0){
			return 'You don\' have any life left.';
		}
	}

	document.addEventListener('uploadedLifes', function(){
		refreshDropDownLifes();
	})

	document.addEventListener('uploadedActives', function(){
		refreshDropDownLifes();
		if(event.detail && event.detail.correct) {
			listReview.querySelector('#review-expression-'+event.detail.idExpression).setAttribute('correct', true);
		}
	})

	document.addEventListener('practicedDaily', function(event){
		var daily = activesService.getDaily();
		var dailyActive = activesService.getActive(daily.id);
		var li = printLi(daily, dailyActive);

		li.addEventListener('click', function(e){
			e.preventDefault();
			clickLi(this.dataset.id);
		})
	});

	document.addEventListener('refreshDaily', function(event){
		listReview.innerHTML = '';
		printListExpression();
	});

	function isOpenedDropDown(){
		return !dropDown.hidden;
	}

	function closeDropDown(){
		dropDown.hidden = true;
	}

	function isOpenedSelector(){
		return !selectorUl.hidden;
	}

	function closeSelector(){
		selectorUl.hidden = true;
	}

	function isOpenedModal(){
		return !modal.hidden;
	}

	function closeModal(){
		modal.hidden = true;
	}

	return {
		open: open,
		isOpenedDropDown: isOpenedDropDown,
		closeDropDown: closeDropDown,
		isOpenedSelector: isOpenedSelector,
		closeSelector: closeSelector,
		isOpenedModal: isOpenedModal,
		closeModal: closeModal
	}

}());

Routing.setController(ScreenReview);
