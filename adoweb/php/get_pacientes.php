<?php
			//	header("Access-Control-Allow-Origin: *");
			header('Content-Type: application/json');
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$database=$_REQUEST['database'];
			if (isset($_REQUEST['mapa'])) $mapa=$_REQUEST['mapa'];
		//	echo json_encode(array("a"=>"b"));
	//		exit(0);
			mysql_select_db($database,$enlace);
		//	mysql_query("SET CHARACTER SET utf8 ",$enlace);
			
			$sql="select identificacion,historia,nombres,'PACIENTE',auxiliar2 as mapa from paciente";
			//if (isset($mapa))
			
			$sql.=" where  ";
			$sql.=" length(nombres)>20 and estado<>'INACTIVO'";
			if (isset($mapa))
				if ($mapa!="Todos")
			$sql.=" and auxiliar2='$mapa'";
			$sql.=" UNION ";
			$sql.=" select identificacion,historia,nombres,'PVPACIENTE','' from cppredata";
			//if (isset($mapa))
			
			$sql.=" where  ";
			$sql.="  length(nombres)>20 and estado<>'INACTIVO' and inicia<>'S'";
			if (isset($mapa))
				if ($mapa!="Todos")
			$sql.=" and auxiliar2='$mapa'";
			$sql.=" order by nombres";
		   // echo $sql;
		   // exit(0);			
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) {
				$dato['nombres']=utf8_encode($dato['nombres']);
				$datos[]=$dato;
			}
			else
					$datos=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			$data[]=array("Sql"=>$sql,"datos"=>$datos);
			echo json_encode($data);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>