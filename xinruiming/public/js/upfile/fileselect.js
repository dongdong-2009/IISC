function fileSelect() { 

	document.getElementById("uploadBtn").onchange = function () 	{
		if(this.value) {
			var filename = this.value; 
			var tmparray=filename.split("\\");
			document.getElementById("fileUpload").value = tmparray[tmparray.length-1];	
		}
	};
}


