<?php
	//GET nickname, map_ID
	header("Access-Control-Allow-Origin: *");
	include_once('db.php');

	$PlayerID = mysqli_fetch_array(mysqli_query($conn, 'SELECT MAX(PlayerID) AS lastPlayerID FROM Matchs'));
	$PlayerID = $PlayerID['lastPlayerID'];
	if ($PlayerID == ''){
		$PlayerID = 1;
	}else
		$PlayerID = (int)$PlayerID + 1;
	
	$MatchID  = mysqli_fetch_array(mysqli_query($conn, 'SELECT MAX(MatchID) AS lastMatchID FROM Matchs'));
	$MatchID = $MatchID['lastMatchID'];
	if ($MatchID == '')
		$MatchID = 1;
	else
		$MatchID = (int)$MatchID + 1;
	
	$nickname = $_GET['nickname'];
	$map_ID = $_GET['idMap'];
	
	if (mysqli_query($conn, "INSERT INTO Matchs VALUES ('$PlayerID', '$MatchID', '$nickname', null, null, '$map_ID', 1)")) {
		$array = array("error" => "0", "PlayerID" => $PlayerID, "MatchID" => $MatchID, "MapID" => $map_ID, "ThisMatchID" => '1');
		echo json_encode($array);
	} else {
		$array = array("error" => "1");
		echo json_encode($array);
	}
	mysqli_close($conn);
?>
