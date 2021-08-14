<?php
			require("headers.php");
			require_once("datos_conexion.php");
			$enlace =  mysql_connect($host, $user, $pass);
			mysql_select_db($database,$enlace);
			require("json_encode.php");
			require("json_decode.php");
			$identificacion=$_REQUEST['identificacion'];
			$nombres=$_REQUEST["nombres"];
			$firma=$_REQUEST['firma'];
            
			
			
		
			$sql="insert into consentimientos (identificacion,firma,fecha) values ('$identificacion','$firma',now())";
			
			
			
			
			$datos=array();
			if(mysql_query($sql,$enlace))
			$datos[]=array("Mensaje"=>"Correcto","SQL"=>$sql);
		else
			
				$datos[]=array("Mensaje"=>mysql_error($enlace),"SQL"=>$sql);
			
			echo json_encode($datos);
			
			mysql_close($enlace);
?>