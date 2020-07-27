<?php
		session_start();
		
        print_r($_SESSION);
		echo $_SESSION["miBd"];
		echo $_SESSION["miTipo"];
		//session_destroy();
		
?>