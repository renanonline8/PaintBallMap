<?php
	header("Access-Control-Allow-Origin: *");
	include_once('db.php');
	$PlayerID = $_GET['PlayerID'];
	$query = mysqli_query($conn, "SELECT MapID from Matchs where PlayerID = $PlayerID");
	$data = array();
	while ($row = mysqli_fetch_object($query)){
		$data[] = $row;
		echo json_encode($data);
	}
	mysqli_close($conn);
?>