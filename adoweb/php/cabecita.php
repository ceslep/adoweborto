<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			
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
				
				  $resultado=mysql_query($sql,$enlace);
				  $cabecita=mysql_fetch_assoc($resultado);
				  $cabecita=$cabecita['ind'];
				  return $cabecita;
				  
				
			}
			$enlace =  mysql_connect($host, $user, $pass);
			$database=$_REQUEST['database'];
			$fecha=$_REQUEST['fecha'];
			$hora=$_REQUEST['hora'];
			$procedimiento=$_REQUEST['procedimiento'];
			$consultorio=$_REQUEST['consultorio'];
			$tipo=$_REQUEST['tipo'];
			mysql_select_db($database,$enlace);
		
			$cabe=cabecita($fecha,$hora,$procedimiento,$consultorio,$tipo,$enlace);
			
			if ($cabe!="") $datos[]=array("Cabe"=>"No");
			else $datos[]=array("Cabe"=>"Si");
			
		
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>