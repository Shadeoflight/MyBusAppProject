//
// Where secondary changes to SettingsPage go
//

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

    var updateFavoritesList = function() {
        $(".favListBtn").remove();
        var favArray = currentSettings.getFavorites();
		for(var i = 0; i < favArray.length; i++) {

			var $button = $('<li><a class="ui-btn favListBtn">Remove \"' + favArray[i][0] + '\"</a></li>');
            var favElement = favArray[i][0];
			var removeFavorite = function(page) {
				return function() {
					// remove favorite
					favorites.delElement(favElement);

					// close popup
					$favoritesPopup.popup( "close" );

                    updateFavoritesList();
				};
			}

			$button.click( removeFavorite(i) );

			$("#favSettingsList").append($button);
		}
    }
	$(document).on('pageshow', updateFavoritesList);

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