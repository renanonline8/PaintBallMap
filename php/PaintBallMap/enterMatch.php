<?php
	//GET matchID, nickname
	header("Access-Control-Allow-Origin: *");
	include_once('db.php');
	
	$MatchID = $_GET['matchID'];
	$InfoID = mysqli_fetch_array(mysqli_query($conn, "SELECT MAX(PlayerID) AS lastPlayerID, (SELECT MAX(ThisMatchID) FROM matchs WHERE MatchID = $MatchID) as lastThisMatchID,
	                                                    (SELECT value FROM adm_config WHERE config = 'player_max') as maxPlayers,
														(SELECT COUNT(MatchID) FROM matchs WHERE MatchID = $MatchID) as qtdePlayers FROM matchs"));
	$PlayerID = $InfoID['lastPlayerID'];
	
	if ($PlayerID == ''){
		$PlayerID = 1;
	} else
		$PlayerID = (int)$PlayerID + 1;
	
	// Obter ID da partida atual
	$ThisMatchID = $InfoID['lastThisMatchID'];
	if ($ThisMatchID == ''){
		$ThisMatchID = 1;
	} else {
		$ThisMatchID = (int)$ThisMatchID + 1;
	}
		
	//Obter o numero máximo de jogadores permitido e a quantidade atual
	$maxPlayers = (int)$InfoID['maxPlayers'];
	$qtdePlayers = (int)$InfoID['qtdePlayers'];
	
	//Verificar se tem mapa para a partida
	$matchs = mysqli_fetch_array(mysqli_query($conn, "SELECT MatchID, MAX(MapID) Map_ID FROM Matchs WHERE MatchID = $MatchID"));
	$hasMatch = $matchs['MatchID'];
	$map_id = $matchs['Map_ID'];
	
	//Se a quantidade de jogadores for maior que a permitida, não permitir entrar na partida
	if ($qtdePlayers < $maxPlayers) {
		if ($hasMatch <> '') {
			$nickname = $_GET['nickname2'];
		
			if (mysqli_query($conn, "INSERT INTO Matchs VALUES ('$PlayerID', '$MatchID', '$nickname', null, null, '$map_id', '$ThisMatchID')")) {
				$array = array("error" => "0", "PlayerID" => $PlayerID, "MatchID" => $MatchID, "MapID" => $map_id, "ThisMatchID" => $ThisMatchID);
				echo json_encode($array);
			} else {
				$array = array("error" => "1");
				echo json_encode($array);
			}
		} else {
			$array = array("error" => "2");
			echo json_encode($array);
		}
	} else {
		$array = array("error" => "4");
		echo json_encode($array);
	}
	
	mysqli_close($conn);
?>