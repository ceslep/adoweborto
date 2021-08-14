<?php 
	header("Access-Control-Allow-Origin: *");
	setlocale(LC_ALL, "es_CO.UTF-8");
	require("json_encode.php");
	require("json_decode.php");
	$datos=json_decode(file_get_contents("php://input"));
	$path=utf8_decode($datos->dir);
	$dir=utf8_decode($datos->directory);


	/*$historia=$_GET["historia"];
	$path=sprintf("z:/Pacientes Moya Ortodoncia/*%s*",$historia);
	$dir=utf8_decode($_GET["dir"]);*/
	
	
	chdir($path);
	chdir($dir);
	$path=getcwd();
	
	$dir = new DirectoryIterator($path);
	
$files=array();
foreach ($dir as $fileinfo) {
    if ($fileinfo->isDir() && !$fileinfo->isDot()) {
		$files[]=array("atime"=>$fileinfo->getATime(),"mtime"=>$fileinfo->getMTime(),"directory"=>utf8_encode($fileinfo->getFilename()));
        //echo $fileinfo->getFilename().'<br>';
    }
}
echo json_encode($files);
	/*
	$fileList = glob($path);
	foreach($fileList as $filename){
	if(is_file($filename)){
        echo $filename, '<br>'; 
    } 
}*/

?>