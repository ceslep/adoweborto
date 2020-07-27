<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$database=$_REQUEST['database'];
		//	$criterio=$_REQUEST['criterio'];	
			mysql_select_db($database,$enlace);
		//	mysql_query("SET CHARACTER SET utf8 ",$enlace);
			$sql="select maps.auxiliar,nombresp,map from maps";
			$sql.=" inner join hoja_vida on maps.auxiliar=hoja_vida.identificacion";
			$sql.=" order by map";
			//$sql.=" where identificacion like '%$criterio%' or nombres like '%$criterio%' or historia like '%$criterio%'";
			
		
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) {
				$dato['nombresp']=utf8_encode($dato['nombresp']);
				$datos[]=$dato;
			}
			else
					$datos=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>