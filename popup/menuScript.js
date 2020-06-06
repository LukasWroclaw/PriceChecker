


document.getElementById("RecordPriceMenu").addEventListener("click", recordFunction);
document.getElementById("ResetBase").addEventListener("click", resetFunction);
document.getElementById("ProvideChangedPrices").addEventListener("click", getDataBaseFunction);




function recordFunction()
{
  console.log("recordFunction() Enable recordScript");
  browser.tabs.executeScript({file: "/content_scripts/recordScript.js"});
}

function resetFunction() {
	console.log("resetFunction() Reset of storage");
	
	var msg = {
		typeOfRequest: "resetBase"
	};
	notifyBackgroundScript(msg);
	
}

function getDataBaseFunction() {
	console.log("getDataBaseFunction() Storage content");

	var msg = {
		typeOfRequest: "getBase"
	};
	notifyBackgroundScript(msg, dataBaseResponseHandler);	
}

function dataBaseResponseHandler(message) {
	var responseDataBase = message.response;

	globalDataBase = responseDataBase;

	Object.keys(responseDataBase).forEach(function(key){
		var rawItem = responseDataBase[key];
		var element = JSON.parse(rawItem);

    console.log("dataBaseResponseHandler() Element", key, element["address"], element["price"]);
    alert(element["address"]);
    alert(element["price"]);

	});
	
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
