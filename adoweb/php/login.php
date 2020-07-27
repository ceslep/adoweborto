<?php
			
	
	
			function limpiarString($texto){
					$textoLimpio=ereg_replace("[^A-Za-z0-9]", "", $texto);								
					return $textoLimpio;
			}
			header("Access-Control-Allow-Origin: *");
			require("datos_conexion.php");
			require("json_encode.php");
			
			
			
			//echo json_encode($_SESSION);
			//exit(0);
			
			
			$enlace =  mysql_connect($host, $user, $pass);
			
			if (isset($_REQUEST['usuario'])){
				$usuario=$_REQUEST['usuario'];
				if ($usuario==="undefined") unset($usuario);
				
			}	
			if (isset($_REQUEST['password'])){
				$password=$_REQUEST['password'];
				if ($password==="undefined") unset($password);
				
			}

			if (isset($_REQUEST['database'])){
				$database=$_REQUEST['database'];
				if ($database==="undefined") unset($database);
				
			}	
			if (isset($_REQUEST['especialidad'])){
				$tipo=$_REQUEST['especialidad'];
				if ($tipo==="undefined") unset($tipo);
				
			}	
			
			mysql_select_db($database,$enlace);
			$usuario=limpiarString($usuario);
			$password=limpiarString($password);
			$sql="select usuario,permisos.identificacion,nombresp from permisos";
			$sql.=" inner join hoja_vida on permisos.identificacion=hoja_vida.identificacion";
			$sql.=" where usuario='$usuario' and contrasena='$password'";
			
		    
			
			$resultado=mysql_query($sql,$enlace);
			$datos=array();
			$dato=mysql_fetch_assoc($resultado);
			if (($dato['usuario']==$usuario)&&(isset($usuario))) {
				
				
				$datos[]=array("concedido"=>"Si","identificacion"=>$dato["identificacion"],"nombres"=>utf8_encode($dato["nombresp"]));
				
			}
			else{
				
				$datos[]=array("concedido"=>"No","sql"=>$sql);
				
			}
			
			echo json_encode($datos);
			mysql_close($enlace);
?>