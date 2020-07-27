<?php
			header("Access-Control-Allow-Origin: *");
			
			require("json_encode.php");
			require("json_decode.php");
			require_once("datos_conexion.php");
            $datos=json_decode(file_get_contents("php://input"));
			$enlace =  mysql_connect($host, $user, $pass);
			
			if (isset($_REQUEST['fecha'])){
				$fecha=$_REQUEST['fecha'];
				if ($fecha==="undefined") unset($fecha);
				
			}	
			mysql_select_db($datos->database,$enlace);
			$sql="select identificacion,nombresp as nombres from hoja_vida where activo='S' and tipo='Ortodoncista' order by nombres";
			
			
			$datos=array();
			
			if($resultado=mysql_query($sql,$enlace))
			
			
			while($dato=mysql_fetch_assoc($resultado)) {
				
				$dato['nombres']=utf8_encode($dato['nombres']);
				$datos[]=$dato;
				
			}
			else
				$datos[]=array("msj"=>"error","Mysql Error"=>mysql_error($enlace),"sql"=>$sql);
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>