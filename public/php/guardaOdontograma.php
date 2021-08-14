<?php
			
        	require("headers.php");
			require_once("datos_conexion.php");
			$enlace =  mysql_connect($host, $user, $pass);
			require("json_encode.php");
			require("json_decode.php");
			
			mysql_select_db("ado",$enlace);
            $datos=json_decode(file_get_contents("php://input"));
			$data=json_encode($datos->enfermedades);
			$sql="insert into odontogramaHTML (paciente,datos,fechaHora) values ('$datos->paciente','$data',now())";
        		
            if(mysql_query($sql,$enlace))
			$datos=array("Estado"=>"Ok","info"=>"Se ha guardado un registro de odontograma","sql"=>$sql);
            else
            $datos=array("Estado"=>"error","info"=>"Error en la consulta ".mysql_error($enlace),"sql"=>$sql);
			$sql="delete from odontogramaHTML where datos='null'";
			mysql_query($sql,$enlace);
            echo json_encode($datos);
            mysql_close($enlace);
?>