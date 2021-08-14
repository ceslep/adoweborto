<?php
			header("Access-Control-Allow-Origin: *");
			$database=$_REQUEST['database'];
			$tipo=$_REQUEST['tipo'];
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			
			
			mysql_select_db($database,$enlace);
			$sql="select * from causa_externa";
			
		
			
			$resultado=mysql_query($sql,$enlace);
			$datos=array();
			while($dato=mysql_fetch_assoc($resultado)) {
				$dato['nombre']=utf8_encode($dato['nombre']);
				$datos[]=$dato;
			}
				
			
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>