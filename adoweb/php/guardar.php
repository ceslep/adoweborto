<?php
	 header("Access-Control-Allow-Origin: *");
	 require_once("datos_conexion.php");
	 require("json_encode.php");
	   
	  $indice=$_GET['cindex'];
	  $tabla=$_GET['ctable'];
	  $valor=$_GET[$indice];
	  $database=$_GET['database'];
	  
	  $link=mysql_connect($host,$user,$pass);
	  mysql_select_db($database);
	  $sql=sprintf('select %s from %s where %s="%s"',$indice,$tabla,$indice,$valor);
	
	  $resultado_consulta=mysql_query($sql,$link);
	  //$fila=mysql_fetch_array($resultado_consulta);
	  $num_rows=mysql_num_rows($resultado_consulta);
	  
	  if($num_rows==0)
	  {
        $sql=sprintf("insert into %s (",$tabla);
		$a=array_keys($_GET);
	//	$ultimo=$a[count($a)-1];
		$ultimo='duracion';
		while (list($key, $val) = each($_GET))
		{
		    if(($key!='cindex')&&($key!='ctable')&&($key!='ind')&&($key!='database')&&($key!='Url')&&($key!='hblid')&&($key!='olfsk'))
			{
					if ($key!=$ultimo)
					$sql.=sprintf("%s,",$key);
					else
					$sql.=sprintf("%s)",$key);
			}
		}
       reset($_GET);
       $sql.=" values (";
       while (list($key, $val) = each($_GET))
		{
		   if(($key!='cindex')&&($key!='ctable')&&($key!='ind')&&($key!='database')&&($key!='Url')&&($key!='hblid')&&($key!='olfsk'))
		   {
				if ($key!=$ultimo)
				$sql.=sprintf("'%s',",$val);
				else
				$sql.=sprintf("'%s')",$val);
		   }
		}	  
     		
	  }
	  else
	  {
	    $sql=sprintf("update %s set ",$tabla);
		$a=array_keys($_GET);
		$ultimo=$a[count($a)-1];
		while (list($key, $val) = each($_GET))
		{
		    if(($key!='cindex')&&($key!='ctable')&&(key!='database'))
			{
					if ($key!=$ultimo)
					$sql.=sprintf("%s='%s',",$key,$val);
					else
					$sql.=sprintf("%s='%s'",$key,$val);
			}
		}
        $sql.=sprintf(" where %s='%s'",$indice,$valor);
	  }
	 
	  
	// echo $sql; 
	// exit(0); 
	   $datos=array();
	  if(!mysql_query($sql,$link)){
		  
		  $datos[]=array("Estado"=>"Error","Error"=>"MySQL_ERROR:".mysql_error($link),"SQL"=>$sql,"Url"=>$_SERVER['PHP_SELF']);
		  echo json_encode($datos);
		  mysql_close($link);
		  exit(0);
	  }
	  else{
		  
		  $datos[]=array("Estado"=>"Ok","Mensaje"=>mysql_error($link),"sql"=>$sql);
	  }
	  if ($ctable=="evolucion"){
		  /*
			$ind=$_GET['citasind'];
			$auxiliar=$_GET['auxiliar'];
			$especialista=$_GET['especialista'];
            $sql="update citas set asistio='S',conhistoria='S',hora_salida=curtime(),evolucion='S',auxiliar='$auxiliar',especialista='$especialista' where ind='$ind'";
		//	echo $sql;
			mysql_query($sql,$link);
		*/	
	  }
	  
	  echo json_encode($datos);
	  mysql_close($link);
	//  $socket = stream_socket_client('udp://192.168.1.12:4170');
	//  fwrite($socket, $_GET['paciente'].":45");
	//  fclose($socket);
?>