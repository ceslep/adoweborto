<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			require("json_decode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			
		
			$datos=json_decode(file_get_contents("php://input"));
			mysql_select_db($datos->database,$enlace);
	
			$sql="select * from urls";
			$sql.=" where paciente='$datos->paciente'";
			
			//$sql.=" where identificacion like '%$criterio%' or nombres like '%$criterio%' or historia like '%$criterio%'";
			
		
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) {
				
				$datos[]=$dato;
			}
			else
					$datos=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			if(count($datos)==0) $datos[]=array("onedrive"=>"","icloud"=>"");
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>