<?php
			header("Access-Control-Allow-Origin: *");
			header('Content-Type: application/json');
			require_once("datos_conexion.php");
			$enlace =  mysql_connect($host, $user, $pass);
			require("json_encode.php");
			require("json_decode.php");
			
            $datos=json_decode(file_get_contents("php://input"));
			
			mysql_select_db($datos->database,$enlace);
		
			$sql="update paciente set auxiliar2='$datos->map'";
			$sql.=" where historia='$datos->historia'";
			
		    
			
			$datos=array();
			if(mysql_query($sql,$enlace))
			
			
				
				$datos[]=array("Mensaje"=>"Map Actualizado");
			
			else
					$datos[]=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			
			echo json_encode($datos);
			mysql_close($enlace);
?>