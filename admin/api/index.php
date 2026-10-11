<?php
date_default_timezone_set("Asia/Kolkata");

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

 $con=mysqli_connect("localhost","root","","food_backend");

// $con = mysqli_connect("localhost","u907727509_ITSfoodMult","ITSfoodMult@zb1db","u907727509_ITSfoodMult");

if(mysqli_connect_errno()) {
    echo json_encode([
        "status" => false,
        "message" => "Database connection failed"
    ]);
    die();
}

$type = $_POST['type']?? '';
if($type == "")

?>