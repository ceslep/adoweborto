<?php
			
        	header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			
			$enlace =  mysql_connect($host, $user, $pass);
			require("json_encode.php");
			require("json_decode.php");
			
            $datos=json_decode(file_get_contents("php://input"));
			$tabla=$datos->ctable;
			mysql_select_db($datos->database,$enlace);
            $sql="UPDATE $tabla set %s  where %s";
            $values="ind=$datos->citasind";
            $campos="";
            $i=0;
            foreach($datos as $dato=>$valor){
				  
				  if(($dato!='citasind')&&($dato!='cindex')&&($dato!='ctable')&&($dato!='ind')&&($dato!='database')){
				  
             
                  $campos.="$dato='$valor'".",";
                  
                  
				  }
				$i++;	
            }
			$campos=substr($campos,0,strlen($campos)-1);
			
            $sql=sprintf($sql,$campos,$values);
		
			$datos=array();
			$datos[]=array("Sql"=>$sql,"Cuantos"=>count($datos));
		
		
            $datos=array();
            if(mysql_query($sql,$enlace))
            $datos=array("Estado"=>"ok","info"=>"Se ha actualizado un registro de $tabla","sql"=>$sql);
            else
            $datos=array("Estado"=>"error","info"=>"Error en la consulta ".mysql_error($enlace),"sql"=>$sql);
            echo json_encode($datos);
            mysql_close($enlace);
?>