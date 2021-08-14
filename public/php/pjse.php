<?php
		require_once("json_decode.php");
		require_once("json_encode.php");
		
		$datos=json_decode($_POST['data']);
		echo $datos;
?>