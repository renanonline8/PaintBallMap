<?php
	header("Access-Control-Allow-Origin: *");
	include_once('db.php');
	
	$PlayerId = $_GET['PlayerId'];
	
	$query = mysqli_query($conn, "DELETE FROM matchs WHERE PlayerID='$PlayerId'");
	echo('removido');
	
	mysqli_close($conn);
?>