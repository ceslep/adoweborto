<?php
			header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
            require("json_encode.php");
            require("json_decode.php");
			$enlace =  mysql_connect($host, $user, $pass);
            $datos = json_decode(file_get_contents("php://input"));
            
			

			
			mysql_select_db($datos->database,$enlace);
			
			
            $sql="select historia,nombres,edad,sexo,foto from paciente";
            $sql.=" where (foto is not null) and (length(foto)>100) order by historia desc limit 200";
			
			$resultado=mysql_query($sql,$enlace);
            $datos=array();
            
            while($dato=mysql_fetch_assoc($resultado)) {
                $dato['foto']='data:image/jpg;base64,'.base64_encode($dato['foto']);
                $datos[]=$dato;
            }
            $response=json_encode($datos);
			header("Content-Length:".strlen($response));
			echo $response;
			mysql_free_result($resultado);
			mysql_close($enlace);
?>