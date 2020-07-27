<?php
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$database=$_REQUEST['database'];
		    $tipo=$_REQUEST['tipo'];
			mysql_select_db($database,$enlace);
			//mysql_query("SET CHARACTER SET utf8 ",$enlace);
			$sql="select codigo,nombre,duracion from procedimientos where tipoc='$tipo' order by nombre";
			
			
		
			
			$resultado=mysql_query($sql,$enlace);
			$datos=array();
			while($dato=mysql_fetch_assoc($resultado)) {
				
			$datos[]=$dato;
			$dato['nombre']=utf8_encode($dato['nombre']);
			
			}
				
			
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>