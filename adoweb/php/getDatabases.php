<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			
			
			//mysql_select_db($database,$enlace);
			//$sql="SELECT SCHEMA_NAME AS `database` FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME LIKE '%ado%'";
			$sql="SHOW DATABASES like '%ado%'";
			
		
			
			$resultado=mysql_query($sql,$enlace);
			$datos=array();
			while($dato=mysql_fetch_assoc($resultado)) {
				
				
				$datos[]=$dato;
				
			}
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>