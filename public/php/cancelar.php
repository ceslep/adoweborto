<?php
			header("Access-Control-Allow-Origin: *");
			header('Content-Type: application/json');
			require_once("datos_conexion.php");
			require("json_encode.php");
			require("json_decode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			
		
			$datos=json_decode(file_get_contents("php://input"));
			
			mysql_select_db($datos->database,$enlace);
	
			$sql="insert into canceladas select * from $datos->agenda";
			$sql.=" where ind=$datos->ind";
			
			
			
		
			$data=array();
			if(mysql_query($sql,$enlace)){
					$sql="delete from $datos->agenda where ind=$datos->ind";
					
					mysql_query($sql,$enlace);
					$data=array("Mensaje"=>"Ok","SQL"=>$sql);
			}
			else
					$data=array("Mensaje"=>"Error","Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			
			echo json_encode($data);
			
			mysql_close($enlace);
?>