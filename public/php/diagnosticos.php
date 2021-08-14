<?php
			header("Access-Control-Allow-Origin: *");
			$database=$_REQUEST['database'];
			$tipo=$_REQUEST['tipo'];
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			
			
			mysql_select_db($database,$enlace);
			$sql="select * from cie10 where (diagnostico like '% diente %') or (diagnostico like '% dientes %') or (diagnostico like '% dental %') or (diagnostico like '% encia %') or (diagnostico like '% periodonto %') or (diagnostico like '% caries %') or (diagnostico like '% amalgama %')";
			
		
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) {
				$dato['diagnostico']=utf8_encode($dato['diagnostico']);
				$datos[]=$dato;
			}
			else
					$datos=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>