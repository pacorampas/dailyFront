function LazyLoad(){
  this.arg = 'hola lazy';
}

LazyLoad.prototype.js = function(urls, callback) {
  var head  = document.head;
  for(var i=0; i < urls.length; i++){
    var script = document.getElementById(urls[i]);
    if(script){
      continue;
    }
    var script = document.createElement('script');
    script.id = urls[i];
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', urls[i]);
    head.appendChild(script);
    console.log(urls[i]+' loaded');
  }
  callback();
};

LazyLoad.prototype.html = function(url, callback) {
	ajax(url, callback);
  console.log(url+' loaded');
}

LazyLoad.prototype.css = function(urls, callback) {
    if(!urls) {
      callback();
      return;
    }
    var head  = document.head;
    for(var i=0; i < urls.length; i++){
      var link = document.getElementById(urls[i]);
      if(link){
        continue;
      }
      var link  = document.createElement('link');
      link.id = urls[i];
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = urls[i];
      head.appendChild(link);
      console.log(urls[i]+' loaded');
    }
    callback();
}


var LazyLoad = new LazyLoad();

function ajax(url, callback){
  var xhr = new XMLHttpRequest();
  xhr.onload = function(o) {
    if(o.target.status == 200){
      callback(xhr.responseText);
    }
    else {
      console.log('Error not 200');
      xhr.open('GET', url, true);
    }
  };
  xhr.onerror = function(o) {
    console.log('Error');
    xhr.open('GET', url, true);
  };
  xhr.open('GET', url, true);
  xhr.send();
}