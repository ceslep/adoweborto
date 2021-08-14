<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			require("json_decode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			
		
			$datos=json_decode(file_get_contents("php://input"));
			mysql_select_db($datos->database,$enlace);
	
			$sql="update $datos->agenda set confirmado_por='$datos->quien',qconf='$datos->usuario',info_confirmacion='$datos->info'";
			$sql.=" where ind='$datos->ind'";
			
			//$sql.=" where identificacion like '%$criterio%' or nombres like '%$criterio%' or historia like '%$criterio%'";
			
		
			$datos=array();
			if(mysql_query($sql,$enlace))
					$datos=array("Mensaje"=>"Actualizado","SQL"=>$sql);
			
			else
					$datos=array("Mensaje"=>"Error","Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			
			echo json_encode($datos);
			
			mysql_close($enlace);
?>