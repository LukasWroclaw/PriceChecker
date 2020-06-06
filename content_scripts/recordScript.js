/**
 * Created by Lukas on 2020-03-01.
 */


document.body.style.border = "5px solid red";

var btnRecord = document.createElement("BUTTON");
btnRecord.innerHTML = "Record price";
document.body.appendChild(btnRecord);	
btnRecord.addEventListener("click", recordFunction);





function idFromData()
{
	var today = new Date();
	var day = (today.getDate()).toString();
	var hour = (today.getHours()).toString();
	var minute = (today.getMinutes()).toString();
	var second = (today.getSeconds()).toString();
	var output = day + "." + hour + "." + minute + "." + second;
	return output;
}

function defaultResponseHandler(message) {
  console.log("defaultResponseHandler() Message from the background script:", message.response);
}

function defaultErrorHandler(error) {
  console.log("defaultErrorHandler () Error: ${error}");
}

function notifyBackgroundScript(msgToSend, responseHandler = defaultResponseHandler, errorHandler = defaultErrorHandler) {
  var sending = browser.runtime.sendMessage(msgToSend);
  sending.then(responseHandler, errorHandler);  
}






function recordFunction() {
	var selObj = window.getSelection();

	var offsetParent = selObj.anchorNode.parentElement.offsetParent;

	var nameOfSelectedClass = offsetParent.className;
	var positionOfSelectedClass = offsetParent.getBoundingClientRect();
	
	
	var elementToStore = {
		address  		:  window.location.href,
		anchorNode   	:  window.getSelection().anchorNode,
		nameOfClass		:  nameOfSelectedClass,
		positionOnPage  :  positionOfSelectedClass,
		price 			:  selObj.toString()
	}
	
	console.log("recordFunction() Record of element", elementToStore.address, elementToStore.anchorNode, elementToStore.price);
	
	var msg = {
		typeOfRequest: "store",
		idFromData : idFromData(),
		data: JSON.stringify(elementToStore)
	};
	notifyBackgroundScript(msg);
	
}



function resetFunction() {
	console.log("resetFunction() Reset of storage");
	
	var msg = {
		typeOfRequest: "resetBase"
	};
	notifyBackgroundScript(msg);
	
}


function dataBaseResponseHandler(message) {
	var responseDataBase = message.response;

	globalDataBase = responseDataBase;

	Object.keys(responseDataBase).forEach(function(key){
		var rawItem = responseDataBase[key];
		var element = JSON.parse(rawItem);

		console.log("dataBaseResponseHandler() Element", key, element["address"], element["price"]);		
	});
	
}

function checkPriceOnPage(element)
{
	console.log("checkPriceOnPage() start checking", element["address"], element["nameOfClass"]);

	var getReq = jQuery.get(element["address"], function(data){

		var stringFromHTML = $.parseHTML(data);

		var positionPrice = stringFromHTML.indexOf("price__regular");

		console.log("checkPriceOnPage() children checked");	
	});
}

function comparePriceResponseHandler(message) {
	var responseDataBase = message.response;

	globalDataBase = responseDataBase;

	Object.keys(responseDataBase).forEach(function(key){
		var rawItem = responseDataBase[key];
		var element = JSON.parse(rawItem);
		checkPriceOnPage(element);
		console.log("comparePriceResponseHandler() Element", key, element["address"], element["price"]);		
	});
	
}


function getDataBaseFunction() {
	console.log("getDataBaseFunction() Storage content");

	var msg = {
		typeOfRequest: "getBase"
	};
	notifyBackgroundScript(msg, dataBaseResponseHandler);	
}

function comparePricesFunction() {
	console.log("comparePricesFunction() Storage content");

	var msg = {
		typeOfRequest: "getBase"
	};
	notifyBackgroundScript(msg, comparePriceResponseHandler);	

}


