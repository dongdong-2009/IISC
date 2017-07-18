$(function() {


//var showInfo = function(message) {
  //$('div.progress').hide();
//  $('strong.message').text(message);
//  $('div.alert').show();
//};


$("#uploadSubmit").on('click', function(evt) {

    evt.preventDefault();

    
    var file = document.getElementById('uploadBtn').files[0];
    var prjid = getUrlLastField(location.href);


    if( !isValidPrjUrl(location.href) || !file) {
        showInfo('Please select file first','error');
        return;
    }  

    showInfo('');
    ctlProgressBar(true);
    ctlBtn(false);


    var formData = new FormData();
    formData.append('myFile', file);

    var xhr = new XMLHttpRequest();
    xhr.open('post', '/project/uploadfile/' + prjid, true);

    xhr.timeout = 300000; // time in milliseconds
    $('#progressBar').css('width', 2+'%').attr('aria-valuenow', 2).text(2+"%" );

    xhr.upload.onprogress = function(e) {
      
      if (e.lengthComputable && (e.total > 0)) {
        var percentage = parseInt((e.loaded / e.total) * 100);
          if(percentage < 100) {
            $('#progressBar').css('width', percentage+'%').attr('aria-valuenow', percentage).text(percentage+"%" );
          }
      }
    };
    
    xhr.onerror = function(e) {
        //TODO show error message at jade
        showInfo('File Transfer Error, Please Use Wired Network','error');
        console.log('An error occurred');        
        ctlProgressBar(false);
        ctlBtn(true);
        clearInputFile();
    };

    xhr.ontimeout = function (e) {
  // XMLHttpRequest timed out. Do something here.
        showInfo('Transfer Timeout,Please Use Wired Network','error');
        console.log('Timeout error occurred');
        ctlProgressBar(false);
        ctlBtn(true);
        clearInputFile();
    };


    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          console.log("200");
      } 
      else if (xhr.readyState == 4 && xhr.status == 500) {
        //showInfo('Server Error','error');
        console.log(500);
      }
    };
    xhr.onload = function() {        
        showPrjFiles();        
        // Wait display and then clear Progressbar
        //ctlProgressBar(false);
        //ctlBtn(true);        
        //clearInputFile();        
    };

    xhr.send(formData);
  });
  
});


$("form").submit(function() {

  clearInputFile();
});

$(document).ready(function () {
  showInfo('');
  showPrjFiles();
});


function deleteFile( fileId ){
    //TODO

    if(!fileId) {
      return;
    }

    var url = '/project/deletefile/' + fileId;  
    var xhr = new XMLHttpRequest();  

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {            
            showPrjFiles();
        }
    };
    xhr.onerror = function(e) {
      showPrjFiles();
    };
    xhr.onload = function() {
      showPrjFiles();
    };

    xhr.open("GET", url, true);
    xhr.send();
}


//private method
function showPrjFiles() {

  var prjid = getUrlLastField(location.href);
  var url = '/project/listfile/' + prjid;

  if( isValidPrjUrl(location.href) ) {

    reqFileList(url);
  }
}

function reqFileList(url) {

  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function() {

      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {       
          $('#progressBar').css('width', 100+'%').attr('aria-valuenow', 100).text(100+"%" );   
          var fileListObj = JSON.parse(xmlhttp.responseText);
          showFileList(fileListObj);
          
          ctlProgressBar(false);
          ctlBtn(true);        
          clearInputFile();
      }
  };  
  xmlhttp.onerror = function(e) {
        //TODO show error message at jade
        //showInfo('An error occurred while submitting the form. Maybe your file is too big');
        showInfo('File Query Error','error');
        console.log('An error occurred');        
        ctlProgressBar(false);
        ctlBtn(true);
        clearInputFile();
    };

  xmlhttp.onload = function() {        
        //ctlProgressBar(false);
        //ctlBtn(true);        
        //clearInputFile();
        //showInfo('File Transfer Complete');        
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();  
}

function showInfo(message,type){
  
  var tree = document.createDocumentFragment(); 
  var pItem = document.createElement("p");
  var style="color:black";
  
  clearChild("errorMessage");
  
  if(message==''){
    return;
  }
  
  if(type && type=="error"){
    style="color:red";
  } 
  
  pItem.setAttribute("style", style);    
  pItem.innerHTML = message;
  tree.appendChild(pItem);
  
  document.getElementById("errorMessage").appendChild(tree);

}
// utility method
function getUrlLastField(url) {

    var tmparray = url.split("/");
    return tmparray[tmparray.length-1];
}

function isValidPrjUrl(url) {

    var result =false;
    var tmparray = url.split("/");

    if(tmparray.length > 2) {

      if( (tmparray[tmparray.length-2] =="project") && 
          (tmparray[tmparray.length-1] =="create") ) {

        result = true;
      } else if( (tmparray[tmparray.length-2] =="edit") && 
                  (tmparray[tmparray.length-3] =="project") ) {
        result = true;
      }
    }    

    return result;
}

function ctlProgressBar(display) {

  var progressBar = document.getElementById("progressBar");

    if(progressBar) {

        if(display) {
            progressBar.style.display = "inline";
        }else {
            progressBar.style.display = "none";
            progressBar.style.width = "0%";
        }
  }
}

function ctlBtn(enable) {

  var btnSel = document.getElementById("uploadBtn");
  var btnUp = document.getElementById("uploadSubmit");

  btnSel.disabled = !enable;
  btnUp.disabled = !enable;
}

function showFileList(fileListObj) {

  var tree = document.createDocumentFragment();
  var prjId = getUrlLastField(location.href);

  if(!isValidPrjUrl(location.href) ) {
        return;
  }
  
  clearChild("uploadFileList");

  for(var i=0; i < fileListObj.length;i++ ) {

    var delLink = document.createElement("a");
    //delLink.setAttribute("id", fileListObj[i].saveName);
    delLink.setAttribute("id", "fileLink");
    //delLink.setAttribute("href", "/project/deletefile/"+fileListObj[i].saveName);
    delLink.setAttribute("onclick", "deleteFile(\'"+fileListObj[i].saveName+"\')");
    delLink.setAttribute("style", "color:red;");
    delLink.innerHTML = "Delete";
    tree.appendChild(delLink);


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

}

function clearChild(itemId) {

  var item =  document.getElementById(itemId);
  
  while (item.firstChild) {
    item.removeChild(item.firstChild);
  }
  
}

function clearInputFile() {

  $("#fileUpload").val('');
  $("#uploadBtn").val('');  
}


