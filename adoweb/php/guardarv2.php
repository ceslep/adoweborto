<?php
			
        	header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			
			$enlace =  mysql_connect($host, $user, $pass);
			require("json_encode.php");
			require("json_decode.php");
			
            $datos=json_decode(file_get_contents("php://input"));
			
			mysql_select_db($datos->database,$enlace);
			$tabla=$datos->ctable;
            $sql="INSERT INTO $datos->ctable (%s) values (%s)";
            $values="";
            $campos="";
            $i=0;
            foreach($datos as $dato=>$valor){
				  
				  if(($dato!='cindex')&&($dato!='ctable')&&($dato!='ind')&&($dato!='database')){
				  
             
                  $campos.="$dato".",";
                  $values.="'$valor'".","; 
                  
				  }
				$i++;	
            }
			$campos=substr($campos,0,strlen($campos)-1);
			$values=substr($values,0,strlen($values)-1);
            $sql=sprintf($sql,$campos,$values);
		
			$datos=array();
			$datos[]=array("Sql"=>$sql,"Cuantos"=>count($datos));
		
		
            $datos=array();
            if(mysql_query($sql,$enlace))
            $datos=array("Estado"=>"Ok","info"=>"Se ha guardado un registro de $tabla","sql"=>$sql);
            else
            $datos=array("Estado"=>"error","info"=>"Error en la consulta ".mysql_error($enlace),"sql"=>$sql);
            echo json_encode($datos);
            mysql_close($enlace);
?>