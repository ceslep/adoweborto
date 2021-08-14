<?php
			require("headers.php");
			require_once("datos_conexion.php");
			$enlace =  mysql_connect($host, $user, $pass);
			require("json_encode.php");
			require("json_decode.php");
			
            $datos=json_decode(file_get_contents("php://input"));
			
			mysql_select_db($datos->database,$enlace);
		
			$sql="select historia,identificacion,nombres,estado_paciente from total_pacientes ";
			$sql.=" where (historia like '%$datos->criterio%') or (identificacion like '%$datos->criterio%') or (nombres like '%$datos->criterio%')";
			$sql.=" order by historia";
			
			
			
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) {
				
				$dato['nombres']=utf8_encode($dato['nombres']);
				$datos[]=$dato;
				
			}
			else
				$datos[]=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>