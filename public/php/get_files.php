<?php 
	header("Access-Control-Allow-Origin: *");
	/*$fileList = glob('z:/Pacientes Moya Ortodoncia');
	foreach($fileList as $filename){
	if(is_file($filename)){
        echo $filename, '<br>'; 
    }   
}*/
require("json_encode.php");
setlocale(LC_ALL, "es_CO.UTF-8");
$historia=$_GET["historia"];
$path=sprintf("z:/Pacientes Moya Ortodoncia/*%s*",$historia);
$dir = new DirectoryIterator($path);
$files=array();

foreach ($dir as $fileinfo) {
	
    if ($fileinfo->isDir() && !$fileinfo->isDot()) {
		$files[]=array("dir"=>utf8_encode($fileinfo->getPath()),"directory"=>utf8_encode($fileinfo->getFilename()));
        //echo $fileinfo->getFilename().'<br>';
    }
}
echo json_encode($files);
?>