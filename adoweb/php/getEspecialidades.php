<?php
			header("Access-Control-Allow-Origin: *");
			header('Content-Type: application/json');
			require_once("datos_conexion.php");
			require("json_encode.php");
			require("json_decode.php");
			$datos=json_decode(file_get_contents("php://input"));
			$enlace =  mysql_connect($host, $user, $pass);
			
			
			mysql_select_db($datos->database,$enlace);
			$sql="select * from especialidades where activa='S'";
			
		
			
			$resultado=mysql_query($sql,$enlace);
			$datos=array();
			while($dato=mysql_fetch_assoc($resultado)) {
				
				$dato['nombre']=utf8_encode($dato['nombre']);
				$dato['descripcion']=utf8_encode($dato['descripcion']);
				$datos[]=$dato;
				
			}
			
			echo json_encode($datos);
			mysql_close($enlace);
?>