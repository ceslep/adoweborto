<?php
			header("Access-Control-Allow-Origin: *");
			
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			if (isset($_REQUEST['paciente'])){
				$paciente=$_REQUEST['paciente'];
				if ($paciente==="undefined") unset($paciente);
				
			}
			
			mysql_query("SET CHARACTER SET utf8 ",$enlace);
			
			mysql_select_db($database,$enlace);
			   $sql=""; 
			   $sql.=' select distinct(citas.fecha),horas,concat_ws("",procedimientos.nombre," [",especialidades.descripcion,"]") as nombre,color,saldos.saldo,asistio,concat_ws(" ",adicional,motivo) as adicional_cita,';
			   $sql.=' fecha_pide_cita,hora_pide_cita,dadapor,qconf,info_confirmacion,fecha_confirma,hora_confirma,borradopor,fechaborra,horaborra,confirmado_por,citas.ind as ind,"C" as tpk';
			   $sql.=' from citas';
			   $sql.=' inner join especialidades on citas.tipo=especialidades.nombre';
			   $sql.=' inner join paciente on citas.paciente=paciente.historia';
			   $sql.=' inner join procedimientos on citas.procedimiento=procedimientos.codigo and citas.tipo=procedimientos.tipoc';
			   $sql.=' left join saldos on citas.paciente=saldos.paciente';
			   $sql.=sprintf(' where citas.paciente="%s"',$paciente);
			   $sql.=' group by citas.ind,citas.fecha,citas.tipo';
			   $sql.=' UNION';
			   $sql.=' select distinct(cppre.fecha),horas,concat_ws("",procedimientos.nombre," [",especialidades.descripcion,"]") as nombre,color,saldos.saldo,asistio,concat_ws(" ",adicional,motivo) as adicional_cita,';
			   $sql.=' fecha_pide_cita,hora_pide_cita,dadapor,qconf,info_confirmacion,fecha_confirma,hora_confirma,borradopor,fechaborra,horaborra,confirmado_por,cppre.ind,"P"';
			   $sql.=' from cppre';
			   $sql.=' inner join especialidades on cppre.tipo=especialidades.nombre';
			   $sql.=' inner join cppredata on cppre.paciente=cppredata.historia';
			   $sql.=' inner join procedimientos on cppre.procedimiento=procedimientos.codigo and cppre.tipo=procedimientos.tipoc';
			   $sql.=' left join saldos on cppre.paciente=saldos.paciente';
			   $sql.=sprintf(' where cppre.paciente="%s"',$paciente);;
			   $sql.=' group by cppre.ind,cppre.fecha,cppre.tipo';
			   $sql.=' UNION';
			   $sql.=' select distinct(canceladas.fecha),horas,concat_ws("",procedimientos.nombre," [",especialidades.descripcion,"]"," CANCELADA") as nombre,color,saldos.saldo,asistio,concat_ws(" ",adicional,motivo) as adicional_cita,';
			   $sql.=' fecha_pide_cita,hora_pide_cita,dadapor,qconf,info_confirmacion,fecha_confirma,hora_confirma,borradopor,fechaborra,horaborra,confirmado_por,canceladas.ind,"K"';
			   $sql.=' from canceladas';
			   $sql.=' inner join especialidades on canceladas.tipo=especialidades.nombre';
			   $sql.=' inner join paciente on canceladas.paciente=paciente.historia';
			   $sql.=' inner join procedimientos on canceladas.procedimiento=procedimientos.codigo and canceladas.tipo=procedimientos.tipoc';
			   $sql.=' left join saldos on canceladas.paciente=saldos.paciente';
			   $sql.=sprintf(' where canceladas.paciente="%s"',$paciente);
			   $sql.=' group by canceladas.ind,canceladas.fecha,canceladas.tipo';
			   $sql.=' order by fecha desc';
			
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
			mysql_free_result($resultado);
			mysql_close($enlace);


?>