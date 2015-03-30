var alarmService = (function(){
	function setPracticeAlarm() {
		var isDate = new Date();
		var hour = isDate.getHours();	
		var diference = 22 - hour;
		var rand = Math.floor(Math.random() * diference) + 1;


		isDate.setHours( (isDate.getHours() + rand) ); //le sumamos las horas para que suene en ahora + rand horas


		cordova.plugins.notification.local.schedule({
	        id: 1,
	        title: 'Put in practice',
	        text: 'Our teacher is waiting you for testing your progress',
	        at: isDate,
	        smallIcon: 'res://drawable/icon_small.png',
	        data: 'Practice'
	    });
	}

	function setDailyAlarm() {
		var isDate = new Date();
		isDate.setDate( isDate.getDate() + 1 );
		
		var rand = Math.floor(Math.random() * 9) + 1;

		isDate.setHours(  (rand + 9) ); //le sumamos 9 para que suene a partir de las 9 de la mañana

		cordova.plugins.notification.local.schedule({	
				id: 0,
				title: 'Your daily is waiting for you',
				text: 'Our teacher has generate your daily expression',
				at: isDate,
				smallIcon: 'res://drawable/icon_small.png',
				data: 'Daily'
		});
	}

	function dispatchEventPracticeActives(){
		var practiceActive = document.createEvent('Event');
    	practiceActive.initEvent('practiceActive', true, true);

		document.dispatchEvent(practiceActive);
	}

	function getAllAlarms(callback){
		if(!callback){
			console.log('No call back');
			return;
		}
		cordova.plugins.notification.local.getAll(function (notifications) {
			callback(notifications);
		});
	}

	function getAlarmById(id, callback){
		if(!callback){
			console.log('No call back');
			return;
		}
		cordova.plugins.notification.local.get(id, function (notification) {
	    	callback(notification);
		});
	}

	function clearAllAlarms(){
		cordova.plugins.notification.local.clearAll(function(e) {
			console.log('Clear all alarms '+e);
		}, this)
	}

	function clearAlarmById(idAlarm){
		idAlarm = idAlarm.toString()
		cordova.plugins.notification.local.clear(idAlarm, function() {
    		console.log('Clear alarm id: '+idAlarm);
		});
	}

	function cancellAllAlarms(){
		cordova.plugins.notification.local.cancelAll(function(e) {
		    console.log('Cancel all alarms '+e);
		}, this);
	}

	function cancellAlarmById(idAlarm){
		cordova.plugins.notification.local.cancel(idAlarm, function() {
		   console.log('Clear alarm id: '+idAlarm);
		   clearAlarmById(idAlarm);
		});
	}

	function setLifeAlarm(lifes){
		if (lifes == 3 || lifes === null || lifes === undefined) {
			console.log('no lifes to save alarm');
			return;
		}

		var isDate = new Date();
		
		if(lifes == 0) { //mañana
			isDate.setDate( isDate.getDate() + 1 );
			console.log('Alarm +1 day');
		}
		else if(lifes == 1) { //en 3 días
			isDate.setDate( isDate.getDate() + 3 );
			console.log('Alarm +3 day');
		}
		else if(lifes == 2) { //en 7 días
			isDate.setDate( isDate.getDate() + 7 );
			console.log('Alarm +7 day');
		}
		var data = 'Life-'+lifes;
		window.plugin.notification.local.add(
			{ 	
				id: 2+lifes,
				title: 'New life',
				text: 'You have a new life for practice errors',
				at: isDate,
				smallIcon: 'res://drawable/icon_small.png',
				data: data
			}
		);
	}
	

	function whenDeviceIsReady(){
		cordova.plugins.notification.local.on('schedule', function(notification) {
		    var date = new Date();
		    date.setTime(notification.at*1000);

		    if(notification.data == 'Daily'){
	        	dispatchEventPracticeActives();
	        }
		});
		    
	    cordova.plugins.notification.local.on("clear", function (notification, state) {
	    	fireNotification(notification);
		});

		cordova.plugins.notification.local.on("click", function (notification, state) {
		    clearAlarmById(notification.id);
		})

	}

	function fireNotification(notification){
	    if(notification.id == 1){
			localStorage.practiceActive = 1;
        	dispatchEventPracticeActives();
		} else if(notification.id == 2 || notification.id == 3 || notification.id == 4){
			practiceService.addLife();
		}
	}

	return {
		setPracticeAlarm: setPracticeAlarm,
		setDailyAlarm: setDailyAlarm,
		getAllAlarms: getAllAlarms,
		setLifeAlarm: setLifeAlarm,
		clearAllAlarms: clearAllAlarms,
		clearAlarmById: clearAlarmById,
		cancellAllAlarms: cancellAllAlarms,
		cancellAlarmById: cancellAlarmById,
		getAlarmById: getAlarmById,
		whenDeviceIsReady: whenDeviceIsReady
	}
}());
