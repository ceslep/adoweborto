<?php
			require("headers.php");
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$datos=json_decode(file_get_contents("php://input"));
			mysql_select_db("ado",$enlace);
			
			$fecha1=$datos->fecha1;
			$fecha2=$datos->fecha2;
			
			mysql_select_db("ado",$enlace);
			$sql='';
			$sql.='Select distinct abonos.ind as recibo,abonos.paciente,total_pacientes.nombres as Nombres,';
			$sql.='concat_ws(" ",tipo_pago,detalle,if(detalle is null,items,"")) as Descr,sum(valor_abono) as Valor,forma_de_pago,abonos.fecha,abonos.hora,abonos.identificacion';
			$sql.=' from abonos';
			$sql.=' left join total_pacientes on abonos.paciente=total_pacientes.historia';
			$sql.=' left join paciente on abonos.paciente=paciente.historia';
			
			$sql.=' where 1=1';
			$sql.=" and abonos.fecha>='$fecha1' and abonos.fecha<='$fecha2'";
			$sql.=' group by paciente,recibo';
			$sql.=' UNION';
			$sql.=' select abonos_borrados.ind as recibo,abonos_borrados.paciente,total_pacientes.nombres,';
			$sql.=' concat_ws(" ","@ANULADA",tipo_pago,detalle,"@ANULADA"),sum(valor_abono),forma_de_pago,abonos_borrados.fecha,abonos_borrados.hora,abonos_borrados.identificacion';
			$sql.=' from abonos_borrados';
			$sql.=' left join total_pacientes on abonos_borrados.paciente=total_pacientes.historia';
			$sql.=' left join paciente on abonos_borrados.paciente=paciente.historia';
			
			$sql.=' where 1=1';
			$sql.=" and abonos_borrados.fecha>='$fecha1' and abonos_borrados.fecha<='$fecha2'";
			$sql.=' group by paciente,recibo';
			$sql.=' order by recibo';
			//echo $sql;
			$resultado=mysql_query($sql,$enlace);
			$datos=array();
			while($dato=mysql_fetch_assoc($resultado)) {
				
				$dato['Nombres']=utf8_encode($dato['Nombres']);
				$dato['Descr']=utf8_encode($dato['Descr']);
				$datos[]=$dato;
				}
			
			echo json_encode($datos);
			mysql_close($enlace);
?>