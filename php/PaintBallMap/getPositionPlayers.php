<?php
	header("Access-Control-Allow-Origin: *");
	include_once('db.php');
	
	$MatchId = $_GET['MatchId'];
	$query = mysqli_query($conn, "SELECT PlayerID, Latitude, Longitude, ThisMatchID FROM Matchs WHERE MatchID = $MatchId");
	$data = array();
	
	while ($row = mysqli_fetch_object($query)) {
		$data[] = $row;	
	}
	echo json_encode($data);
	
	mysqli_close($conn);
?>