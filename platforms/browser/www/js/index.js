/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/
var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
		
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {
        // create jqxtabs.
        $('#jqxTabs').jqxTabs({ width: 350, height: 350 });
		
		var options = {
    		timeout: 30000
		};
		var watchPos = navigator.geolocation.watchPosition(this.onSuccess, this.onError, options);
		
    },
    // successfully determined position
    onSuccess: function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        $("#latitude").text(lat);
        $("#longitude").text(lng);
        // initializes the map
        var myLocation = new google.maps.LatLng(lat, lng);
		
		if (typeof(map) == "undefined") {
			var map = new google.maps.Map(document.getElementById('map'), {
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				center: myLocation,
				zoom: 100
			});
		}
		
		if (typeof(marker) == "undefined") {
			var marker = new google.maps.Marker({
				position: myLocation,
				map: map,
				title: 'Olá Mundo'
			});
		}
		
		marker.setPosition(myLocation);
		
		var text = '{"getLocalization":[' +
		'{"userID":"1","latitude":"-23.670069","longitude":"-46.490409"},' +
		'{"userID":"2","latitude":"-23.670075","longitude":"-46.490412"}]}';
		
		obj = JSON.parse(text);
		$.each(obj, function(name, value){
			$.each(this, function (index, value) {
				var otherMarker = [];
				otherMarker[index] = new google.maps.Marker({
					position: {lat:Number(this.latitude), lng:Number(this.longitude)},
					map: map,
					icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
				});
   			});
		});
		
    },
    // unsuccessfully determined position
    onError: function (error) {
        alert(error.message);
    },
};
