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
		//this.matchs();
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
		//app.getPosition();
		this.matchs();
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
		var mapID = this.mapID;
		this.mapID = localStorage.getItem("MapID");
		var wasDrawMap = this.wasDrawMap;
		app.sendPositionServer(playerID, lat, lng);
		/*var url = "http://paintballmap.azurewebsites.net/api/updatePosition.php?PlayerID="+playerID+"&latitude="+lat+"&longitude="+lng;
		var jqCurrentPosition = $.getJSON(url, function(data){});
		jqCurrentPosition.fail(function(){
			alert('Sem conexão com o servidor');
		});
		jqCurrentPosition.complete(function(data){
			console.log('Informação Enviada');
		});*/		        
		// initializes the map
        var myLocation = new google.maps.LatLng(lat, lng);
		map = new google.maps.Map(document.getElementById('map'), {
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			center: myLocation,
			zoom: 100
		});		
		var url = "http://paintballmap.azurewebsites.net/api/getMapMatch.php?PlayerID=" + playerID;
		var mapIDBD;
		var jqxhr = $.getJSON(url,function(result){
			$.each(result, function(key, field){
				mapIDBD = field.MapID;
			});
		});
		jqxhr.complete(function(){
			if (mapIDBD != this.mapID) {
				localStorage.setItem("MapID", mapIDBD);
				this.mapID = localStorage.getItem("MapID");
			}
			var hasMap = true;
			if (this.mapID == null){
				hasMap = false;
			}
			var url = "http://paintballmap.azurewebsites.net/api/getMapLatLng.php?MapID=" + this.mapID;
			var jqxhrHasMap = $.getJSON(url, function(data){
				return data;
			});
			jqxhrHasMap.complete(function(){
				if(jqxhrHasMap.responseText == '[]')
					hasMap = false;
				if (hasMap == true) {
					if (typeof(this.matchMap) == "undefined") {
						var matchMap = new app.onDrawMap(map, jqxhrHasMap.responseText);
					} else {
						//...
					}
				}
			});
		});	
		/*if (typeof(marker) == "undefined") {
			var marker = new google.maps.Marker({
				position: myLocation,
				map: map,
				title: 'Olá Mundo'
			});
			this.marker = marker;
		}*/
		if (typeof(this.marker) == "undefined") {
			var marker = new google.maps.Marker({
				position: myLocation,
				map: map,
				title: 'Meu Ponto'
			});
			this.marker = marker;
		} else {
			this.marker.setMap(null);
			var marker = new google.maps.Marker({
				position: myLocation,
				map: map,
				title: 'Meu Ponto'
			});
			this.marker = marker;
		}
		
		var otherMarkers
		google.maps.event.addListenerOnce(map, 'idle', function(){
			otherMarkers = new app.onCreateMarkers(map);
			$(document).on('click','#refreshPosition',function(){
				app.onClearMarkers(marker, otherMarkers.otherMarkers, map);
				app.getPosition();
				app.sendPosition();
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
		$(document).on('click','#exitMatch', app.onExitMatch);
	},
	onCreateMatchGET: function() {
		var idMapa = $('#id_map').val();
		var url = "http://paintballmap.azurewebsites.net/api/createMatch.php?nickname=" + $("#nickname").val() + "&idMap=" + idMapa;
		console.log(url);
		var jqCreateMatch = $.getJSON(url, function(data){});
		jqCreateMatch.fail(function(){
			$("#logCreateMatch").html(":o Servidor indisponível");
		});
		jqCreateMatch.complete(function(data){
			$.each(data, function(index, field){
				if (field.error == 0) {
					$("#logCreateMatch").html(":) Partida Criada");
					$('#new_id_partida').val(field.MatchID);
					localStorage.setItem("PlayerID", field.PlayerID);
					localStorage.setItem("MatchID", field.MatchID);
					localStorage.setItem("MapID", field.MapID);
					app.removePositionMemory();
					app.getPosition();
					app.sendPosition();
				} else {
					$("#logCreateMatch").html(":o Erro...Tente Novamente");
				}
			});
		});
	},
	onEnterMatch: function() {
		var linka = "http://paintballmap.azurewebsites.net/api/enterMatch.php?nickname2=" + $("#nickname2").val() + "&matchID=" + $("#matchID").val();
		console.log(linka);
		var jqEnterMatch = $.getJSON(linka, function(data) {
			console.log("success");
		});
		jqEnterMatch.fail(function(){
			app.onErrorMsg('3');
		});
		jqEnterMatch.complete(function(data){
			$.each(data, function(index, field){
				if (field.error == 0) {
					$("#logEnterMatch").html(":) Partida Valida");
					$('#new_id_partida').val(field.MatchID);
					localStorage.setItem("PlayerID", field.PlayerID);
					localStorage.setItem("MatchID", field.MatchID);
					localStorage.setItem("MapID", field.MapID);
					$.mobile.changePage("#map_page");
					app.removePositionMemory();
					app.getPosition();
					app.sendPosition();
				} else {
					app.onErrorMsg(field.error);
				}
			});
		});
	},
	onErrorMsg: function(codeError) {
		switch(codeError){
			case '1':
				$("#logEnterMatch").html(":o Erro...Tente Novamente");
				break;
			case '2':
				$("#logEnterMatch").html(":o Está partida não existe");
				break;
			case '3':
				$("#logEnterMatch").html(":o Servidor indisponível");
		}
		return false;
	},
	onCreateMarkers: function(obj) {
		var matchID = localStorage.getItem('MatchID');
		var playerID = localStorage.getItem('PlayerID');
		var url = "http://paintballmap.azurewebsites.net/api/getPosition.php?MatchId=" + matchID + "&PlayerID=" + playerID;
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
	},
	onDrawMap: function(map, points){
		//Definir LatLng dos poligonos, sentido horário
		var fieldAreaCoords = eval('(' + points + ')');
		$.each(fieldAreaCoords, function(index, val){
			val.lat = Number(val.lat);
			val.lng = Number(val.lng);
		});
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
	},
	onExitMatch: function() {
		$.mobile.changePage("#home");
		this.removePositionMemory()
	},
	onDefineDrawMap: function() {
		//Define se o mapa está criado
		localStorage.setItem("hasMap",1);
		console.log('You Create map');
	},
	onRemoveDrarMap: function() {
		//Tira o mapa da jogada
		localStorage.setItem("hasMap",0);
		console.log('You Destroy Map');
	},
	onHasMap: function() {
		//Checa o status do mapa
		var statusMap = String(localStorage.getItem("hasMap"));
		if (statusMap = '1') {
			console.log("Have Map");
			return true;
		} else {
			console.log("Don't have map");
			return false;
		}
	},
	sendPosition: function() {
		var watchId = navigator.geolocation.watchPosition(this.sendPositionSuccess,this.sendPositionError);
	},
	sendPositionSuccess: function(position) {
		actualLat = position.coords.latitude;
		actualLng = position.coords.longitude;
		oldLat = localStorage.getItem('playerLat');
		oldLng = localStorage.getItem('playerLng');
		if (actualLat != oldLat || actualLng != oldLng) {
			app.sendPositionServer(localStorage.getItem("PlayerID"), actualLat, actualLng);
			localStorage.setItem('playerLat', actualLat);
			localStorage.setItem('playerLng', actualLng);
			$('#lat').text(position.coords.latitude);
			$('#lng').text(position.coords.longitude);
		}
	},
	sendPositionError: function(error) {
		alert('code: ' + error.code + ' / message' + 'error.message');
	},
	removePositionMemory: function() {
		localStorage.setItem('playerLat', '0.00');
		localStorage.setItem('playerLng', '0.00');
	},
	sendPositionServer: function(playerID, playerLat, playerLng) {
		var url = "http://paintballmap.azurewebsites.net/api/updatePosition.php?PlayerID="+playerID+"&latitude="+playerLat+"&longitude="+playerLng;
		var jqInsCurrentPosition = $.getJSON(url, function(data){});
		jqInsCurrentPosition.fail(function(){
			alert('Sem conexão com o servidor');
		});
		jqInsCurrentPosition.complete(function(data){
			console.log('Informação Enviada');
		});	
	}
};
