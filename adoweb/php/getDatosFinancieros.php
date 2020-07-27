<?php
			header("Access-Control-Allow-Origin: *");
			header('Content-Type: application/json');
			require_once("datos_conexion.php");
			$enlace =  mysql_connect($host, $user, $pass);
			require("json_encode.php");
			require("json_decode.php");
			
            $datos=json_decode(file_get_contents("php://input"));
			
			mysql_select_db($datos->database,$enlace);
		//	mysql_query("SET CHARACTER SET utf8 ",$enlace);
			$sql="select costo_tratamiento,saldos.saldo,pagos.nocuotas,pagos.valor_cuota from pagos";
			$sql.=" left join saldos on pagos.paciente=saldos.paciente and pagos.tipo=saldos.tipo";
			$sql.=" where pagos.paciente='$datos->paciente' and saldos.paciente='$datos->paciente'";
			$sql.=" and pagos.tipo='$datos->tipo'";
			
		 //   echo $sql;
			
			$datos=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato=mysql_fetch_assoc($resultado)) {
				
						
				
				$datos[]=$dato;
			}
			else
					$datos[]=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>