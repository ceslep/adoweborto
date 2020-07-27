<?php
			header("Access-Control-Allow-Origin: *");
			header('Content-Type: application/json');
			require_once("datos_conexion.php");
			require("json_encode.php");
			require("json_decode.php");
			$datos=json_decode(file_get_contents("php://input"));
			$enlace =  mysql_connect($host, $user, $pass);
			
			
			mysql_select_db($datos->database,$enlace);
			$sql="select telefono_residencia1,telefono_residencia2,telefono_movil,email1,email2,direccion_residencia,";
			$sql.=" concat_ws(' ',municipios.nombre,municipios.departamento) as ciudad_residencia,barrio";
			$sql.=" from paciente ";
			$sql.=" inner join municipios on paciente.ciudad_residencia=municipios.codigo";
			$sql.=" where historia='$datos->paciente'";
			
			
		
			
			$resultado=mysql_query($sql,$enlace);
			$datos=array();
			while($dato=mysql_fetch_assoc($resultado)) {
				
			
				$datos[]=$dato;
				
			}
			
			echo json_encode($datos);
			mysql_close($enlace);
?>