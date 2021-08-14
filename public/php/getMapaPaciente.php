<?php
			header("Access-Control-Allow-Origin: *");
			header('Content-Type: application/json');
			require_once("datos_conexion.php");
			$enlace =  mysql_connect($host, $user, $pass);
			require("json_encode.php");
			require("json_decode.php");
			
            $datos=json_decode(file_get_contents("php://input"));
			
			mysql_select_db($datos->database,$enlace);
		
			$sql="select auxiliar2,nombresp from paciente";
			$sql.=" inner join hoja_vida on paciente.auxiliar2=hoja_vida.identificacion";
			$sql.=" where historia='$datos->historia'";
			
		    
			
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) 	{
				$dato['nombresp']=utf8_encode($dato['nombresp']);
				$datos[]=$dato;
			}
			else
					$datos[]=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			
			echo json_encode($datos);
			mysql_close($enlace);
?>