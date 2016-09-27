<?php
	header("Access-Control-Allow-Origin: *");
	include_once('db.php');
	
	$MatchId = $_GET['MatchId'];
	$PlayerID = $_GET['PlayerID'];
	$query = mysqli_query($conn, "SELECT * FROM Matchs WHERE MatchID = $MatchId AND PlayerID <> $PlayerID");
	$data = array();
	
	while ($row = mysqli_fetch_object($query)) {
		$data[] = $row;	
	}
	echo json_encode($data);
	
	mysqli_close($conn);
?>