(function(){
	document.addEventListener('deviceready', function(){
		if(localStorage.wizard === undefined){
			Routing.goTo('wizard');
			document.getElementById("screen-home").classList.add('top');
		}else{
			Routing.goTo('home');
		}

		if(localStorage.practiceActive === undefined){
			localStorage.practiceActive = 0;
		}
		//fire alarms
		alarmService.whenDeviceIsReady();
	});
})(Routing);