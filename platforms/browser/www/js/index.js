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
		app.getPosition();
		//$(document).on('click','#refreshPosition',app.onClearMarkers(a.marker, otherMarkers, map));
		
    },
	getPosition: function() {
		this.teste = 'teste';
		var options = {
    		timeout: 30000
		};
		navigator.geolocation.getCurrentPosition(app.onSuccess, app.onError, options);
	},
    // successfully determined position
    onSuccess: function (position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
		var playerID = localStorage.getItem("PlayerID");
		var url = "http://192.168.0.14:3310/paintballmap/updatePosition.php?PlayerID="+playerID+"&latitude="+lat+"&longitude="+lng;
		var positionHttp = new XMLHttpRequest();
		positionHttp.open("GET",url,false);
		positionHttp.send(null);
		        
		// initializes the map
        var myLocation = new google.maps.LatLng(lat, lng);
		
		map = new google.maps.Map(document.getElementById('map'), {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: myLocation,
			zoom: 100
		});
		
		//Definir LatLng dos poligonos, sentido hor
		ário
		var fieldAreaCoords = [
			{lat: -23.670067, lng: -46.489367},
			{lat: -23.669970, lng: -46.490266},
			{lat: -23.669589, lng: -46.490875},
			{lat: -23.670049, lng: -46.491231},
			{lat: -23.670609, lng: -46.490448},
			{lat: -23.670619, lng: -46.489440}
		];
			
		//Desenhar polígono
		var fieldArea = new google.maps.Polygon({
			paths: fieldAreaCoords,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35
		});
		fieldArea.setMap(map);	
		
		if (typeof(marker) == "undefined") {
			var marker = new google.maps.Marker({
				position: myLocation,
				map: map,
				title: 'Olá Mundo'
			});
			
		}
		
		var otherMarkers
		google.maps.event.addListenerOnce(map, 'idle', function(){
			otherMarkers = new app.onCreateMarkers(map);
			$(document).on('click','#refreshPosition',function(){
				app.onClearMarkers(marker, otherMarkers.otherMarkers, map);
				app.getPosition();
			});
		});
		
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
				$("#logEnterMatch").html(":o Está partida não existe");
				break;
		}
		return false;
	},
	onCreateMarkers: function(obj) {
		var matchID = localStorage.getItem('MatchID');
		var playerID = localStorage.getItem('PlayerID');
		var url = "http://192.168.0.14:3310/paintballmap/getPosition.php?MatchId=" + matchID + "&PlayerID=" + playerID;
		var otherMarkers = []
		$.getJSON(url,function(result){
			$.each(result, function(i, field) {
				var otherP = field.PlayerID;
				var otherPnick = field.Nickname;
				var otherPlat = field.Latitude;
				var otherPlon = field.Longitude;
				var otherMark = new google.maps.Marker({
					position: {lat:Number(otherPlat), lng:Number(otherPlon)},
					map: obj,
					icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'				
				});
				otherMarkers.push(otherMark);
			});
		});
		this.otherMarkers = otherMarkers;
	},
	onClearMarkers: function(playerMarker, otherMarkers, map) {
		var playerMarker = playerMarker;
		var otherMarkers = otherMarkers;
		playerMarker.setMap(null);
		for (var i = 0; i < otherMarkers.length; i++){
			otherMarkers[i].setMap(null);
		}
		playerMarker = null;
		otherMarkers = [];
	}
};
