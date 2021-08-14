<?php
			require("headers.php");
			require_once("datos_conexion.php");
			require("json_encode.php");
            require("json_decode.php");
			$database="ado";
            
			$datos=json_decode(file_get_contents("php://input"));
            
            
            
			$enlace =  mysql_connect($host, $user, $pass);
						
            $fecha=$datos->fecha;
            $paciente=$datos->paciente;
            $tipo=$datos->especialidad;


			
			mysql_query("SET CHARACTER SET utf8 ",$enlace);
			
		
			
			mysql_select_db($database,$enlace);
			$sql=' select citas.paciente,citas.identificacion,nombres,citas.fecha,horas,procedimientos.nombre as procedimiento,citas.procedimiento as codproc,vhoras,concat("linear-gradient(rgb(",replace(procedimientos.color,";",","),"),white)") as style,';
			$sql.=' pagos.tipest as cara,citas.tipo,left(paciente.sexo,1) as sexo,if(length(telefono_movil)=10,telefono_movil,telefono_residencia1) as telefono_movil,';
			$sql.=' conhistoria,consultorio,concat("row",citas.vhoras,citas.consultorio) as id,telefono_movil as telefono,citas.ind as citasind';
			$sql.='	from citas';
			$sql.=" inner join paciente on citas.paciente=paciente.historia";
			$sql.=" left join procedimientos on citas.procedimiento=procedimientos.codigo";
			$sql.=" left join pagos on citas.paciente=pagos.paciente and citas.tipo=pagos.tipo";
			
		
			$sql.=" where 1=1";
			if (isset($fecha)&&($fecha!=""))
			$sql.=" and citas.fecha='$fecha'";	
			else
			$sql.=" and citas.fecha=curdate()";
			
			if (isset($paciente)&&($paciente!="")) 
			$sql.=" and paciente.identificacion='$paciente'";
		
			if (isset($tipo)&&($tipo!="")) 
			$sql.=" and citas.tipo='$tipo'";
			
			$sql.=" UNION ";
			$sql.=' select cppre.paciente,cppre.identificacion,nombres,cppre.fecha,horas,procedimientos.nombre,cppre.procedimiento,vhoras,concat("linear-gradient(rgb(",replace(procedimientos.color,";",","),"),white)") as style,';
			$sql.='	"azul" as cara,cppre.tipo,left(cppredata.sexo,1),left(cppredata.telefono_residencia1,position(" " in cppredata.telefono_residencia1)) as telefono_movil,';
			$sql.=' conhistoria,consultorio,concat("row",cppre.vhoras,cppre.consultorio) as id,telefono_movil as telefono,cppre.ind as citasind';
			$sql.='	from cppre';
			$sql.=" inner join cppredata on cppre.paciente=cppredata.identificacion";
			$sql.=" left join procedimientos on cppre.procedimiento=procedimientos.codigo";
			$sql.=" where 1=1";
			if (isset($fecha)&&($fecha!=""))
			$sql.=" and cppre.fecha='$fecha'";	
			else
			$sql.=" and cppre.fecha=curdate()";
			if (isset($paciente)&&($paciente!="")) 
			$sql.=" and cppredata.identificacion='$paciente'";
		
			if (isset($tipo)&&($tipo!="")) 
			$sql.=" and cppre.tipo='$tipo'";
		
			$sql.=" order by fecha,vhoras";
			
           
		
			$datos=array();
			if ($resultado=mysql_query($sql,$enlace)){
			
			$num_fields=0;
			while($dato=mysql_fetch_assoc($resultado)) //$datos[]=$dato;
			{
				
			
			$dato['nombres']=utf8_encode($dato['nombres']);
			$dato['procedimiento']=utf8_encode($dato['procedimiento']);
		
			$datos[]=$dato;
								
			}
			}
			else{
		
				$datos=array("Tipo"=>"Error","Mensaje"=>mysql_error($enlace),"SQL"=>$sql);
				
			}
			
			
			echo json_encode($datos);
			mysql_free_result($resultado);
			mysql_close($enlace);
?>