var ScreenReview = (function(){
	var rootScreen = Routing.rootScreen();
	var listReview, listReviewItems;
	var modal;
	var cardServ;
	var selector, selectorUl, selectorLi, selectorCloseButton;
	var searchInput, searchButtons, searchInputText;
	var dropDown, dropDownButtons;
	var printedExpressions = {};
	var printedExpressionsFiltered = {};
	var searchTimeoutId;
	var buttonGoToPractice;

	function open(){
		selectorListeners();
		searchListeners();
		dropDownListeners();

		listReview = rootScreen.querySelector('#list-review');
		printListExpression();
		modal = document.getElementById('modal-review');
		cardServ = new cardService( modal.querySelector('#daily-card-review') );
		modal.addEventListener('click', function(){
			modal.hidden = true;
			cardServ.flipToFront();	
		})

		listReviewItems = listReview.querySelectorAll('#list-review li');
		for(var i = 0, l = listReviewItems.length; i < l; i++){
			//open modal
			listReviewItems[i].addEventListener('click', function(e){
				e.preventDefault();
				clickLi(this.dataset.id);
			})
		}
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
		//for preventing scrollX on input (and all page)
        searchInputText.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, false);
            
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
		document.body.setAttribute('filter', value);
		selector.querySelector('span:first-child').textContent = value;
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
				e.stopPropagation();
				if(dropDown.hidden) {
					dropDown.hidden = false;
				} else {
					dropDown.hidden = true;
				}
			})
		}
		
		buttonGoToPractice = rootScreen.querySelector('#go-to-practice-button');
		refreshDropDownLifes();
	}

	function goToPractice(event){
		event.stopPropagation();
		Routing.goTo('practiceError');
		setTimeout(function(){
			dropDown.hidden = true;
		}, 500);
	}

	function buttonGoToPracticeListener(){
		if(practiceService.getLifes() <= 0 || practiceService.getErrors().length <= 0){
			buttonGoToPractice.disabled = true;
			buttonGoToPractice.removeEventListener('click', goToPractice);
		} else {
			buttonGoToPractice.disabled = false;
			buttonGoToPractice.addEventListener('click', goToPractice);
		}
	}

	function refreshDropDownLifes(){
		buttonGoToPracticeListener();

		var dropDownLifes = document.getElementById('drop-down-lifes');
		var life = dropDownLifes.querySelector('#drop-down-lifes-life');
		var alarmsText = dropDownLifes.querySelector('#drop-down-lifes-alarms');
		var text = dropDownLifes.querySelector('#drop-down-lifes-text');
		var theLifes = practiceService.getLifes();
		dropDownLifes.dataset.lifes = theLifes;

		if(theLifes == 0){
			text.textContent = 'You don’t have more lives. You will need to wait, sorry.';
		}
		if(practiceService.getErrors() == 0){
			text.textContent = 'Congratulations you are catched up! You don\'t need practice';
		}

		if(theLifes == 3){
			life.textContent = 'Full';
			alarmsText.textContent = 'Awesome! No need for waiting.';
			return; 
		}
		
		var idAlarm = parseInt(theLifes)+2;
		alarmService.getAlarmById(idAlarm, function(not){
			var date = new Date();
			date.setTime(not[0].at*1000);
			var date = countDownLifes(date);

			if(theLifes == 0){
				life.textContent = 'Empty';
				if(date.hour <= 0){
					alarmsText.textContent = 'You don\'t have any lives. You will get a life in '+parseInt(date.min)+' minutes.';
				}else{
					alarmsText.textContent = 'You don\'t have any lives. You will get a life in '+parseInt(date.hour)+' hours.';
				}
			} else if(theLifes == 1){
				life.textContent = 'Almost Empty';
				if(date.day <= 0){
					alarmsText.textContent = 'You have one lives left. You will get a life today.';
				}else{
					alarmsText.textContent = 'You have one lives left. You will get a life in '+parseInt(date.day)+' days.';
				}
			} else if(theLifes == 2){
				life.textContent = 'Almost Full';
				if(date.day <= 0){
					alarmsText.textContent = 'You have two lives left. You will get a life today.';
				}else{
					alarmsText.textContent = 'You have two lives left. You will get a life in '+parseInt(date.day)+' days.';
				}
			}
		});
	}

	function countDownLifes(date){
		var objectDate = new Object();
		var now = new Date();
		var diff = date - now;
		objectDate.day = diff/1000/60/60/24;
		if(objectDate.day > 1){
			diff = (diff/1000/60/60)%24;
		}
		objectDate.hour = diff/1000/60/60;
		if(objectDate.hour > 1){
			diff = (diff/1000/60)%60;
		}
		objectDate.min = diff/1000/60;
		
		return objectDate;
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

	open();

}());
