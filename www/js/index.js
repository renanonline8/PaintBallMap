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
	matchs: function() {
		$(document).on('click','#btnNewMatch', this.onCreateMatchGET);
		$(document).on('click','.btnEnterMatch', app.onEnterMatch);
		$(document).on('click','#enterCreateMatch', app.onEnterCreateMatch);
	},
	onCreateMatchGET: function() {
		var idMapa = $('#id_map').val();
		var url = "http://paintballmap.azurewebsites.net/api/createMatch.php?nickname=" + $("#nickname").val() + "&idMap=" + idMapa;
		var jqCreateMatch = $.getJSON(url, function(data){});
		jqCreateMatch.fail(function(){
			$("#logCreateMatch").html(":o Servidor indisponível");
		});
		jqCreateMatch.complete(function(data){
			$.each(data, function(index, field){
				if (field.error == 0) {
					$("#logCreateMatch").html(":) Partida Criada");
					$('#new_id_partida').val(field.MatchID);
					$('#id_thisMatch').val(field.ThisMatchID);
					
					localStorage.setItem("PlayerID", field.PlayerID);
					localStorage.setItem("MatchID", field.MatchID);
					localStorage.setItem("MapID", field.MapID);
				} else {
					$("#logCreateMatch").html(":o Erro...Tente Novamente");
				}
			});
		});
	},
	onEnterCreateMatch: function() {
		app.removePositionMemory();
		app.onStartMatch();
	},
	onEnterMatch: function() {
		var linka = "http://paintballmap.azurewebsites.net/api/enterMatch.php?nickname2=" + $("#nickname2").val() + "&matchID=" + $("#matchID").val();
		var jqEnterMatch = $.getJSON(linka, function(data) {
			console.log("success");
			$.each(data, function(index, field){
				if (field.error == 0) {
					alert(field.ThisMatchID);
					$("#logEnterMatch").html(":) Partida Valida");
					$('#new_id_partida').val(field.MatchID);
					$('#id_thisMatchEnter').val(field.ThisMatchID);
					
					localStorage.setItem("PlayerID", field.PlayerID);
					localStorage.setItem("MatchID", field.MatchID);
					localStorage.setItem("MapID", field.MapID);
					
					
					app.removePositionMemory();
					app.onStartMatch();
				} else {
					app.onErrorMsg(field.error);
				}
			});
		});
		jqEnterMatch.fail(function(){
			app.onErrorMsg('3');
		});
		jqEnterMatch.complete(function(data){
			$.each(data, function(index, field){
				if (field.error == 0) {
					
					$("#logEnterMatch").html(":) Partida Valida");
					$('#new_id_partida').val(field.MatchID);
					$('#id_thisMatchEnter').val(field.ThisMatchID);
					
					localStorage.setItem("PlayerID", field.PlayerID);
					localStorage.setItem("MatchID", field.MatchID);
					localStorage.setItem("MapID", field.MapID);
					
					
					app.removePositionMemory();
					app.onStartMatch();
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
				break;
			case '4':
				$("#logEnterMatch").html(":o Partida está lotada");
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
	sendPosition: function() {
		watchId = navigator.geolocation.watchPosition(this.sendPositionSuccess,this.sendPositionError);
	},
	sendPositionSuccess: function(position) {
		
		actualLat = position.coords.latitude;
		actualLng = position.coords.longitude;
		oldLat = localStorage.getItem('playerLat');
		oldLng = localStorage.getItem('playerLng');
		console.log('vivo latActual: ' + actualLat + ' actualLng: ' + actualLng + ' / oldLat: ' + oldLat + ' oldLng: ' + oldLng);
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
	},
	onStartMatch: function(){
		//Pegar posição
		$.mobile.changePage("#map_page");
					
		$(document).on('pageshow','#map_page',function(){
			openTab('tabmap_map');
			var watchId = null;
			app.sendPosition();
		
			navigator.geolocation.getCurrentPosition(function(position){
				//Pegar posição lat e lng
				var playerLat = position.coords.latitude;
				var playerLng = position.coords.longitude;
				var playerID = localStorage.getItem("PlayerID");
				var markers = [];
				app.sendPositionServer(playerID, playerLat, playerLng);
				console.log(watchId);
				//Criar mapa
				var myLocation = new google.maps.LatLng(playerLat, playerLng);
				map = new google.maps.Map(document.getElementById('map'), {
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					center: myLocation,
					zoom: 50
				});
				
				google.maps.event.addListenerOnce(map, 'idle', function(){
					var matchMap = null;
					app.onCreateMap(map, playerID, matchMap);
					var playersMarkers = [];
					app.onDrawPlayers(localStorage.getItem('MatchID'), playersMarkers, map);
					//Colocar jogadores na aba log
					app.onGetPlayers(localStorage.getItem('MatchID'),4,'#div_players');
					//Ao clicar em eliminado
					$(document).on('click', '#exitMatch', function(){
						app.onExitMatch(playerID);
					});
					//Atualiza posição
					$(document).on('click','#refreshPosition', function(){
						app.removeAllMarkers(map, playersMarkers);
						playersMarkers = [];
						navigator.geolocation.getCurrentPosition(function(position){
							var playerLat = position.coords.latitude;
							var playerLng = position.coords.longitude;
							var playerID = localStorage.getItem("PlayerID");
							var myLocation = new google.maps.LatLng(playerLat, playerLng);
							app.sendPositionServer(playerID, playerLat, playerLng);
							app.onDrawPlayers(localStorage.getItem('MatchID'), playersMarkers, map);
							app.onGetPlayers(localStorage.getItem('MatchID'),4,'#div_players');
						}, function(error){
							alert("Deu erro!" + error.code);	
						});
					});
				});
			}, function(error){
				alert("Deu erro!" + error.code);
			});
		});
	},
	onCreateMap: function(map, playerID, matchMap){
		//Desenhar limite do mapa
		var url = "http://paintballmap.azurewebsites.net/api/getMapMatch.php?PlayerID=" + playerID;
		var mapIDBD;
		var jqxhr = $.getJSON(url,function(result){
			$.each(result, function(key, field){
				mapIDBD = field.MapID;
			});
		});
		jqxhr.complete(function(){
			var mapID = localStorage.getItem("MapID");
			if (mapIDBD != mapID) {
				localStorage.setItem("MapID", mapIDBD);
				mapID = localStorage.getItem("MapID");
			}
			var hasMap = true;
			if (mapID == null){
				hasMap = false;
			}
			var url = "http://paintballmap.azurewebsites.net/api/getMapLatLng.php?MapID=" + mapID;
			var jqxhrHasMap = $.getJSON(url, function(data){
				return data;
			});
			jqxhrHasMap.complete(function(){
				if(jqxhrHasMap.responseText == '[]')
					hasMap = false;
				if (hasMap == true) {
					matchMap = new app.onDrawMap(map, jqxhrHasMap.responseText);
				}
			});
		});
	},
	onCreateMyMarker: function(map, myLocation, markers){
		var marker = new google.maps.Marker({
			position: myLocation,
			map: map,
			title: 'Meu Ponto'
		});
		markers.push(marker);
	},
	onOthersMarkersMatch: function(map, markers){
		google.maps.event.addListenerOnce(map, 'idle', function(map){
			var matchID = localStorage.getItem('MatchID');
			var playerID = localStorage.getItem('PlayerID');
			var url = "http://paintballmap.azurewebsites.net/api/getPosition.php?MatchId=" + matchID + "&PlayerID=" + playerID;
			$.getJSON(url,function(result){
				$.each(result, function(i, field) {
					var otherP = field.PlayerID;
					var otherPnick = field.Nickname;
					var otherPlat = field.Latitude;
					var otherPlon = field.Longitude;
					var otherMark = new google.maps.Marker({
						position: {lat:Number(otherPlat), lng:Number(otherPlon)},
						map: map,
						icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'				
					});
					markers.push(otherMark);
				});
			});
		});
	},
	removeAllMarkers: function(map, markers){
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
	},
	onGetPlayers: function(matchId, playersPerColumn, placeInfo){
		//Apagar div_players atual
		var div = $(placeInfo);
		div.empty();
		
		//Obter Jogadores no banco via Ajax
		var url = 'http://paintballmap.azurewebsites.net/api/getPlayers.php?MatchId='+matchId;
		
		$.getJSON(url,function(result) {
			//Desenhar lista de jogadores
			var nRegColumn = 1;
			div.append('<div class="w3-col s6">');
			$.each(result,function(i,field){
				console.log('registro');
				div.append('<p id=player_' + field.ThisMatchID + ' class="player">' + field.ThisMatchID + ' - ' + field.Nickname + '</p');
				nRegColumn++;
				if(nRegColumn > playersPerColumn) {
					nRegColumn = 1;
					div.append('</div><div class="w3-col s6">');
				}
			});
			
		});
	},
	onExitMatch: function(playerID){
		//Apagar do banco
		var url = 'http://paintballmap.azurewebsites.net/api/exitMatch.php?PlayerId='+playerID;
		$.ajax({
			url : url,
			type: 'GET',
			success: function(){
				localStorage.setItem('MapID','');
				localStorage.setItem('MatchID','');
				localStorage.setItem('PlayerID','');
				localStorage.setItem('PlayerLat','');
				localStorage.setItem('PlayerLng','');
				map = null;
				matchMap = null;	
				navigator.geolocation.clearWatch(watchId);
				$.mobile.changePage("#home");
				console.log('eliminado');
			}
		});
	},
	onDrawPlayers: function(matchId, playersMarkers, map){
		var url = 'http://paintballmap.azurewebsites.net/api/getPositionPlayers.php?MatchId=' + matchId;
		$.getJSON(url, function(result){
			$.each(result,function(i, field){
				var location = {lat: Number(field.Latitude), lng: Number(field.Longitude)};
				var playerMarker = new google.maps.Marker({
					position: location,
					label: field.ThisMatchID,
					map: map
				});
				playersMarkers.push(playerMarker);
			});
		});
	}
};
