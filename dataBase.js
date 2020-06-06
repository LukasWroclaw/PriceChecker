/**
 * Created by Lukas on 2020-03-01.
 */

function handleMessage(request, sender, sendResponse) {
	
	if(request.typeOfRequest == "store")
	{
		localStorage.setItem(request.idFromData, request.data);
		sendResponse({response: request.typeOfRequest});
	}
	else if(request.typeOfRequest == "resetBase")
	{
		localStorage.clear();
		sendResponse({response: request.typeOfRequest});
	}
	else if(request.typeOfRequest == "getBase")
	{
		var responseObj = {};

		Object.keys(localStorage).forEach(function(key){
			var rawItem = localStorage.getItem(key);

			if("address" in JSON.parse(rawItem))
			{
				responseObj[key] = rawItem;
			}			
		});
		sendResponse({response: responseObj});

	}
}

browser.runtime.onMessage.addListener(handleMessage);

