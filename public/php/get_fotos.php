<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$database=$_REQUEST['database'];
			if (isset($_REQUEST['historia']))
			$historia=$_REQUEST['historia'];
			if (isset($_REQUEST['fotos']))
			$fotos=$_REQUEST['fotos'];
		else $fotos=true;
			
			mysql_select_db($database,$enlace);
		//	mysql_query("SET CHARACTER SET utf8 ",$enlace);
			if ($fotos=="true")
			$sql="select historia,nombres,foto,identificacion,sexo,'true' as spinner from paciente";
			else
			$sql="select historia,nombres,NULL as foto,identificacion,sexo,'false' as spinner from paciente";
			if (isset($historia))
			$sql.=" where historia='$historia'";
			else
		    $sql.= " where historia<=150000";
			$sql.=" order by historia desc";
			$sql.=" limit 60";
		    
			
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) {
				
				$dato['nombres']=utf8_encode($dato['nombres']);
				if ($dato['foto']!=NULL){
				$dato['foto']='data:image/jpg;base64,'.base64_encode($dato['foto']);
				}else{
					if ($dato['sexo']=="MASCULINO") $dato['foto']="http://appsmoya.ngrok.io/fotos/assets/male.png";
					else $dato['foto']="http://appsmoya.ngrok.io/fotos/assets/female.png";
				}
				$datos[]=$dato;
			}
			else
					$datos[]=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			$files=json_encode($datos);
			header('Content-Length: '.strlen($files));	
			echo $files;
			mysql_free_result($resultado);
			mysql_close($enlace);
?>