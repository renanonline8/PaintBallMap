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
		this.matchs();
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
				
		var options = {
    		timeout: 30000
		};
		navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError, options);
		
    },
    // successfully determined position
    onSuccess: function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
		var playerID = localStorage.getItem("PlayerID");
		var url = "http://192.168.0.14:3310/paintballmap/updatePosition.php?PlayerID="+playerID+"&latitude="+lat+"&longitude="+lng;
		console.log(url);
		var positionHttp = new XMLHttpRequest();
		positionHttp.open("GET",url,false);
		positionHttp.send(null);
		        
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
		
		google.maps.event.addListenerOnce(map, 'idle', function(){
			app.onCreateMarkers(map);
		});
		
		/*var text = '{"getLocalization":[' +
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
		});*/
		
    },
    // unsuccessfully determined position
    onError: function (error) {
        alert(error.message);
    },
	matchs: function() {
		$(document).on('click','#btnNewMatch', this.onCreateMatchGET);
		$(document).on('click','.btnEnterMatch', this.onEnterMatch);
	},
	onCreateMatchGET: function() {
		var xmlhttp	= new XMLHttpRequest();
		xmlhttp.open("GET","http://192.168.0.14:3310/paintballmap/createMatch.php?nickname=" + $("#nickname").val(),false);
		xmlhttp.send(null);
		var result = $.parseJSON(xmlhttp.responseText);
		if (result.error == 0) {
			$("#logCreateMatch").html(":) Partida Criada");
			$('#new_id_partida').val(result.MatchID);
			localStorage.setItem("PlayerID", result.PlayerID);
			localStorage.setItem("MatchID", result.MatchID);
		} else {
			$("#logCreateMatch").html(":o Erro...Tente Novamente");
		}
	},
	onEnterMatch: function() {
		var xmlhttp2 = new XMLHttpRequest();
		var linka = "http://192.168.0.14:3310/paintballmap/enterMatch.php?nickname2=" + $("#nickname2").val() + "?matchID=" + $("#matchID").val();
		xmlhttp2.open("GET","http://192.168.0.14:3310/paintballmap/enterMatch.php?nickname2=" + $("#nickname2").val() + "&matchID=" + $("#matchID").val(), false);
		xmlhttp2.send(null);
		var result2 = $.parseJSON(xmlhttp2.responseText);
		if (result2.error == 0) {
			$("#logEnterMatch").html(":) Partida Valida");
			$('#new_id_partida').val(result2.MatchID);
			localStorage.setItem("PlayerID", result2.PlayerID);
			localStorage.setItem("MatchID", result2	.MatchID);
			$.mobile.changePage("#map_page");
		} else {
			app.onErrorMsg(result2.error);
		}
	},
	onErrorMsg: function(codeError) {
		switch(codeError){
			case '1':
				$("#logEnterMatch").html(":o Erro...Tente Novamente");
				break;
			case '2':
				console.log(codeError);
				$("#logEnterMatch").html(":o Está partida não existe");
				break;
		}
		return false;
	},
	onCreateMarkers: function(obj) {
		var matchID = localStorage.getItem('MatchID');
		var playerID = localStorage.getItem('PlayerID');
		var url = "http://192.168.0.14:3310/paintballmap/getPosition.php?MatchId=" + matchID + "&PlayerID=" + playerID;
		console.log(url + ", " + playerID + ", " + matchID);
		$.getJSON(url,function(result){
			console.log(result);	
			$.each(result, function(i, field) {
				var otherP = field.PlayerID;
				var otherPnick = field.Nickname;
				var otherPlat = field.Latitude;
				var otherPlon = field.Longitude;
				console.log("Player ID: " + otherP + ", Nick:" + otherPnick + ", Lat: " + otherPlat + ", Lon: " + otherPlon);
				var otherMark = new google.maps.Marker({
					position: {lat:Number(otherPlat), lng:Number(otherPlon)},
					map: obj,
					icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'				
				});
			});
		});
	}
};
