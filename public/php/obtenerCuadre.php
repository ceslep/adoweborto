<?php
			require("headers.php");
			require_once("datos_conexion.php");
			require("json_encode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$datos=json_decode(file_get_contents("php://input"));
			mysql_select_db("ado",$enlace);
			
			$fecha1=$datos->fecha1;
			$fecha2=$datos->fecha2;
			$sql="
					select '                                                     ' as itemdDesc,'Total de los ingresos                            ' as descripcion,sum(valor_abono) as Total,'bg-secondary text-light                 '  as bg from abonos 
					where fecha between '$fecha1' and '$fecha2'
					UNION
					select '1','          ','        ','              '  from abonos
					UNION
					select 'Totales              ',forma_de_pago,sum(valor_abono) as Total,'' as bg from abonos 
					where fecha between '$fecha1' and '$fecha2'
					group by forma_de_pago
					UNION
						select 'Totales         ','Total Tarjetas   ',sum(valor_abono) as Total,'bg-info text-dark' as bg from abonos
						where fecha between '$fecha1' and '$fecha2' and
						forma_de_pago like '%TARJETA%'
					UNION
					select '2','           ','         ','              '  from citas
					UNION
					select concat_ws(' ','Totales por items',tipoa),descripcion,sum(valor_abono) as total,'' as bg from abonos
					inner join codigos_siigo on abonos.codigo=codigos_siigo.codigo
					where fecha between '$fecha1' and '$fecha2'
					group by abonos.codigo,tipoa
					
					UNION
					
						select 'Totales por codigo         ','Total                  ',sum(valor_abono) as Total,'bg-dark text-light' as bg from abonos
						where fecha between '$fecha1' and '$fecha2'
						


					UNION
					select '3','                     ','                         ','' as bg  from abonos
					UNION
					select descripcion,forma_de_pago,sum(valor_abono) as total,'' as bg from abonos
					inner join codigos_siigo on abonos.codigo=codigos_siigo.codigo
					where fecha between '$fecha1' and '$fecha2'
					group by abonos.codigo,forma_de_pago
					UNION
					select '4','                                             ','                          ','' as bg  from abonos
					UNION 
					select 'Total por Especialidad                                      ',especialidades.descripcion,sum(valor_abono) as total,'' as bg from abonos
					inner join especialidades on abonos.tipo=especialidades.nombre
					where fecha between '$fecha1' and '$fecha2'
					group by abonos.tipo
					UNION
					select '5','                                                                                                                ','                        ','' as bg  from abonos
					UNION
					select concat_ws(' ',codigos_siigo.descripcion,if(detalle is null,items,detalle)),forma_de_pago,sum(valor_abono) as total,'bg-info text-dark' as bg from abonos
					inner join especialidades on abonos.tipo=especialidades.nombre
					inner join codigos_siigo on abonos.codigo=codigos_siigo.codigo
					where fecha between '$fecha1' and '$fecha2'
					group by abonos.tipo,abonos.codigo,forma_de_pago,tipo_pago,detalle
					
			";
			//echo $sql;
			$resultado=mysql_query($sql,$enlace);
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