<?php 
	header("Access-Control-Allow-Origin: *");
	setlocale(LC_ALL, "es_CO.UTF-8");
	require("json_encode.php");
	require("json_decode.php");
	$datos=json_decode(file_get_contents("php://input"));
	$path=utf8_decode($datos->dir);
	$dir=utf8_decode($datos->directory);
	$d3=utf8_decode($datos->d3);

	chdir($path);
	chdir($dir);
	chdir($d3);
	$path=getcwd();
	$path=utf8_encode($path);
	
	

$files=array();
$fileList = glob("*.*",GLOB_NOSORT );


	foreach($fileList as $filename){
	if(is_file($filename)){
         $files[]=array("directory"=>$path,"imageFile"=>$filename);
    }
	}
echo json_encode($files);
?>