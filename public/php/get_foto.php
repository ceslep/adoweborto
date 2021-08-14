<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$database=$_REQUEST['database'];
			$paciente=$_REQUEST['paciente'];	
			mysql_select_db($database,$enlace);
		//	mysql_query("SET CHARACTER SET utf8 ",$enlace);
			$sql="select historia,nombres,foto from paciente";
			$sql.=" where historia='$paciente'";
			
		    
			
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) {
				if ($dato['foto']!=NULL)
				
				$dato['foto']='data:image/jpg;base64,'.base64_encode($dato['foto']);
				$datos[]=$dato;
			}
			else
					$datos[]=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>