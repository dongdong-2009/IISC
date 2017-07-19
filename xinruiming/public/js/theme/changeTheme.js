window.onload = function(){
	var curtThemeLink = localStorage.getItem('curtThemeLink');
	if(curtThemeLink){
		var $curt = $('head link[name = curtTheme]');
		$curt.remove();
		var fileref = document.createElement('link');
		fileref.setAttribute("href", curtThemeLink);
		fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("name", "curtTheme");
		var slashIndex = curtThemeLink.lastIndexOf('/');
		var expIndex = curtThemeLink.lastIndexOf('.min.css');
		var themeName = curtThemeLink.substring(slashIndex+1,expIndex);
    $('ul.navbar-nav a[name=thText]').html(themeName);
    document.getElementsByTagName("head")[0].appendChild(fileref);
	}
}
function changeTo(_className) {
  //session;
  var $curt = $('head link[name = curtTheme]');
  if($curt && $curt.length>0){
    var name = _className || '';
    $curt.remove();
    var hrefSrc = '/styles/themes/'+name+'.min.css';
    var fileref = document.createElement('link');
    fileref.setAttribute("href", hrefSrc);
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("name", "curtTheme");
    
    document.getElementsByTagName("head")[0].appendChild(fileref);
    $('ul.navbar-nav a[name=thText]').html(name);
		localStorage.setItem('curtThemeLink',hrefSrc);
  }
}
function changeToHand(_className){
  $('li .'+_className).css('cursor','pointer');
}