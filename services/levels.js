if(localStorage.dev === undefined){
console.log('Fake data gogogo ;)');
localStorage.levels = '[{"id":1,"value":"nivel primero","expressions":[{"id":1,"value":"value expression primera","explanation":"explicación expresión primera","contexts":[{"id":1,"value":"contexto uno expresión primera","answers":["respuesta uno contexto uno expresión primera","respuesta dos contexto uno expresión primera"]}]},{"id":2,"value":"value expression segunda","explanation":"explicación expresión segunda","contexts":[{"id":2,"value":"contexto uno expresión segunda","answers":["respuesta uno contexto uno expresión segunda","respuesta dos contexto uno expresión segunda"]}]},{"id":3,"value":"value expression tercera","explanation":"explicación expresión tercera","contexts":[{"id":3,"value":"contexto uno expresión tercera","answers":["respuesta uno contexto uno expresión tercera","respuesta dos contexto uno expresión tercera"]}]}]},{"id":2,"value":"nivel segundo","expressions":[{"id":4,"value":"value expression cuarta","explanation":"explicación expresión cuarta","contexts":[{"id":4,"value":"contexto uno expresión cuarta","answers":["respuesta uno contexto uno expresión cuarta","respuesta dos contexto uno expresión cuarta"]}]},{"id":5,"value":"value expression quinta","explanation":"explicación expresión quinta","contexts":[{"id":5,"value":"contexto uno expresión quinta","answers":["respuesta uno contexto uno expresión quinta","respuesta dos contexto uno expresión quinta"]}]},{"id":6,"value":"value expression sexta","explanation":"explicación expresión sexta","contexts":[{"id":6,"value":"contexto uno expresión sexta","answers":["respuesta uno contexto uno expresión sexta","respuesta dos contexto uno expresión sexta"]}]}]},{"id":3,"value":"nivel tercero","expressions":[{"id":7,"value":"value expression septima","explanation":"explicación expresión septima","contexts":[{"id":7,"value":"contexto uno expresión septima","answers":["respuesta uno contexto uno expresión septima","respuesta dos contexto uno expresión septima"]}]},{"id":8,"value":"value expression octava","explanation":"explicación expresión octava","contexts":[{"id":8,"value":"contexto uno expresión octava","answers":["respuesta uno contexto uno expresión octava","respuesta dos contexto uno expresión octava"]}]},{"id":9,"value":"value expression novena","explanation":"explicación expresión novena","contexts":[{"id":9,"value":"contexto uno expresión novena","answers":["respuesta uno contexto uno expresión novena","respuesta dos contexto uno expresión novena"]}]}]}]';
localStorage.allLeves = '[{"id":4,"value":"nivel cuarto","expressions":[{"id":10,"value":"value expression décina","explanation":"explicación expresión décima","contexts":[{"id":10,"value":"contexto uno expresión décima","answers":["respuesta uno contexto uno expresión décima","respuesta dos contexto uno expresión décima"]}]},{"id":11,"value":"value expression 11","explanation":"explicación expresión 11","contexts":[{"id":11,"value":"contexto uno expresión 11","answers":["respuesta uno contexto uno expresión 11","respuesta dos contexto uno expresión 11"]}]},{"id":12,"value":"value expression 12","explanation":"explicación expresión 12","contexts":[{"id":12,"value":"contexto uno expresión 12","answers":["respuesta uno contexto uno expresión 12","respuesta dos contexto uno expresión 12"]}]}]},{"id":5,"value":"nivel quinto","expressions":[{"id":13,"value":"value expression 13","explanation":"explicación expresión 13","contexts":[{"id":13,"value":"contexto uno expresión 13","answers":["respuesta uno contexto uno expresión 13","respuesta dos contexto uno expresión 13"]}]},{"id":14,"value":"value expression 14","explanation":"explicación expresión 14","contexts":[{"id":14,"value":"contexto uno expresión 14","answers":["respuesta uno contexto uno expresión 14","respuesta dos contexto uno expresión 14"]}]},{"id":15,"value":"value expression 15","explanation":"explicación expresión 15","contexts":[{"id":15,"value":"contexto uno expresión 15","answers":["respuesta uno contexto uno expresión 15","respuesta dos contexto uno expresión 15"]}]}]},{"id":6,"value":"nivel sexto","expressions":[{"id":16,"value":"value expression 16","explanation":"explicación expresión 16","contexts":[{"id":16,"value":"contexto uno expresión 16","answers":["respuesta uno contexto uno expresión 16","respuesta dos contexto uno expresión 16"]}]},{"id":17,"value":"value expression 17","explanation":"explicación expresión 17","contexts":[{"id":17,"value":"contexto uno expresión 17","answers":["respuesta uno contexto uno expresión 17","respuesta dos contexto uno expresión 17"]}]},{"id":18,"value":"value expression 18","explanation":"explicación expresión 18","contexts":[{"id":18,"value":"contexto uno expresión 18","answers":["respuesta uno contexto uno expresión 18","respuesta dos contexto uno expresión 18"]}]}]}]';
}

var levelsService = (function(){
	var levels = localStorage.levels ? JSON.parse(localStorage.levels) : [];

	function getLastLevel(){
		return levels[levels.length-1];
	}

	function getLevel(idLevel) {
		for(var i = 0, l = levels.length; i < l; i++){
			if(levels[i].id == idLevel) {
				return levels[i];
			}
		}
		console.log('Not exist this level');
		return false;
	}

	function getExpression(idLevel, idExpression) {
		var level = getLevel(idLevel);

		if(!level){
			return false;
		}
		
		for(var i = 0, l = level.expressions.length; i < l; i++){
			if(level.expressions[i].id == idExpression){
				return level.expressions[i];
			}
		}

		console.log('Not exist this expression into this level');
		return false;
	}

	function pullLevel(currentIdLevel){
		fakeServerRequest(currentIdLevel, function(newLevel){
			if(!newLevel){
				console.log('Level no encontrado en el servidor');
				return;
			}
			levels.push(newLevel);
			localStorage.levels = JSON.stringify(levels);
			dispatchEventAddedNewLevel();
		});
	}

	function fakeServerRequest(currentIdLevel, callback){
		if(callback === undefined){
			console.log('ERR: No callback');
			return;
		}
		var serverLevels = JSON.parse(localStorage.allLeves);
		var id = currentIdLevel+1;
		setTimeout(function(){
			for(var i = 0; i < serverLevels.length; i++){
				if(serverLevels[i].id == id){
					callback(serverLevels[i]);
					return;
				}
			}
			callback(false);
		}, 1000);
	}

	function dispatchEventAddedNewLevel(){
		var addedNewLevel = new CustomEvent(
						"addedNewLevel", 
						{
							bubbles: true,
							cancelable: true
						}
					);
		document.dispatchEvent(addedNewLevel);
	}

	return {
		getExpression: getExpression,
		getLastLevel: getLastLevel,
		pullLevel: pullLevel
	}

}());

if(localStorage.dev === undefined){
localStorage.actives = '{"1":{"idExpression":1,"idLevel":1,"created":"Wed Aug 10 2014 20:18:32 GMT+0200","errors":["2014-08-23T11:13:28.735Z"],"correct":"2014-08-23T13:51:37.285Z"},"2":{"idExpression":2,"idLevel":1,"created":"2014-08-26T18:48:22.110Z","errors":[],"correct":false},"3":{"idExpression":3,"idLevel":1,"created":"2014-08-26T18:54:08.682Z","errors":["2014-08-28T18:42:37.696Z"],"correct":"2014-08-28T18:43:02.281Z"},"4":{"idExpression":4,"idLevel":2,"created":"2014-09-13T08:50:06.115Z","errors":[],"correct":null},"5":{"idExpression":5,"idLevel":2,"created":"2014-09-08T15:21:11.078Z","errors":[],"correct":null},"6":{"idExpression":6,"idLevel":2,"created":"2014-09-11T09:50:10.084Z","errors":[],"correct":null},"7":{"idExpression":7,"idLevel":3,"created":"2014-09-11T09:50:10.084Z","errors":[],"correct":"2014-09-08T15:21:11.078Z"},"8":{"idExpression":8,"idLevel":3,"created":"2014-10-11T09:50:10.084Z","errors":[],"correct":"2014-10-08T15:21:11.078Z"},"9":{"idExpression":9,"idLevel":3,"created":"2015-11-03T09:50:10.084Z","errors":[],"correct":"2014-09-08T15:21:11.078Z"}}';
localStorage.daily = '{"idLevel":3,"idExpression":9}';
localStorage.notActives = '{"1":[],"2":[],"3":[],"active":3}';
}
var activesService = (function(){
	var actives = localStorage.actives ? JSON.parse(localStorage.actives) : {};
	var notActives = localStorage.notActives ? JSON.parse(localStorage.notActives) : [];
	var daily = localStorage.daily ? JSON.parse(localStorage.daily) : {};

	function getActive(idExpression) {
		return actives[idExpression];
	}

	function getActives(){
		return actives;
	}

	function updateActive(idExpression, correct){
		var date = new Date();
		if(correct){
			actives[idExpression].correct = date;
		} else {
			actives[idExpression].errors.push(date);
		}
		var eventData = {
			'correct': correct, 
			'idExpression': idExpression, 
			'date': date
		};
		saveData(eventData);
	}

	function getExressionByIdActive(idExpression) {
		var active = getActive(idExpression);
		if(!active){
			console.log('Not exit any active by this idExpression');
			return false;
		}
		return levelsService.getExpression(active.idLevel, active.idExpression);
	}

	function getDaily(){
		return getExressionByIdActive(daily.idExpression);
	}

	function createDaily(){
		if( isTodayDaily() ){
			//daily
			return getExressionByIdActive(daily.idExpression);
		}else{
			//generate daily
			return generateDaily();
		}
	}

	function isTodayDaily(){
		var active = getActive(daily.idExpression);
		var today = new Date();
		var dateDaily = new Date(active.created);

		if( dateDaily.setHours(0,0,0,0) == today.setHours(0,0,0,0) ){
			return true;
		}else{
			return false;
		}
	}

	function getDailyActive (){
		return getActive(daily.idExpression);
	}

	function generateDaily(){
		var idLevelActive = notActives.active;
		var levelActive = notActives[idLevelActive];
		
		if(levelActive.length <= 0){
			console.log('¡¡¡Necesitas descargar un nuevo nivel!!!');
			levelsService.pullLevel(idLevelActive);
			return false;
		}

		var todayExpressionId = levelActive.pop();
		generateActive(idLevelActive, todayExpressionId);
		//activamos alarma de practicar
		alarmService.setPracticeAlarm();
		alarmService.cancellAlarmById(0);
		if(levelActive.length < 1){
			console.log('¡¡¡Pedir nuevo nivel al server!!!');
			levelsService.pullLevel(idLevelActive);
		}
		saveData();
		return getExressionByIdActive(todayExpressionId);
	}

	function generateActive(idLevel, idExpression){
		var newActive = new Object();
		newActive.idExpression = idExpression;
		newActive.idLevel = idLevel;
		newActive.created = new Date();
		newActive.errors = new Array();
		newActive.correct = null;
		actives[newActive.idExpression] = newActive;
		daily['idLevel'] = idLevel;
		daily['idExpression'] = idExpression;
	}

	function saveData(eventData){
		localStorage.actives = JSON.stringify(actives);
		localStorage.notActives = JSON.stringify(notActives);
		localStorage.daily = JSON.stringify(daily);
		var detail = null;
		if(eventData !== undefined){
			detail = eventData;
		}
		dispatchEventUploadedActives(eventData);
		console.log('Upload actives data');
	}

	function errors(){
		var errors = [];
		var activeDaily = getActive(daily.idExpression);
		
		for( key in actives ) {
			if( (actives[key].idExpression == daily.idExpression && activeDaily.errors.length > 0) || !actives[key].correct){
				var idExpression = actives[key].idExpression;
				errors.push(idExpression);
			}
		}
		return errors;
	}

	function dispatchEventUploadedActives(eventData){
		var detail = null;
		if(eventData !== undefined){
			detail = eventData;
		}
		var uploadedActives = new CustomEvent(
						"uploadedActives", 
						{
							bubbles: true,
							cancelable: true,
							detail: detail
						}
					);
		document.dispatchEvent(uploadedActives);
	}

	function dispatchEventRefreshDaily(){
		var refreshDaily = new CustomEvent(
						"refreshDaily", 
						{
							bubbles: true,
							cancelable: true
						}
					);
		document.dispatchEvent(refreshDaily);
	}
	
	document.addEventListener('addedNewLevel', function(){
		var lastLevel = levelsService.getLastLevel();
		if(notActives.active == lastLevel.id){
			console.log('This level is already active');
			return;
		}
		notActives[lastLevel.id] = [];
		notActives.active = lastLevel.id;
		var expressions = lastLevel.expressions;

		for(var i = 0; i < expressions.length; i++){
			notActives[lastLevel.id].unshift(expressions[i].id);
		}
		saveData();
		if( !isTodayDaily() ){
			dispatchEventRefreshDaily();
		}
	})

	return {
		getActives: getActives,
		daily: daily,
		errors: errors,
		getActive: getActive,
		getExressionByIdActive: getExressionByIdActive,
		getDaily: getDaily,
		createDaily: createDaily,
		getDailyActive: getDailyActive,
		updateActive: updateActive
	}

}(levelsService));

if(localStorage.dev === undefined){
localStorage.life = 3;
}
var practiceService = (function(){
	var life = localStorage.life ? localStorage.life : 0;
	var errors = activesService.errors();
	
	document.addEventListener('uploadedActives', function(){
		errors = activesService.errors();
	});

	function getErrors(){
		return errors;
	}

	function saveData(){
		if(localStorage.life == life){
			return;
		}
		localStorage.life = life;
		console.log('Uploaded Life data');
		document.dispatchEvent(uploadedLifes);
	}

	function addLife(){
		life++;
		if(life > 3){
			life = 3;
		}
		saveData();		
		return life;
	}

	function removeLife(){
		life--;
		if(life < 0){
			life = 0;
		}
		saveData();		
		return life;
	}

	function getLifes(){
		return life;
	}

	function calculatePassed(){
		var actives = activesService.getActives();
		var dailyActive = activesService.getDailyActive();
		if(dailyActive.errors.length > 0 || dailyActive.correct){
			return Object.keys(actives).length - errors.length;
		}else{
			return Object.keys(actives).length - errors.length - 1;
		}
	}

	function errorDaily(){
		if(errors.length <= 0){
			console.log('There is not errors');
			return false;
		}

		var rand = Math.floor((Math.random() * errors.length));
		return activesService.getExressionByIdActive(errors[rand]);	
	}

	var uploadedLifes = new CustomEvent(
					"uploadedLifes", 
					{
						bubbles: true,
						cancelable: true
					}
				);

	return {
		getLifes: getLifes,
		calculatePassed: calculatePassed,
		addLife: addLife,
		removeLife: removeLife,
		getErrors: getErrors,
		errorDaily: errorDaily
	}

}(activesService));

localStorage.dev = true;
