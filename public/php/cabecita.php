<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			$datos=json_decode(file_get_contents("php://input"));
			
			function cabecita($fecha,$hora,$procedimiento,$consultorio,$tipo,$enlace){
				
				$sql="select duracion from procedimientos";
				$sql.=" where codigo='$procedimiento' and tipoc='$tipo'";
			
				
				$resultado=mysql_query($sql,$enlace);
				$duracita=mysql_fetch_assoc($resultado);
				$duracita=$duracita['duracion'];
				$sql=sprintf('select DATE_FORMAT(DATE_ADD("%s %s",INTERVAL %s MINUTE),"%s:%s:%s") as hora',$fecha,$hora,$duracita,"%H","%i","%s");
				
				$resultado=mysql_query($sql,$enlace);
				$t=mysql_fetch_assoc($resultado);
				$t=$t['hora'];
				
				  $sql="Select ind from citas";
				  $sql.=" where fecha='$fecha'";
				  $sql.=" and (vhoras>='$hora') and (vhoras<'$t')";
				  $sql.=" and consultorio='$consultorio'";
				  $sql.=" and tipo='$tipo'";
				  $sql.=" union";
				  $sql.=" Select ind from cppre";
				  $sql.=" where fecha='$fecha'";
				  $sql.=" and (vhoras>='$hora') and (vhoras<'$t')";
				  $sql.=" and consultorio='$consultorio'";
				  $sql.=" and tipo='$tipo'";
				//  echo $sql;
				//  exit(0);
				  $resultado=mysql_query($sql,$enlace);
				  $cabecita=mysql_fetch_assoc($resultado);
				  $cabecita=$cabecita['ind'];
				  mysql_free_result($resultado);
				  return $cabecita;
				  
				
			}
			$enlace =  mysql_connect($host, $user, $pass);
			$database=$datos->database;
			$fecha=$datos->fecha;
			$hora=$datos->hora;
			$procedimiento=$datos->procedimiento;
			$consultorio=$datos->consultorio;
			$tipo=$datos->tipo;
			mysql_select_db($database,$enlace);
		
			$cabe=cabecita($fecha,$hora,$procedimiento,$consultorio,$tipo,$enlace);
			$datos=array();
			if ($cabe!="") $datos[]=array("Cabe"=>"No");
			else $datos[]=array("Cabe"=>"Si");
			
		
			
			echo json_encode($datos);
			
			mysql_close($enlace);
?>