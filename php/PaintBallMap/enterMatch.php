<?php
	header("Access-Control-Allow-Origin: *");
	include_once('db.php');
	
	$PlayerID = mysqli_fetch_array(mysqli_query($conn, 'SELECT MAX(PlayerID) AS lastPlayerID FROM Matchs'));
	$PlayerID = $PlayerID['lastPlayerID'];
	if ($PlayerID == ''){
		$PlayerID = 1;
	} else
		$PlayerID = (int)$PlayerID + 1;
		
	$MatchID = $_GET['matchID'];
	$matchs = mysqli_fetch_array(mysqli_query($conn, "SELECT MatchID, MAX(MapID) Map_ID FROM Matchs WHERE MatchID = $MatchID"));
	$hasMatch = $matchs['MatchID'];
	$map_id = $matchs['Map_ID'];
	
	if ($hasMatch <> '') {
		$nickname = $_GET['nickname2'];
	
		if (mysqli_query($conn, "INSERT INTO Matchs VALUES ('$PlayerID', '$MatchID', '$nickname', null, null, '$map_id')")) {
			$array = array("error" => "0", "PlayerID" => $PlayerID, "MatchID" => $MatchID, "MapID" => $map_id);
			echo json_encode($array);
		} else {
			$array = array("error" => "1");
			echo json_encode($array);
		}
	} else {
		$array = array("error" => "2");
		echo json_encode($array);
	}
	
	mysqli_close($conn);
?>