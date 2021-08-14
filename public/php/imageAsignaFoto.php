<?php
		header("Access-Control-Allow-Origin: *");
			require_once("datos_conexion.php");
			require("json_encode.php");
			require("json_decode.php");
			$enlace =  mysql_connect($host, $user, $pass);
			$datos=json_decode(file_get_contents("php://input"));
			$database=$datos->database;
			$historia=$datos->historia;
			$foto=$datos->foto;
				
			mysql_select_db($database,$enlace);
			unlink("foto.jpg");
			do{
			file_put_contents("foto.jpg", file_get_contents($foto));
			}while(!file_exists("foto.jpg"));
			$sql="update paciente set foto=load_file('c://servicios//VertrigoServ//www//adoweb//php//foto.jpg') where historia='$historia'";
			$datos=array();
			
			
		
			
			
			$datos=array();
			if(mysql_query($sql,$enlace))
			
				$datos[]=array("resultado"=>"ok","mensaje"=>utf8_encode("Foto cargada satisfactoriamente"),"historia"=>$historia);
			
			else
					$datos[]=array("Error"=>mysql_error($enlace),"SQL"=>$sql);
			
			$files=json_encode($datos);
			header('Content-Length: '.strlen($files));	
			echo $files;
			
			mysql_close($enlace);
?>