<?php
			header("Access-Control-Allow-Origin: *");
			header('Content-Type: application/json');
			require_once("datos_conexion.php");
			$enlace =  mysql_connect($host, $user, $pass);
			require("json_encode.php");
			require("json_decode.php");
			
            $datos=json_decode(file_get_contents("php://input"));
			
			mysql_select_db($datos->database,$enlace);
		
			$sql="select * from pagos";
			$sql.=" where paciente='$datos->paciente'";
			$sql.=" and tipo='$datos->tipo'";
		
			
			$datos0=array();
			
			
		    if($resultado=mysql_query($sql,$enlace)){
				
				while($dato0=mysql_fetch_assoc($resultado)) 
					$datos0=$dato0;
				
				
			}
			
			$sql="select b as abonado,saldo from saldos";
			$sql.=" where paciente='$datos->paciente'";
			$sql.=" and tipo='$datos->tipo'";
		
			
			$datos1=array();
			
			
		    if($resultado=mysql_query($sql,$enlace)){
				
				while($dato1=mysql_fetch_assoc($resultado)) 
					$datos1=$dato1;
				
				
			}
			
			$sql="select recibo,fecha,hora,valor_abono,forma_de_pago,items from abonos";
			$sql.=" where paciente='$datos->paciente'";
			$sql.=" and tipo='$datos->tipo'";
			$sql.=" order by fecha desc";
			
			$datos2=array();
			if($resultado=mysql_query($sql,$enlace))
			
			while($dato2=mysql_fetch_assoc($resultado)) {
				
						
				$dato2['items']=utf8_encode($dato2['items']);
				$datos2[]=$dato2;
			}
			else
					$datos[]=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			$result=array();
			$result[]=array("Financiera"=>$datos0,"Saldo"=>$datos1,"Pagos"=>$datos2);
			//$result=array("Financiera"=>$datos1,"Pagos"=>$datos2);
			json_encode($datos2);
			echo json_encode($result);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>