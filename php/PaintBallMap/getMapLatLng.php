<?php
header("Access-Control-Allow-Origin: *");
include_once("db.php");

$MapID = $_GET['MapID'];
$query = mysqli_query($conn, "SELECT LatVal as lat, LngVal as lng FROM mapLatLng WHERE MapID = $MapID ORDER BY orderPos ASC");
$data = array();
while ($row = mysqli_fetch_object($query)) {
	$data[] = $row;	
}
echo json_encode($data);
mysqli_close($conn);
?>