(function(){
  'use strict';

  angular.module('ShowCountriesApp', ['swxSessionStorage'])
  .controller('ShowCountriesController', ShowCountriesController)
  .service('ShowCountriesService', ShowCountriesService);

  ShowCountriesController.$inject = ['ShowCountriesService', '$sessionStorage'];
  function ShowCountriesController(ShowCountriesService, $sessionStorage) {
    var show = this;

    /*
     * Checks if to get the data from a session storage, 
     * or to wait for a user send request
    */
    if ($sessionStorage.get('storageFlag') === undefined || $sessionStorage.get('storageFlag') === false) {
      show.search = "";
      show.searchAfterClick = "";
      show.flag = false;
      show.checkboxesArray = [];
      show.quantity = 0;
      show.howManyCheckboxes = 0;
      $sessionStorage.put('searchAfterClick', show.searchAfterClick);
      $sessionStorage.put('checkboxesArray', show.checkboxesArray);
    } else {
      show.searchAfterClick = $sessionStorage.get('searchAfterClick');
      show.flag = $sessionStorage.get('storageFlag');
      show.howManyCheckboxes = $sessionStorage.get('howMany');
      show.quantity = $sessionStorage.get('howMany');
    }

    // Initializes XMLHttpRequest
    var promise = ShowCountriesService.getCountries();

    promise.then(function(response) {
      show.universities = response.data;
    })
    .catch(function(error) {
      console.log("Something went terribly wrong.");
    });

    // Puts the data to the table and shows it after the click on "Send" button
    show.showItems = function() {
      var myList = $sessionStorage.get('checkboxesArray');
      if (show.search !== show.searchAfterClick) {
        for(var i = 0; i < myList.length; i++) {
          var universities = table.childNodes[1];
          var row = universities.childNodes[i*2 + 3];
          var column = row.childNodes[13];
          var checkbox = column.firstChild;

          checkbox.checked = false;
          myList[i] = null;
        }
        show.howManyCheckboxes = 0;
        $sessionStorage.put('howMany', show.howManyCheckboxes);
        show.quantity = $sessionStorage.get('howMany');
        show.searchAfterClick = show.search;
        ($sessionStorage.put('searchAfterClick', show.searchAfterClick));
      }

      show.flag = ShowCountriesService.showFlag();
      $sessionStorage.put('storageFlag', ShowCountriesService.showFlag())
    }

    // Resets the data and hides the table after the click on "Reset" button
    show.hideItems = function() {
      var myList = $sessionStorage.get('checkboxesArray');
      var table = document.getElementById('table');

      for(var i = 0; i < myList.length; i++) {
        if (myList[i] === true){
          var universities = table.childNodes[1];
          var row = universities.childNodes[i*2 + 3];
          var column = row.childNodes[13];
          var checkbox = column.firstChild;
          checkbox.checked = false;
          myList[i] = null;
        }
      }
      show.howManyCheckboxes = 0;
      $sessionStorage.put('howMany', show.howManyCheckboxes);
      show.quantity = $sessionStorage.get('howMany');

      show.flag = ShowCountriesService.hideFlag();
      show.search = "";
      $sessionStorage.put('storageFlag', ShowCountriesService.hideFlag());
    }

    /*
     * Creates and puts to a session storage an array of checkboxes values 
     * Increases or decreases the number of items in my list
    */
    show.saveToMyList = function(id) {
      var myList = $sessionStorage.get('checkboxesArray');
      var getValues = ShowCountriesService.saveToMyList(id, myList);

      $sessionStorage.put('checkboxesArray', getValues[0]);
      if (getValues[1] === true) {
        show.howManyCheckboxes++;
        $sessionStorage.put('howMany', show.howManyCheckboxes);
        show.quantity = $sessionStorage.get('howMany');
      } else {
        show.howManyCheckboxes--;
        $sessionStorage.put('howMany', show.howManyCheckboxes);
        show.quantity = $sessionStorage.get('howMany');
      }
    }

    // Gets checkboxes values from a session storage and sets them on a page
    show.setCheckboxes = function() {
      var myList = $sessionStorage.get('checkboxesArray');
      var table = document.getElementById('table');
      for(var i = 0; i < myList.length; i++) {
        if (myList[i] === true) {
          var universities = table.childNodes[1];
          var row = universities.childNodes[i*2 + 3];
          var column = row.childNodes[13];
          var checkbox = column.firstChild;
          checkbox.checked = true;
        }
      }
    }

  }

  ShowCountriesService.$inject = ['$http']
  function ShowCountriesService($http) {
    var service = this;

    // Creates XMLHttpRequest
    service.getCountries = function() {
      var response = $http({
        method: "GET",
        url: ("../data/data.json")
      });

      return response;
    }

    /*
     * Saves checkboxes values to an array
     * Returns this array and a boolean value 
       for choosing if to increase or decrease 
       the number of items in my list
    */
    service.saveToMyList = function(id, myList) {
      var plusOrMinus;

      if (myList[id] === true) {
        myList[id] = null;
        plusOrMinus = false;
      } else {
        myList[id] = true;
        plusOrMinus = true;
      }

      return [myList, plusOrMinus];
    }

    service.showFlag = function() {
      return true;
    }

    service.hideFlag = function() {
      return false;
    }
  }
})();