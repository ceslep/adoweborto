<?php
	require("headers.php");
	include_once('thumb.php');
	
	function imgto64($path,$img){
		//$imgpath   = $path.'\\'.$img;
		$imgpath   = $img;
		$imginfo   = getimagesize($imgpath);
		$mimetype  = $imginfo['mime'];
		$imageData = base64_encode(file_get_contents($imgpath));

		$src = 'data:' . $mimetype . ';base64,' . $imageData;
		return $src;
	}
	
	setlocale(LC_ALL, "es_CO.UTF-8");
	require("json_encode.php");
	require("json_decode.php");
	$datos=json_decode(file_get_contents("php://input"));
	$path=utf8_decode($datos->dir);
	$dir=utf8_decode($datos->directory);
	$d3=utf8_decode($datos->d3);
	$filename=utf8_decode($datos->imageFile);
	header('Content-Length: '.$length);

	chdir($path);
	chdir($dir);
	chdir($d3);
	$path=getcwd();
	$path=utf8_encode($path);
	
	
	$files=array();
	//echo $filename;
	if(is_file($filename)){
         $files[]=array("directory"=>$path,"imageFile"=>$filename,"img64"=>imgto64($path,$filename));
    }
	$files=json_encode($files);
header('Content-Length: '.strlen($files));	
echo $files;
?>