/****************************************************************
*																*
* Filename: pageGeneration.js									*
* Authors: Ryan Rodriguez, Josh Wu, David Easley, Chen Long		*
* Purpose: Implements creation/modification of pages			*
*																*
****************************************************************/

// pre: page is a MakePage object
//		type is a string ()
generateContent = function(page, type) {

	if("HomePage" == type) {
		generateHomeContent(page);
	}
	else if("RoutesPage" == type) {
		generateRouteContent(page);
	}
	else if("MapPage" == type) {
		generateMapContent(page);
	}
	else if("SettingsPage" == type) {
		generateSettingsContent(page);
	}
}

// pre: page is a MakePage object
generateHomeContent = function(page) {

	page.addContent("header","<h1>MyBus Home Page</h1>");
	page.addContent("header",'<div data-role="navbar"></div>');
	page.addContent("body",'<p class="welcome">Welcome to MyBus</p>');
	page.addContent("body",'<p class="disclaimer" style="text-align:center">*All times are approximate. Please arrive 5 minutes early.</p>');
	page.addContent("footer","<h1>An app developed by David Easley, Ryan Rodriguez, Josh Wu and Chen Long</h1>");

}

generateRouteContent = function(page) {

	// Header
	page.addContent("header","<h1>Route Info</h1>");
	page.addContent("header",'<div data-role="navbar"></div>');

	// Body Text
	var routeName = "Fake Route Name";
	page.addContent("body",'<h4 class="routesContent">' + routeName + '</h4>')
	var stopName = "Fake Stop Name";
	var stopNum = 99;
	page.addContent("body",'<p class="routesContent">For Stop ' + stopNum + ': ' + stopName + '</p>');
	var arrivalTime = "12:00pm";
	page.addContent("body",'<p class="routesContent">Next Arrival at: ' + arrivalTime + '</p>');

	// Body Buttons
	var $fatCollapsibleSet = $('<div class="ui-collapsible-set"></div>');
	var $fatCollapsible = $('<div data-role="collapsible"></div>');
	var $returnToStopBtn = $('<a class="ui-btn">Return to Stop on Map</a>');

	// modify buttons
	$fatCollapsible.append("<H4>Show Future Arrival Times");
	$fatList = $('<ul data-role="listview" data-inset="false" style="min-width:210px;" data-theme="a"></ul>');

	/*TEMP ARRAY*/	var times = ["12:20 pm","12:40 pm","1:00 pm","1:20 pm","1:40 pm","2:00 pm"];	/*TEMP ARRAY*/

	for(var i = 0; i < times.length; i++) {

		$fatList.append('<li>' + times[i] + '</li>');
	}

	$fatCollapsible.append($fatList);
	$fatCollapsibleSet.append($fatCollapsible);

	// append buttons
	page.addContent("body", $fatCollapsible);
	page.addContent("body", $returnToStopBtn);

	// Footer
	page.addContent("footer","<h1>An app developed by David Easley, Ryan Rodriguez, Josh Wu and Chen Long</h1>");



}


generateMapContent = function(page) {

	page.addContent("header","<h1>MyBus City Map</h1>");

	//modified navbar to include additional options for markers/favorites
	$navbarMap = $('<div data-role="navbar"></div>');
	$navbarMap.append('<ul><li><a href="#">Map Marker Options</a></li><li><a href="#">Favorites Options</a></li></ul>');
	page.addContent("header", $navbarMap);
	//

	page.addContent("body", '<div id="map"></div>');

	var map = new GMaps({
		el: "#map",
		lat: 38.955028,
		lng: -95.262750,
		zoomControl : true,
		zoomControlOpt: {
			style : "SMALL",
			position: "TOP_LEFT"
		},
		panControl : false,
		streetViewControl : false,
		mapTypeControl: false,
		overviewMapControl: false,
		width: "95%",
		height: "95%"
	});

	for(var i = 0; i < busStops.length; i++)
	{
		map.addMarker(
		{
			lat: busStops[i].stop_lat,
			lng: busStops[i].stop_lon,
			title: busStops[i].stop_name,
			infoWindow: {
				content: '<p>'+busStops[i].stop_name+'</p><p>Stop '+busStops[i].stop_code+
				'</p>'+"<button onclick='myFunction()'>Click me</button>"
			}
		});
	}

	// refreshes map on page transition
	$(document).on( "pageshow", function() {
		map.refresh();
	});



}


// pre: page is a MakePage object
generateSettingsContent = function(page) {

	page.addContent("header","<h1>Settings</h1>");
	$buttonSettingsList = $('<ul data-role="listview" data-inset="true" style="min-width:210px;"data-theme="a"></ul>');

	generateSettingsContentStartup(page, $buttonSettingsList);
	generateSettingsContentFavorites(page, $buttonSettingsList);
	generateSettingsContentMapStart(page, $buttonSettingsList);
	generateSettingsContentFontSize(page, $buttonSettingsList);

	page.addContent("body", $buttonSettingsList);
	page.addContent("footer","<h1>An app developed by David Easley, Ryan Rodriguez, Josh Wu and Chen Long</h1>");

}

generateSettingsContentStartup = function(page, list) {
	//
	// manage which page loads first on startup
	//

	$startupButton = $('<li><a href="#popupStartup" class="ui-btn" data-rel="popup">Start Page</a></li>');
	$startupPopup = $('<div data-role="popup" id="popupStartup" data-theme="a"></div>');
	// adds a close button to the popup
	$startupPopup.append('<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>');
	$startupList = $('<ul data-role="listview" data-inset="true" style="min-width:210px;"data-theme="b"></ul>');
	$startupList.append('<li data-role="divider" data-theme="a">Pages</li>');
	for(var i = 0; i < menuPageIDs.length; i++) {
		var $button = $('<li><a class="ui-btn">' + menuPageIDs[i].slice(0, -4) + '</a></li>');

		var setPage = function(page) {
			return function() {
				// set starting page
				currentSettings.setStartPage(page);

				// close popup
				$startupPopup.popup( "close" );
			};
		}

		$button.click( setPage(i) );

		$startupList.append($button);
	}
	// append list to popup
	$startupPopup.append($startupList);

	// append popup to body
	page.addContent("body", $startupPopup);
	// append button to list on page
	list.append($startupButton);
}

generateSettingsContentFavorites = function(page, list) {
	//
	// manage favorites
	//
	$favoritesButton = $('<li><a href="#popupFavorites" class="ui-btn" data-rel="popup">Favorites</a></li>');
	$favoritesPopup = $('<div data-role="popup" id="popupFavorites"></div>');

	// adds a close button to the popup
	$favoritesPopup.append('<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>');
	$favoritesList = $('<ul id="favSettingsList" data-role="listview" data-inset="true" style="min-width:210px;"data-theme="b"></ul>');
	$favoritesList.append('<li data-role="divider" data-theme="a">Favorites</li>');

	$(document).on("pagebeforeshow ",function(event){
		for(var i = 0; i < favorites.favArray.length; i++) {
			var $button = $('<li><a class="ui-btn">Remove \"' + favorites.favArray[i] + '\"</a></li>');

			var removeFavorite = function(page) {
				return function() {
					// remove favorite
					favorites.delElement(favorites.favArray[i]);

					// close popup
					$favoritesPopup.popup( "close" );
				};
			}

			$button.click( removeFavorite(i) );

			$("#favSettingsList").append($button);
		}
	});

	// append list to popup
	$favoritesPopup.append($favoritesList);

	// append popup to body
	page.addContent("body", $favoritesPopup);
	// append button to list on page
	list.append($favoritesButton);

	page.addContent("body", $favoritesPopup);
	list.append($favoritesButton);


}

generateSettingsContentMapStart = function(page, list) {
	//
	// manage where the map centers at startup
	//
	$mapStartButton = $('<li><a href="#popupMapStart" class="ui-btn" data-rel="popup">Starting Map Location</a></li>');
	$mapStartPopup = $('<div data-role="popup" id="popupMapStart"><p>This is a completely basic popup, no options set.</p></div>');

	page.addContent("body", $mapStartPopup);
	list.append($mapStartButton);
}

generateSettingsContentFontSize = function(page, list) {
	//
	// manage font size
	//
	$fontSizeButton = $('<li><a href="#popupFontSize" class="ui-btn" data-rel="popup">Font Size</a></li>');
	$fontSizePopup = $('<div data-role="popup" id="popupFontSize"></div>');

	// adds a close button
	$fontSizePopup.append('<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>');
	$fontSizeList = $('<ul data-role="listview" data-inset="true" style="min-width:210px;"data-theme="b"></ul>');
	$fontSizeList.append('<li data-role="divider" data-theme="a">Font Size</li>');

	//sets font size in terms of percent
	var sizes = [["Small", 80], ["Medium", 100], ["Large", 120]];
	for(var j = 0; j < sizes.length; j++) {
		var $button = $('<li><a class="ui-btn">' + sizes[j][0] + '</a></li>');

		var sizeOfFont = sizes[j][1];
		var setFontSize = function (size) {
			return function() {
				// set font size
				currentSettings.setFontSize(size);

				// close popup
				$fontSizePopup.popup( "close" );
			}
		}
		$button.click( setFontSize(sizeOfFont) );

		$fontSizeList.append($button);
	}
	$fontSizePopup.append($fontSizeList);


	page.addContent("body", $fontSizePopup);
	list.append($fontSizeButton);
}
