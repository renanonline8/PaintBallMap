<?php
	header("Access-Control-Allow-Origin: *");
	include_once('db.php');
	
	$PlayerID = $_GET['PlayerID'];
	$latitude = $_GET['latitude'];
	$longitude = $_GET['longitude'];
	
	if (mysqli_query($conn, "UPDATE Matchs SET latitude = $latitude, longitude = $longitude WHERE PlayerID = $PlayerID")) {
		$array = array("stillAlive" => 1);
		echo json_encode($array);
	} else {
		$array = array("stillAlive" => 0);
		echo json_encode($array);
	}
	
	mysqli_close($conn);
		
?>