<?php
			require("headers.php");
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$datos=json_decode(file_get_contents("php://input"));
			mysql_select_db("ado",$enlace);
			
			
            $sql='update pagos,saldos set tipest="AMARILLA" where pagos.paciente=saldos.paciente and saldos.saldo>0';
            mysql_query($sql,$enlace);
            $sql='update pagos,saldos set tipest="MORADA" where pagos.paciente=saldos.paciente and saldos.saldo=0';
            mysql_query($sql,$enlace);
            $sql='update pagos,retencion set pagos.tipest="VERDE" where pagos.paciente=retencion.paciente and retencion="S"';
            mysql_query($sql,$enlace);

			
			
			echo json_encode(array("mensaje"=>"ok"));
			mysql_close($enlace);
?>