function composerService(composerTextarea, composerTextareaCopy){
  this.textArea = composerTextarea;
  this.textAreaCopy = composerTextareaCopy;
  var self = this;
  this.text;
	composerTextarea.addEventListener('keydown', function (event) {
	    if (event.keyCode === 13) {
	        event.preventDefault();
	        return false;
	    }
	});
	composerTextarea.addEventListener('keyup', function(e){
		if(e.keyCode === 13) {
      //
		}
    self.text = this.value;
		composerTextareaCopy.textContent = this.value;
		var height = composerTextareaCopy.offsetHeight;
		this.style.height = height+'px';
	});
};

composerService.prototype.clean = function(){
  this.text = null;
  this.textArea.value = '';
  this.textAreaCopy.textContent = '';
}

composerService.prototype.verifyAnswer = function (answers, userAnswer){
      //quitar dobles espacios y saltos de línea
      //quitar signos de puntuación
      if(userAnswer == '' || typeof userAnswer === "undefined") return false;

      userAnswer = userAnswer.replace(/\s+/g, " ");
      userAnswer = userAnswer.replace(/\s+\?/g, "?");
      userAnswer = userAnswer.replace(/\s+!/g, "!");
      userAnswer = userAnswer.replace(/\s+\./g, ".");
      userAnswer = userAnswer.replace(/\s+,/g, ",");
      userAnswer = userAnswer.replace(/\s+:/g, ":");
      var answerWords = userAnswer.split(" ");
      
      for(index in answers){
        var tempWords = answers[index].split(" ");
        var countMistakes = 0;
        var maxMistakes = tempWords.length;

        for(i in tempWords){
        	if( typeof answerWords[i] === "undefined" ) {
        		countMistakes += tempWords[i].length;
        	}
          else {
            for(j in tempWords[i]){
              //estos signos no cuentan como error
              if(tempWords[i][j] != "." && tempWords[i][j] != "," && 
                tempWords[i][j] != "!" && tempWords[i][j] != "?"){
                if(tempWords[i][j] != answerWords[i][j]) countMistakes++;
              }
              if(countMistakes > maxMistakes) break;     
            }
          }
          if(countMistakes > maxMistakes) break;
        }
        if(countMistakes < maxMistakes) return true;
      }
      return false;
}


