$(document).ready(function () {
  
  showPrjFiles();

});

//private method
function showPrjFiles() {

  var prjid = getUrlLastField(location.href);
  var url = '/itemreview/listfile/' + prjid;

  if( isValidUrl(location.href) ) {

    reqFileList(url);
  }
}

function reqFileList(url) {
  console.log(url);
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {

      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {          
          var fileListObj = JSON.parse(xmlhttp.responseText);          
          showFileList(fileListObj);
      }
  };  

  xmlhttp.open("GET", url, true);
  xmlhttp.send();  
}


// utility method
function getUrlLastField(url) {

    var tmparray = url.split("/");
    return tmparray[tmparray.length-1];
}

function isValidUrl(url) {

    var result =false;
    var tmparray = url.split("/");

    if(tmparray.length > 2) {

      if( (tmparray[tmparray.length-2] =="detail") && 
          (tmparray[tmparray.length-3] =="itemreview") ) {

        result = true;
      }
    }

    return result;
}


function showFileList(fileListObj) {

  var tree = document.createDocumentFragment();
  var prjId = getUrlLastField(location.href);

  if(!isValidUrl(location.href) ) {
        return;
  }
  
  //clearChild("uploadFileList");
  if(fileListObj.length>0){
	  for(var i=0; i < fileListObj.length;i++ ) {

	    var link = document.createElement("a");
	    link.setAttribute("href", "/doc/user_"+fileListObj[i].userId+"/prj_"+prjId+"/"+fileListObj[i].saveName);
	    link.setAttribute("style", "margin-left:10px");
	    link.setAttribute("download",fileListObj[i].originalName);
	    link.innerHTML = fileListObj[i].originalName;
	    tree.appendChild(link);

	    var brItem = document.createElement("br");
	    tree.appendChild(brItem);

	  }
	  document.getElementById("uploadFileList").appendChild(tree);
  }else{
	c_alert = document.createElement("div");
	c_alert.setAttribute("class","alert alert-warning")
	c_alert.setAttribute("role","alert")
	c_alert.setAttribute("style","max-width: 300px;")
	c_alert .innerHTML = "Please upload attachment"
	document.getElementById("uploadFileList").appendChild(c_alert);
  }

}

function clearChild(itemId) {

  var item =  document.getElementById(itemId);
  
  while (item.firstChild) {
    item.removeChild(item.firstChild);
  }
  
}


