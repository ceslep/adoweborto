<?php
			header("Access-Control-Allow-Origin: *");
			
			require_once("datos_conexion.php");
			require("json_encode.php");
			$database=$_REQUEST['database'];
			$enlace =  mysql_connect($host, $user, $pass);
			if (isset($_REQUEST['paciente'])){
				$paciente=$_REQUEST['paciente'];
				if ($paciente==="undefined") unset($paciente);
				
			}
			
			mysql_query("SET CHARACTER SET utf8 ",$enlace);
			
			mysql_select_db($database,$enlace);
			   
			
			$sql="select signature from evolucion where signature!=''";
			//echo $sql;
			
			if ($resultado=mysql_query($sql,$enlace)){
				$datos=array();
				while($dato=mysql_fetch_assoc($resultado)){
					
					
					$datos[]=$dato;
					
				}
				
				
			}else{
				
				$datos=array("Tipo"=>"Error","Mensaje"=>mysql_error($enlace),"SQL"=>$sql);
				
			}
			
			
			echo json_encode($datos);


?>