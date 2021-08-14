<?php 
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
	
	
$fileList = glob("*.*", GLOB_BRACE);
	$mythumb = new thumb();
	foreach($fileList as $filename){
	if(is_file($filename)&&($filename[0]!="t")){
	$filename2="t".$filename;
	if (!file_exists($filename2)){
     $mythumb->loadImage($filename);
	 $mythumb->resize(200, 'width');
	 $mythumb->save($filename2,70);
	}
    }
	}
$files=array();
$fileList = glob("t*.{jpg,png,gif,jpeg,JPG,PNG,GIF,JPEG}", GLOB_BRACE);

	foreach($fileList as $filename){
	if(is_file($filename)){
         $files[]=array("directory"=>$path,"imageFile"=>$filename,"img64"=>imgto64($path,$filename),"imageFileFull"=>substr($filename,1));
    }
	}
echo json_encode($files);
?>