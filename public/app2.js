"use strict"


//var socket = io();
var url="/";
var dataUrl={};
var imageFirma;
var dataSelect=[];
var dadapor="";
var mapas=[];
var pacientes=[];
var procedimientos=[];
var horas;
var spin;
var queagenda="";
var galleryTop;
var galleryThumbs;
var usuario=null;
var nombreUser=null;
var itemsP=[];

jQuery.fn.redraw = function() {
    return this.hide(0, function() {
        $(this).show();
    });
};

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0,10);
});

$.fn.serializeObject = function()
{
   var o = {};
   var a = this.serializeArray();
   $.each(a, function() {
       if (o[this.name]) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
   });
   return o;
};



var datosAgenda=[];
var filtrado=false;
var datosCedula="";
var longCedula=0;
var arrayCedula=[];
var arrayCedulaStr=[];
var timeout=false;
var Keys=[48,49,50,51,52,53,54,55,56,57,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,85,87,88,89,90,45,189];
$(document).ready(function(e){


	
	var data = Bind({
		database:"ado",
		paciente:"",
		especialidad:""
	},{
		database:".database",
		paciente:".paciente",
		especialidad:".especialidad"
	});

	var canvas=document.getElementById("myCanvas");
	var signaturePad=new SignaturePad(canvas, {
		minWidth: 1,
		maxWidth: 2,
		penColor: "rgb(0, 0, 0)"
	});


	var usuario = sessionStorage.getItem('user');
	var nombreUser = sessionStorage.getItem('nombreUser');
	var database = sessionStorage.getItem('database');
	var especialidad = sessionStorage.getItem('especialidad');
	console.log(usuario);
	console.log(database);
	console.log(especialidad);
	
	

	$(window).resize(function(e){

		var ancho=parseInt($(window).width()*0.95);
		
		$("#findpac").width(ancho);
		$('#findpac').chosen("destroy");
		$('#findpac').chosen({width: "95%",no_results_text: "Lo siento no pude encontrar el paciente Buscado",allow_single_deselect: true});	

	});

	var filtertel=function(tel){
		try{
		var numbers=["0","1","2","3","4","5","7","8","9"];
		
		var fts="";
		var ftel=tel.split("").map(function(s){
			 if (s in numbers) fts+=s;
	 });
	 return fts;
	}catch(error){
		console.log(error);
		return "";

	}
	}

/*	
	socket.on('data', (dataId)=>{
		return;
		Object.keys(dataId).forEach(key=>{
			$("#"+key).val(dataId[key]);
		});
		$("#cedulaModalPreview").modal().modal("show");
	  });*/
	
	longCedula=0;
	var ReverseString=function(str) { 
  
		// Check input 
		if(!str || str.length < 2 ||  
				typeof str!== 'string') { 
			return 'Not valid';  
		} 
		  
		// Take empty array revArray 
		var revArray = []; 
		var length = str.length - 1; 
		  
		// Looping from the end 
		for(var i = length; i >= 0; i--) { 
			revArray.push(str[i]); 
		} 
		  
		// Joining the array elements 
		return revArray.join(''); 
	} 
	var limpiarCedula=function (cedula){

     	  var length=cedula.length;
		  cedula=cedula.substring(cedula.indexOf("9"),cedula.length);
		 
		  var index0=ReverseString(cedula).lastIndexOf("0");
		  return(cedula.substring(length-index0,cedula.length));
	} 
	

	var limpiarCedula2 = function(cedula){
		var ced=ReverseString(cedula);
		var inicio=false;
		var cedstr="";
		for(var i=0;i<cedula.length;i++){
			if (inicio) cedstr+=cedula[i];
			if ((cedula[i+1]!="0")&&(cedula[i]==="0")) inicio=true;
			
		}
		longCedula=0;
		return(cedstr);
	}
	
	$("#btnFirmas").hide();
	$("#inicio").hide();
	$("#tableData").hide();



	var getCitas = async function(){

		try{
		console.log(data.database)	;
		var datas={fecha:$("#fechaAgenda").val(),"database":data.database,"tipo":data.especialidad};	
	
		var response = await fetch(url+"citas",{

			method:"POST",
			body:JSON.stringify(datas),
			headers:{ 'Content-Type': 'application/json'}

	   });
		var datos = await response.json();
		return (datos);
		}catch(error){
			console.error(error);
			$("#errorcargaModal").modal("show");
		}
	}


	var showCitas = async function(){
	  
		$("#spinner").show();
		var citas = await getCitas();
	
		$("#spinner").hide();
		return(citas);
		
	} 

	var showAgenda = async function(){
	  
		$("#spinner").show();
		var datos = await getAgenda();
		
		$("#spinner").hide();
		return(datos);
		
		
	} 

	function dibujaCara(cara){

				
				if (cara!=undefined)
				return cara!=""?`<img class="cara" src='caras/${cara.toLowerCase()}.png'>`:"";
				else
				return ("");


	}


	function dibujaFoto(foto){

		
		if (foto!=undefined)
		return foto!=""?`${foto}`:"";
		else
		return ("");


}


	var agendaCitas =  async (filter=false)=>{

	
		$("#infoSpinner").text("Cargando Datos de Citas");
		var citas = await showCitas();
	
		$("#infoSpinner").text("Cargando Datos de Agenda");
		$("#spinner").addClass("text-secondary");
		datosAgenda=await showAgenda();
		
		
		$("#agenda").redraw();
		await dibujaCitas(citas);
		$("#dataInfo").empty().html(await dibujaAgenda(datosAgenda));
		filtrado=!filter;
		if (!filter)
		$("#filtrar").click();
		
		

	}



	var loginet = async user=>{

		var login;
		var dlog = false;
		console.log(user);
		if (user===null){
		$("#btnLogin").addClass("disabled");
		$(".loadini").removeClass("d-none");
		$("#spinnerload").removeClass("d-none");
		var datosLogin=$("#frmLogin").serializeObject();
		//var datosLogin={'usuario':$("#usuario").val(),'password':$("#password").val(),};
		var response=await fetch(url+"login",{
			method:"POST",
			body:JSON.stringify(datosLogin),
			headers:{ 'Content-Type': 'application/json'}

		});
		login=await response.json();
		dlog = true;
		}else{
			login = [];
			var logObj = new Object;
			logObj.concedido = "Si";
			logObj.nombres = nombreUser;
			login.push(logObj);
		}
		console.log(login);
		if (login[0].concedido==="Si"){

				
			
			
			
			
			dadapor=login[0].nombres;
			if (dlog){
			sessionStorage.setItem('user', $("#usuario").val());	
			sessionStorage.setItem('nombreUser', dadapor);
			sessionStorage.setItem('database', $("#database").val());
			sessionStorage.setItem('especialidad', $("#especialidad").val());
			}	
			await agendaCitas();
			await getCitasData()
			$("#containerLogin").addClass("d-none");
			$("#inicio").removeClass("height");
			$("#containerLogin").hide();
			$("#inicio").removeClass("d-none");
			$("#tableData").removeClass("d-none");
			$("#agenda").removeClass("d-none");
			$("#inicio").show();
			$("#tableData").show();
			$(window).resize();
			//createCitasModal();
		}
		else{

			$("#nologinModal").modal("show");
			$("#usuario").val("");
			$("#password").val("");	
			$("#usuario").focus();
			$("#infologin").removeClass("d-none");
		}

	}


	var inicio = (async function(e){
		if (usuario!==null) {
			data.database=database;
			data.especialidad=especialidad;
			console.log(data.__export());
			$("#especialidad").val(especialidad);
			$("#autologin").removeClass("d-none");
			$("#login").addClass("d-none");
			await loginet(usuario);
			$("#filtrar").click();
		}
	})();
	
	$("#frmLogin").submit(async function(e){
		
		e.preventDefault();
		loginet(usuario);
		
	});


	
	

	$("#borraFirma").click(function(e){

		$('#myCanvas').css('background-image','none');
        $('#myCanvas').clearCanvas();
	});

	$("#btnFirma").click(function(e){

		imageFirma=$("#myCanvas").getCanvasImage();
		$("#signature").val(imageFirma);
      
	});

	$("#btnir").click(function(e){

		agendaCitas();	
		
	});

	$("#btnGuardarEvolucion").click(async function(e){

				e.preventDefault();
				$("#adatabase").val(data.database);
				$("#atable").val(queagenda);
				$("#acitasind").val($("#citasind").val());
				$("#eauxiliar").val($("#evauxiliar").val());
				$("#aespecialista").val($("#profesional").val());
				$("#aevolucion").val("S");
				$("#ainasistencia").val("N");
				$("#aconhistoria").val("S");
				$("#asistio").val("S");
				$("#ahora_salida").val(new Date().toLocavarimeString('es-CO',{timeStyle:"short"}));

				
				var jsontext="{";
				await $.each($("#frmEvolucion").serializeObject(),(i,k)=>{
				
					jsontext+='"'+i+'":"'+k+'",';
					
					

				});
				await $.each($("#frmRipsConsulta").serializeObject(),(i,k)=>{
					
					jsontext+='"'+i+'":"'+k+'",';
					
				});
				
				jsontext=jsontext.replace(/.$/,"}");
				
			
				var response=await fetch(url+"guardaEvolucion",{
					method:"POST",
					body:jsontext,
					headers:{ 'Content-Type': 'application/json'}
				});
				var info=await response.json();
				
				if (info.Estado=="Ok"){ $("#modalok").modal("show");

						var actuacitas=await fetch(url+"actuaCita",{
						
							method:"POST",
							body:JSON.stringify($("#frmActuacitas").serializeObject()),
							headers:{ 'Content-Type': 'application/json'}

						});
						var actualizado=await actuacitas.json();
						console.log(actualizado);
						$("#frmEvolucion")[0].reset();
						$("#frmActuacitas")[0].reset();
						$("#frmRipsConsulta")[0].reset();
						$("#borraFirma").click();
				}
				else if (info.Estado=="Error") {

				
					$("#infoUrl").text(`${info.Error}=>${info.Url}`);
					$("#errorcargaModal").modal("show");
				}
				$("#confirma2").modal("hide");

	});

	$("#causa_externa").blur(function(e){

	
	});

	var asistio = (ast)=>{

		
		return(ast=="S"?`<img src="imagenes/asistio.png" alt="Asisti??" class="img-thumbnail imagen-asistio">`:`<img src="imagenes/no_asistio.png" alt="Asisti??" class="img-thumbnail imagen-asistio">`);
		

	}
	$('a[data-toggle="tab"]').on('shown.bs.tab',async function(e) {
		//e.target // newly activated tab
		//e.relatedTarget // previous active tab
	
		$("#btnFirmas").hide();
		
		if ($(e.target).text().includes("R.I.P.S.")){

			$("#spinner").show();
			var datos=await fetch(url+"causa_externa",{
				method:"POST",
				body:JSON.stringify({"database":data.database,"tipo":data.especialidad}),
				headers:{ 'Content-Type': 'application/json'}
			});
			var causas_externas=await datos.json();
			var html="";	
			await causas_externas.forEach(causa_externa=>{

				html+=`<option value="${causa_externa.codigo}:${causa_externa.nombre}">${causa_externa.nombre}</option>`;

			});
			$("#causa_externa_list").empty().html(html);

			datos=[];
			datos=await fetch(url+"diagnosticos",{
				method:"POST",
				body:JSON.stringify({"database":data.database,"tipo":data.especialidad}),
				headers:{ 'Content-Type': 'application/json'}
			});
			var diagnosticos=await datos.json();
			html="";
			await diagnosticos.forEach(diagnostico=>{

				html+=`<option value="${diagnostico.codigo}:${diagnostico.diagnostico}">${diagnostico.diagnostico}</option>`;
			});
			$("#diagnostico_principal_list").empty().html(html);
			$("#diagnostico_relacionado1_list").empty().html(html);
			$("#diagnostico_relacionado2_list").empty().html(html);
			$("#diagnostico_relacionado3_list").empty().html(html);
			$("#spinner").hide();
		}
		else if ($(e.target).text().includes("Historial")){

			var historial=await fetch(url+"getHistorial",{
				method:"POST",
				body:JSON.stringify({"paciente":$("#paciente").val(),"database":data.database,"tipo":data.especialidad}),
				headers:{ 'Content-Type': 'application/json'}
				
			});
			var infoHistorial=await historial.json();
		
			var html='<div class="accordion" id="historialAccordion">';
			infoHistorial.forEach(historia=>{
				html+='<div class="card">';
					html+=`<div class="card-header" id="heading${historia.ind}">`;	
						html+='<h5 class="mb-0">';
						html+=`<button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${historia.ind}" aria-expanded="true" aria-controls="collapse${historia.ind}">`;
						html+='<div class="row">'
						html+='<div class="col-sm-8">'
						html+=`${historia.fecha} &#8594; ${historia.nombre}`;
						html+="</div>";
						html+='<div class="col-sm-4">';
						html+=asistio(historia.asistio);
						html+="</div>";
						html+="</div>";
						html+=`</button>`;
						html+='</h5>';
					html+='</div>';
					html+=`<div id="collapse${historia.ind}" class="collapse" aria-labelledby="heading${historia.ind}" data-parent="#historialAccordion">`;
						html+='<div class="card-body">';
						html+='<ul class="list-group bg-secondary text-dark">';
						Object.keys(historia).forEach(key=>{
							html+=`<li class="list-group-item list-group-item-success">${key} &#8594; ${historia[key]}</li>`;
						  });
						  html+='</ul>';	
						html+='</div>';
					html+='</div>';
				html+='</div>';
			});
			html+='</div>';
			$("#nav-history").empty().html(html);
		}
		else if ($(e.target).text()=="Firma Touch") {
			$("#btnFirmas").show();
			var ancho=$("#nav-signature-touch").width();
			console.log(ancho);
			$("#mycanvas").attr("width",ancho-10);
		}
		else if ($(e.target).text().includes("Evoluciones")){

		
			var evoluciones=await fetch("/evoluciones",{
				method:"POST",
				body:JSON.stringify({"database":`${data.database}`,"paciente":`${$("#paciente").val()}`}),
				headers:{ 'Content-Type': 'application/json'}

			});
			var datosEvolucion=await evoluciones.json();
			var html='<div id="accordion">';
			var k=1;
			datosEvolucion.forEach(datoEvolucion=>{
				html+=`
				<div class="card">
				<div class="card-header" id="heading${k}">
				  <h5 class="mb-0">
					<button class="btn btn-background btn-block" data-toggle="collapse" data-target="#collapse${k}" aria-expanded="true" aria-controls="collapse${k}">
					  ${datoEvolucion.fecha}<span style="color:orange;">&nbsp;&rarr;&nbsp;</span>${datoEvolucion.procedimiento}
					</button>
				  </h5>
				</div>
			
				<div id="collapse${k}" class="collapse bg-evoluciones" aria-labelledby="heading${k}" data-parent="#accordion">
				  <div class="card-body">
					<span class="font-weight-bold text-white:">Anotaciones</span>
					<div class="alert alert-background-1 text-black" role="alert">
  						${datoEvolucion.anotaciones_cita}
					</div>
					<span class="font-weight-bold text-white:">Auxiliar que atendi??</span>
					<div class="alert alert-warning" role="alert">
  						${datoEvolucion.auxiliar}
					</div>
					<span class="font-weight-bold text-white:">Profesional que atendi??</span>
					<div class="alert alert-info" role="alert">
  						${datoEvolucion.especialista}
					</div>

					<span class="font-weight-bold text-white:">Pr??xima Cita</span>
					<div class="alert alert-secondary" role="alert">
  						${datoEvolucion.proxima_cita}
					</div>
					<span class="font-weight-bold text-dark:">Fecha y Hora</span>
					<div class="alert" role="alert" style="color:black;background:linear-gradient(rgb(234,221,134),white);">
  						${new Date(datoEvolucion.fecha).toLocaleDateString("es-CO",{ weekday: "long", year: "numeric", month: "long",  
						  day: "numeric" })}&nbsp;&nbsp;${datoEvolucion.hora_salida}
					</div>
				  </div>
				</div>
			  </div>
				`;
				k++;
			});
			
			html+='</div>';
			$("#nav-evoluciones").empty().html(html);

		}
		
	  });

	(async function(){
		var response = await fetch(url+"url");
		var urls = await response.json();
	
		$("#infoUrl").text(urls.servidor);
		
	})();

	(async function(){
		try{
		var response = await fetch(url+"databases");
		var databases = await response.json();
		
		var html="<option></option>";
		var result = [];
		
		if (databases.message!=undefined){

			$("#infoUrl").text(`${databases.message}=>${databases.errno}.No se ha podido conectar con el servidor ${$("#infoUrl").text()}`);
			$("#errorcargaModal").modal("show");
		
			return;
		}
		await databases.forEach(databasfunction(e){
			    for(var i in database) 
				html+=`<option value="${database[i]}">${database[i]}</option>`
		});
		$("#database").empty().html(html);
		}catch(error){

			console.error(error);

		}
		
	})();

	var getEspecialidades = async function(){
		$(".spinner-grow-sm").removeClass("d-none");
		var response = await fetch(url+"especialidades",{
			method:"POST",
			body:JSON.stringify({'database':data.database}),
			headers:{ 'Content-Type': 'application/json'}
		});
		var especialidades = await response.json();
		
		if (especialidades.Tipo!=undefined) {
			
			$("#bodyError").html(`<span class="text-danger">${especialidades.Mensaje}</span>`)
			$("#errorEspecialidades").modal("show");
	
		}
		else{
		
		var html="<option></option>";
		await especialidades.forEach(especialidad=>{
				html+=`<option value="${especialidad.nombre}">${especialidad.descripcion}</option>`
		});
		$("#especialidad").empty().html(html);
		$(".spinner-grow-sm").addClass("d-none");
	}
		
	};

	$("#database").change(function(e){

	
		getEspecialidades();
	});
	
	$('#fechaAgenda').val(new Date().toDateInputValue());
	$('#fecha1').val(new Date().toDateInputValue());
	$('#fecha2').val(new Date().toDateInputValue());


	var getAgenda = async function(){

		try{
		var datas={fecha:$("#fechaAgenda").val(),"database":data.database,"tipo":data.especialidad};
		var response = await fetch(url+"agenda",{

			method:"POST",
			body:JSON.stringify(datas),
			headers:{ 'Content-Type': 'application/json'}

	   });
		var datos = await response.json();
		return (datos);
		}catch(error){
			console.error(error);
		}
	}
	
	
	

	var dibujaAgenda = async (datosAgenda)=>{
		
		var html="";
	   
		await datosAgenda.forEach(datoAgenda=>{
			var id="row"+datoAgenda.vhoras;
			id=id.trim();
			html+=`<tr class="text-dark" id="${id}" 
					   data-paciente="${datoAgenda.paciente}"
					   data-identificacion="${datoAgenda.identificacion}"
					   data-cara="${datoAgenda.cara}"
					   data-citasind="${datoAgenda.citasind}"
					   data-telefono="${datoAgenda.telefono}"
					   data-spin="#spin${datoAgenda.identificacion}"
					   data-procedimiento=${datoAgenda.codproc}
					   data-queagenda=${datoAgenda.queagenda}
					   >
			<td  style="background:${datoAgenda.color}" class="align-middle">

			  <h4 class="${datoAgenda.nombres!=''?datoAgenda.color=='rgb(00,00,00)'?'text-light':'text-dark':'text-white'}">${datoAgenda.vhoras}</h4>
			</td> 
			<td style="background:${datoAgenda.color}" class="align-middle">
			  
			  <div class="row align-middle">
			  		<div class="col-sm-6 align-middle"><h4 class="${datoAgenda.color=='rgb(00,00,00)'?'text-light':'text-dark'} align-middle">${datoAgenda.nombres}&nbsp;${datoAgenda.paciente}</h4></div>
					  <div class="col-sm-3 text-center">${dibujaCara(datoAgenda.cara)}</div>
					  <div class="col-sm-3">
					  
					  <div id="spin${datoAgenda.identificacion}"class="spinner-grow text-success float-right d-none" role="status"  style="width: 3rem; height: 3rem;">
					  <span class="sr-only"></span>
					</div>
					  </div>
				</div>
			</td>
			<td style="background:${datoAgenda.color}" class="align-middle">
			  <h4 class=${datoAgenda.color=='rgb(00,00,00)'?'text-light':'text-dark'}>${datoAgenda.procedimiento}</h4>
			</td>
		  </tr>`;
		});
		return(html);

	}

	var dibujaCitas = async (citas)=>{

	
        await citas.forEach(cita=>{


			var vhoras=cita.vhoras.substring(0,5)+"."+cita.consultorio;
			var index = datosAgenda.findIndex(function(item, i){
				
				return item.vhoras === vhoras;
			  });
		
			if (datosAgenda[index]!=undefined){
			datosAgenda[index].nombres=cita.nombres;
			datosAgenda[index].procedimiento=cita.procedimiento;
			datosAgenda[index].color=cita.style;
			}	
		});
		
		

	}
	
	

	$("#filtrar").click(async function(e){

	
		filtrado=!filtrado;
		
		if (filtrado){

			var datosFilter=datosAgenda.filter(datoAgenda => {
				return datoAgenda.nombres != "";
			});
	        
			$("#dataInfo").empty().html(await dibujaAgenda(datosFilter));
		}
		else
		$("#dataInfo").empty().html(await dibujaAgenda(datosAgenda));
	});
	

	$(".cimage > img").click(function(e){
		e.preventDefault();
		var img=$(e.currentTarget);
		$("#fotop2").attr("src",img.attr("src"));
		if (img.parent().siblings(".modal-title").text().trim().indexOf("Cita")==-1)
		$("#fotoModalCenterTitle").text(img.parent().siblings(".modal-title").text().trim());
		else 
		$("#fotoModalCenterTitle").text($("#pacientes option:selected").data("nombres"));
		
		
		$("#fotoModalCenter").modal().modal("show");
	})
	
	$("#asignaCitaModal").on('hidden.bs.modal', function(e) {
		
			$(spin).addClass("d-none");

	  })

	$(document).on("click","tr",async function(e){


		
		var fila=$(e.currentTarget);
		
		$("#borraFirma").click();
		$("#btnFirmas").hide();
		if ($(window).width()<600) $('#nav-signature-tab').hide();
		else $('#nav-signature-tab').show();
		var nombres = fila.children().filter((i,el)=>{
			return i==1;
		});
		spin=fila.data("spin");
		$(spin).removeClass("d-none")
	
		
		if (nombres.text().trim()!=""){
		$('.nav-tabs a:first').tab('show')
		$("#paciente").val(fila.data("paciente"));
		$("#identificacion").val(fila.data("identificacion"));
		$("#eprocedimiento").val(fila.data("procedimiento"));
		queagenda=fila.data("queagenda")=="C"?"citas":"cppre";
		$("#cara").val(fila.data("cara"));
		$("#citasind").val(fila.data("citasind"));
		$("#fechaEvolucion").val($("#fechaAgenda").val());
		$("#hora").val(new Date().toLocavarimeString('es-ES'));
		var datosF=await fetch("/datosFinancieros",{
				method:"POST",
				body:JSON.stringify({tipo:data.especialidad,paciente:$("#paciente").val(),database:data.database}),
				headers:{"Content-Type":"application/json"}
		});
		var datosFinancieros=await datosF.json();
		console.log(datosFinancieros);
		var Urls=await fetch("/urls",{
			method:"POST",
			body:JSON.stringify({tipo:data.especialidad,paciente:$("#paciente").val(),database:data.database}),
			headers:{"Content-Type":"application/json"}
		});
		var urls=await Urls.json();
		$("#onedrive").attr("href",urls[0].onedrive);
		$("#icloud").attr("href",urls[0].icloud);
		//$("#keynote").attr("href",`pacientesKeyNote/${$("#paciente").val()}.pdf`);
		try{
		$("#ct").text(parseFloat(datosFinancieros[0].saldo).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3));
		}catch(error){
			console.clear();
			console.warn(error);
		}
		$("#sce").data("paciente",$("#paciente").val());
		$("#sce").data("nombres",nombres.text().trim());
		$("#sce").data("cara",fila.data("cara"));
		$("#sce").text(nombres.text().trim());
		$("#ecara").html(dibujaCara(fila.data("cara")));
		
	
		$("#sigStringData").hide();
		$("#sigImageData").hide();
		$("#SigImg").hide();
		$("#tipo").val(data.especialidad);
		$("#gdb").val(data.database);
		$("#whatsapp").attr("href",`https://api.whatsapp.com/send?phone=${filtertel(fila.data("telefono"))}?text=Hola%20te%20escribo%20desde%20la%20clinica%20Moya%20Ortodoncia`);
		$("#telefono").attr("href",`tel://${filtertel(fila.data("telefono"))}`);
		$("#sms").attr("href",`sms:+57${filtertel(fila.data("telefono"))}`);
		var response=await fetch("/foto",{
			method:"POST",
			body:JSON.stringify({"database":data.database,"paciente":$("#paciente").val()}),
			headers:{ 'Content-Type': 'application/json'}
		});
		try{
		var fotos=await response.json();
		$("#fotop1").attr("src",fotos[0].foto);
		}catch(error){
			console.warn(error);
			return;
		}
		$("#confirma2").modal("show");
		$(spin).addClass("d-none")
		}
		else{
			$('#fotop3').attr("src","");
			$("#fechaCita").val($("#fechaAgenda").val());
			
			horas = fila.children().filter((i,el)=>{
				return i==0;
			});
			
			$("#asignaCitaModalLabel").html("Asignar Cita");
			$("#asignaCitaModalLabel").html($("#asignaCitaModalLabel").text()+` <i class="far fa-arrow-alt-circle-right" style="color:orange;"></i> ${$("#fechaCita").val()}`+" : <span style='color:aqua;'>"+horas.text().trim()+"</span>");
			createCitasModal(pacientes);
			$("#asignaCitaModal").modal({backdrop: 'static',keyboard: false}).modal("show");
		}
		
	});


	$("#reintentar").click(function(e){

		   location.reload();
	});

	$("#buscarBtn").click(async function(e){
	  
		e.preventDefault();
		if ($("input[type='search']").val()=="") return;
		var PATTERN=$("input[type='search']").val().toUpperCase();
		var datosAgendaFiltered = datosAgenda.filter(datoAgenda=> { return datoAgenda.nombres.indexOf(PATTERN) != -1; });
		
		$("#dataInfo").empty().html(await dibujaAgenda(datosAgendaFiltered));
	});

	$("input[type='search']").on("input",function(e){

	
		$("#buscarBtn").click();
	});

	//signature



	var tmr;
   
   (function onSign()
   {
	 
      var ctx = document.getElementById('cnv').getContext('2d');         
      SetDisplayXSize( 500 );
      SetDisplayYSize( 100 );
      SetTabvarState(0, tmr);
      SetJustifyMode(0);
      ClearTabvar();
      if(tmr == null)
      {
         tmr = SetTabvarState(1, ctx, 50);
      }
      else
      {
         SetTabvarState(0, tmr);
         tmr = null;
         tmr = SetTabvarState(1, ctx, 50);
      }
   });//();
   
   $("#clear").click(function(e){
      ClearTabvar();
   });
   
   function onDone()
   {
      if(NumberOfTabvarPoints() == 0)
      {
         alert("Please sign before continuing");
      }
      else
      {
         SetTabvarState(0, tmr);
         //RETURN TOPAZ-FORMAT SIGSTRING
         SetSigCompressionMode(1);
         document.FORM1.bioSigData.value=GetSigString();
         document.FORM1.sigStringData.value += GetSigString();
         //this returns the signature in Topaz's own format, with biometric information
   
   
         //RETURN BMP BYTE ARRAY CONVERTED TO BASE64 STRING
         SetImageXSize(500);
         SetImageYSize(100);
         SetImagePenWidth(5);
         GetSigImageB64(SigImageCallback);
      }
   }
   
   function SigImageCallback( str )
   {
      document.FORM1.sigImageData.value = str;
   }
   
      
  
   
   
  
   window.onunload = window.onbeforeunload = (function(){
   closingSigWeb()
   })
   
   function closingSigWeb()
   {
     // ClearTabvar();
     // SetTabvarState(0, tmr);
   }

   //fin signature
   
  

   $("#fechaAgenda").change(async function(e){
   
	$("#spinner").show();
	  
	   agendaCitas();
	   $("#spinner").hide();
	   $("#filtrar").click();

   });


    $("#getCitas").click(async function(e){

		$("#agenda").removeClass("d-none");
		$(".loadingCuadre").addClass("d-none");
		$("#frmnav").removeClass("d-none");		
		$("#btnir").removeClass("d-none");
		$("#tableData").removeClass("d-none");
		$("#parametrosCuadre").addClass("d-none");
		$(".navbar-toggler").click();
		$("#cuadreTabla").addClass("d-none");
	});



	var elcuadre=async function(e){
		$(".loadingCuadre").removeClass("d-none");
		var response=await fetch("/cuadre",{

			method:"POST",
			body:JSON.stringify({database:data.database,fecha1:$("#fecha1").val(),fecha2:$("#fecha2").val()}),
			headers:{ 'Content-Type': 'application/json'}
		}

		);
		var pagos=await response.json();
		
		if (pagos.length>0){
		var html="<table class='table table-striped table-bordered table-hover'>";
		html+="<thead class='thead-dark'>";
		html+="<tr>";
		Object.keys(pagos[0]).forEach(key=>{
			html+=`
					<th>
						${key}
					</th>
			`;

		});
		html+="</tr>";
		html+="</thead>";
		html+="<tbody>";
		pagos.forEach(pago=>{
					html+=`
							<tr>
								<td class='align-middle small'>${pago.recibo}</td>
								<td class='align-middle small'>${pago.paciente}</td>
								<td class='align-middle small'>${pago.Nombres}</td>
								<td class='align-middle small'>${pago.Descr}</td>
								<td class='text-right text-dark align-middle small' style='background:DarkSeaGreen;'>${parseFloat(pago.Valor).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</td>
							</tr>
					`;
					
					
					
		});
		html+="</tbody>";
		html+="</table>";
	
	
		$("#cuadreTabla").empty().html(html);
	
	}
	
	$(".loadingCuadre").addClass("d-none");
	
	}


	$("#btnCuadreFechas").click(function(e){
		e.preventDefault();
		elcuadre();
	});

    $("#cuadre").click(async function(e){

				$("#cuadreTabla").removeClass("d-none");
				$("#agenda").addClass("d-none");
				$("#tableData").addClass("d-none");
				$("#parametrosCuadre").removeClass("d-none");
				$("#frmnav").addClass("d-none");
				$("#btnir").addClass("d-none");
				$(".navbar-toggler").click();
				elcuadre();
				
				
				

	});



	var getCitasData = async function(){



		var datos=await fetch(url+"maps",{
			method:"POST",
			body:JSON.stringify({"database":data.database}),
			headers:{ 'Content-Type': 'application/json',
			"Access-Control-Allow-Origin":"*",
		},
			mode: 'cors'


		});
	
		mapas=await datos.json();
		var html="<option value='Todos'>Todos</option>";
		var html2="<option value='Todos'></option>";
		mapas.forEach(mapa=>{
				html+=`<option value="${mapa.auxiliar}">${mapa.nombresp}:${mapa.map}</option>`;
				html2+=`<option value="${mapa.nombresp}">${mapa.nombresp}</option>`;
		});
		$("#mapaPaciente").empty().html(html);		
		$("#evauxiliar").empty().html(html2);		
		datos=[];
		datos=await fetch(url+"getEspecialistas",{
			method:"POST",
			body:JSON.stringify({"database":data.database}),
			headers:{ 'Content-Type': 'application/json',
			"Access-Control-Allow-Origin":"*",
		}
		});
		var profesionales=await datos.json();
		console.log(profesionales);
		html2="<option value=''></option>";
		profesionales.forEach(profesional=>{
			html2+=`<option value="${profesional.nombres}">${profesional.nombres}</option>`;
		});
		$("#profesional").empty().html(html2);	
		datos=await fetch(url+"pacientes",{
			method:"POST",
			body:JSON.stringify({"database":data.database}),
			headers:{ 'Content-Type': 'application/json',
			"Access-Control-Allow-Origin":"*",
		},
			mode: 'cors'

		});
		datos=await datos.json();
		
		
		pacientes=datos[0].datos;

		html="<option></option>";
			pacientes.forEach(pacientfunction(e){
	
				html+=`<option value="${paciente.historia}:${paciente.nombres}:${paciente.identificacion}" data-nombres="${paciente.nombres}" data-historia="${paciente.historia}" data-est="${paciente.estado_paciente}">${paciente.historia}:${paciente.nombres}:${paciente.identificacion}</option>`;
		
			});
		
		$("#findpac").empty().html(html);	
		$("#pacientesMapas").empty().html(html);		
		$("#pacientesUrls").empty().html(html);
		$('#findpac').chosen({width: "95%",no_results_text: "Lo siento no pude encontrar el paciente Buscado",allow_single_deselect: true});	
		$('#pacientesMapas').chosen({width: "100%",no_results_text: "Lo siento no pude encontrar el paciente Buscado",allow_single_deselect: true});	
		
		$('#mapaPaciente').chosen({width: "100%",no_results_text: "Lo siento no pude encontrar el map Buscado",allow_single_deselect: true});	
		datos=[];	
		datos=await fetch(url+"procedimientos",{
			method:"POST",
			body:JSON.stringify({"database":data.database,"tipo":data.especialidad}),
			headers:{ 'Content-Type': 'application/json'}
		});
		procedimientos=await datos.json();
		

	}
	async function createCitasModal(Pacientes){

		$('#mapa').chosen("destroy");
		$('#pacientes').chosen("destroy");
		$('#procedimientos').chosen("destroy");
		$("#spp0").removeClass("d-none");
		$("#spp").removeClass("d-none");
		$("#sppr").removeClass("d-none");
		
		
		var html="<option value='Todos'>Todos</option>";
		mapas.forEach(mapa=>{
				html+=`<option value="${mapa.auxiliar}">${mapa.nombresp}:${mapa.map}</option>`;
		});
		$("#mapa").empty().html(html);
		$('#mapa').chosen({disable_search_threshold: 10,allow_single_deselect: true,width: "100%"});	
		$("#mapaPaciente").empty().html(html);
		$('#mapaPaciente').chosen({disable_search_threshold: 10,allow_single_deselect: true,width: "100%"});	
		
		$("#labelPacientes").text(`(Total de Pacientes de ${$("#mapa option:selected").text()} es ${pacientes.length})`);
		
		html="<option></option>";
			Pacientes.forEach(pacientfunction(e){
	
				html+=`<option value="${paciente.historia}:${paciente.nombres}:${paciente.identificacion}" data-nombres="${paciente.nombres}" data-historia="${paciente.historia}" data-est="${paciente.estado_paciente}">${paciente.historia}:${paciente.nombres}:${paciente.identificacion}</option>`;
		
			});
		
			$("#pacientes").empty().html(html);
		
			
			$('#pacientes').chosen({width: "100%",no_results_text: "Lo siento no pude encontrar el paciente Buscado",allow_single_deselect: true});	
			
			
		
		
			html="<option></option>";
			procedimientos.forEach(procedimiento=>{
	
				html+=`<option value="${procedimiento.codigo}:${procedimiento.nombre}" data-duracion="${procedimiento.duracion}">${procedimiento.codigo}:${procedimiento.nombre}:${procedimiento.duracion}</option>`;
			});
		
	
		$("#procedimientos").empty().html(html);
	
		$('#procedimientos').chosen({width: "100%",no_results_text: "Lo siento no pude encontrar el procedimiento Buscado",allow_single_deselect: true});	
		$("#mapa").trigger("chosen:updated");
		$("#procedimientos").trigger("chosen:updated");
		$("#pacientes").trigger("chosen:updated");
		$("#spp0").addClass("d-none");
		$("#spp").addClass("d-none");
		$("#sppr").addClass("d-none");
	}

	$("#mapa").chosen().change(async function(e){

				$("#spp").removeClass("d-none");
				$('#pacientes').chosen("destroy");
				$('#fotop3').attr("src","");
			
				var Pacientes=pacientes.filter(pacientfunction(e){

					 if ($(e.currentTarget).val()!="Todos")
					  return paciente.mapa==$(e.currentTarget).val();
					  else return paciente;
				})
				
			
				
				$("#labelPacientes").text(`(Total de Pacientes de ${$("#mapa option:selected").text()} es ${Pacientes.length})`);
				
				var html="<option></option>";
					Pacientes.forEach(pacientfunction(e){
			
						html+=`<option value="${paciente.historia}:${paciente.nombres}:${paciente.identificacion}" data-nombres="${paciente.nombres}" data-historia="${paciente.historia}" data-est="${paciente.estado_paciente}">${paciente.historia}:${paciente.nombres}:${paciente.identificacion}</option>`;
				
					});
				
					$("#pacientes").empty().html(html);
					$('#pacientes').chosen({no_results_text: "Lo siento no pude encontrar el paciente Buscado",allow_single_deselect: true});	
					$("#pacientes").trigger("chossen:updated");
					
					$("#spp").addClass("d-none");
				
				
	});


	

	$("#pacientes").chosen().change(async function(e){

		$('#fotop3').attr("src","");
		var paciente=$("#pacientes option:selected" ).data('historia');
	
		var response=await fetch("/foto",{
			method:"POST",
			body:JSON.stringify({"database":data.database,"paciente":paciente}),
			headers:{ 'Content-Type': 'application/json'}
		});
		var fotos=await response.json();
	
		$(".cimage").removeClass("d-none")
		try{
		$("#fotop3").attr("src",fotos[0].foto);

		}catch(error){

			$(".cimage").addClass("d-none")

		}

	});

	$('#asignaCitaModal').on('shown.bs.modal',async function(e) {
	
		
		//$('#pacientes').chosen();
		//$("#pacientes").trigger("chosen:updated");
	
		
	  });
/*
	  interact('#asignaCitaModal')
	  .draggable({
		// enable inertial throwing
		inertia: true,
		// keep the element within the area of it's parent
		modifiers: [
		  interact.modifiers.restrictRect({
			restriction: 'none',
			endOnly: true
		  })
		],
		// enable autoScroll
		autoScroll: true,
		listeners: {
			// call this function on every dragmove event
			move: dragMoveListener,
	  
			// call this function on every dragend event
			end (event) {
			  var textEl = event.target.querySelector('p')
	  
			  textEl && (textEl.textContent =
				'moved a distance of ' +
				(Math.sqrt(Math.pow(event.pageX - event.x0, 2) +
						   Math.pow(event.pageY - event.y0, 2) | 0))
				  .toFixed(2) + 'px')
			}
		  }
		});

		function dragMoveListener (event) {

			var target = event.target
			// keep the dragged position in the data-x/data-y attributes
			var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
			var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

			// translate the element
			target.style.webkitTransform =
				target.style.transform =
				'translate(' + x + 'px, ' + y + 'px)'

			// update the posiion attributes
			target.setAttribute('data-x', x)
			target.setAttribute('data-y', y)
			
		  }
		  
		  // this function is used later in the resizing and gesture demos
		  window.dragMoveListener = dragMoveListener
*/

		  var reverse=(s)=>{
			return s.split("").reverse().join("");
		}

		  	
  	     $("#frmAsignaCita").submit(async function(e){

						e.preventDefault();
						$("#horasCita").val(horas.text().trim());
						var str=$("#pacientes").val();
						var prs=$("#procedimientos").val();
						if ((str=="")||(prs=="")){ 
							$("#errorPaciente").modal({backdrop: 'static',keyboard: false}).modal("show");
						}
						else{
						var est=$("#pacientes option:selected" ).data('est');
					
						
						if (est=="PACIENTE") $("#ctable").val("citas");
						else $("#ctable").val("cppre");	
					
						var index1=str.indexOf(":");
						$("#pacienteCita").val(str.trim().substring(0,index1));
						var index2=reverse(str).indexOf(":");
						$("#identificacionCita").val(str.trim().substring(str.length-index2,str.length));
						str=$("#procedimientos").val();
						var index3=str.indexOf(":");
						$("#procedimientoCita").val(str.trim().substring(0,index3));
						var duracion=$("#procedimientos option:selected" ).data('duracion');
						$("#duracionCita").val(duracion);
						var vho=$("#horasCita").val();
					
						$("#horasCita").val($("#horasCita").val().substring(0,5));
						$("#vhorasCita").val($("#horasCita").val()+":00");
						
						$("#consultorioCita").val(vho.substring(vho.length-1,vho.length));
						//$("#frmDatabase").val($("#database").val());
						var ampm=parseInt(vho.substring(0,2));
						if (ampm<12) $("#horasCita").val($("#horasCita").val()+" am");
						else{
							  ampm-=12;	
						      $("#horasCita").val((ampm<9?"0"+ampm:ampm)+":"+vho.substring(3,5)+" pm");
						}
						$("#fecha_pide_cita").val(new Date().toDateInputValue());
						var time=new Date();
						$("#hora_pide_cita").val(`${time.getHours()<10?"0"+time.getHours():time.getHours()}:${time.getMinutes()<10?"0"+time.getMinutes():time.getMinutes()}:${time.getSeconds()<10?"0"+time.getSeconds():time.getSeconds()}`);
						$("#dadapor").val(dadapor);
						$("#frmTipo").val(data.especialidad);
						var data=$(e.currentTarget).serializeObject();
						var jsontext="{";
						await $.each(data,(i,k)=>{
						
							jsontext+='"'+i+'":"'+k+'",';
						
						});
						jsontext=jsontext.replace(/.$/,"}");
					
						var datosC={
							database:data.database,
							fecha:$("#fechaCita").val(),
							hora:$("#vhorasCita").val(),
							procedimiento:$("#procedimientoCita").val(),
							consultorio:$("#consultorioCita").val(),
							tipo:$("#frmTipo").val()
						}
						datosC=JSON.stringify(datosC);
					
						
						var response=await fetch("/cabecita",{
							method:"POST",
							body:datosC,
							headers:{ 'Content-Type': 'application/json'}
						});
						var cabecita=await response.json();
					
						datosC=$(e.currentTarget).serializeObject();
						if (cabecita[0].Cabe=="Si"){
						var response=await fetch(url+"guardaCita",{
							method:"POST",
						//	body:JSON.stringify(datosC),
							body:jsontext,
							headers:{ 'Content-Type': 'application/json'}
						});
						var info=await response.json();
					
						$("#asignaCitaModal").modal("hide");
						agendaCitas(true);
						$(spin).addClass("d-none");
						}
						else{
							agendaCitas();
	   						$("#cabecita").modal({backdrop: 'static',keyboard: false}).modal("show");
						}
					}
		  });


		  $.fn.datepicker.dates['es'] = {
			days: ['Domingo', 'Lunes', 'Martes', 'Mi??rcoles', 'Jueves', 'Viernes', 'S??bado'],
			daysShort: ['Dom', 'Lun', 'Mar', 'Mi??', 'Jue', 'Vie', 'S??b'],
			daysMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sa'],
			months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			monthsShort: ["Ene", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			today: "Hoy",
			clear: "Limpiar",
			format: "yyyy-mm-dd",
			titleFormat: "MM yyyy", /* Leverages same syntax as 'format' */
			weekStart: 0,
			autoclose:true
		};
		
		  $("input[id^='fecha']").datepicker({ language:'es',autoclose:true,disabvarouchKeyboard:true,todayBtn:true,todayHighlight:true});
	
		  
		  $(document).on("click",".cestc",async function(e){

			
				var nombres=$(e.currentTarget).data("nombres");
				var cara=$(e.currentTarget).data("cara");
				var paciente=$(e.currentTarget).data("paciente");
				var response=await fetch(url+"estadoCuenta",{
					method:"POST",
					body:JSON.stringify({"database":data.database,"paciente":$(e.currentTarget).data("paciente"),"tipo":data.especialidad}),
					headers:{ 'Content-Type': 'application/json'}
		
				});
				var estadoCuenta=await response.json();
			
				console.log(estadoCuenta);
				var infoF=estadoCuenta[0].Financiera;
				var Saldo=estadoCuenta[0].Saldo;
				var htmlF=`
							
							<div class="card-header text-white">
							Informaci??n Financiera
							</div>
							<ul class="list-group">
							<li class="list-group-item m-0 px-4 py-0">
								<div class='row'>
									<div class="col-8">
										<span class="text-info">Costo Tratamiento</span>
									</div>
									<div class="col-4">
										<span class="text-success  float-right">${parseFloat(infoF.costo_tratamiento).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</span>
									</div>
								</div>
									
							</li>
							<li class="list-group-item m-0 px-4 py-0">
									<div class='row'>
										<div class="col-8">
											<span class="text-warning">Cuota Inicial 1</span>
										</div>
										<div class="col-4">
											<span class="text-success  float-right">${parseFloat(infoF.cuota_inicial1).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</span>
										</div>
									</div>
							</li>
							<li class="list-group-item m-0 px-4 py-0">
										<div class='row'>
											<div class="col-8">
												<span class="text-warning">Cuota Inicial 2</span>
											</div>
											<div class="col-4">
												<span class="text-success float-right">${parseFloat(infoF.cuota_inicial2).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</span>
											</div>
										</div>							
							</li>
							<li class="list-group-item m-0 px-4 py-0">
										<div class='row'>
											<div class="col-8">
												<span class="text-warning">Cuota Inicial 3</span>
											</div>
											<div class="col-4">
												<span class="text-success float-right">${parseFloat(infoF.cuota_inicial3).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</span>
											</div>
										</div>							
							</li>	
							<li class="list-group-item m-0 px-4 py-0">
										<div class='row'>
											<div class="col-8">
												<span class="text-warning">Cuota Inicial 4</span>
											</div>
											<div class="col-4">
												<span class="text-success float-right">${parseFloat(infoF.cuota_inicial4).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</span>
											</div>
										</div>							
							</li>
							<li class="list-group-item m-0 px-4 py-0">
										<div class='row'>
											<div class="col-8">
												<span style="color:GreenYellow;">N??mero de Cuotas</span>
											</div>
											<div class="col-4">
												<span class="text-success float-right">${infoF.nocuotas}</span>
											</div>
										</div>							
							</li>
							<li class="list-group-item m-0 px-4 py-0">
										<div class='row'>
											<div class="col-8">
												<span style="color:GreenYellow;">Valor Cuota</span>
											</div>
											<div class="col-4">
												<span class="text-success float-right">${parseFloat(infoF.valor_cuota).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</span>
											</div>
										</div>							
							</li>
							<li class="list-group-item m-0 px-4 py-0">
							<div class='row'>
								<div class="col-8">
									<span style="color:LemonChiffon;">Total Abonado</span>
								</div>
								<div class="col-4">
									<span class="text-success float-right">${parseFloat(Saldo.abonado).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</span>
								</div>
							</div>							
							</li>
							<li class="list-group-item m-0 px-4 py-0">
							<div class='row'>
								<div class="col-8">
									<span style="color:LemonChiffon;">Saldo</span>
								</div>
								<div class="col-4">
									<span class="text-success float-right">${parseFloat(Saldo.saldo).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</span>
								</div>
							</div>							
							</li>							
							</ul>
						
				`;
				$("#infoFinanciera").empty().html(htmlF);
				var html="";
				var i=0;
				estadoCuenta[0].Pagos.forEach(cuenta=>{

					if (i % 2 == 0)
					html+="<tr class='table-secondary'>";
					else
					html+="<tr class='table-success'>";
					html+=`

							<td scope="col" class="align-middle small">${cuenta.recibo}</td>
							<td scope="col" class="align-middle small">${cuenta.fecha}</td>
							<td scope="col" class="align-middle small">${cuenta.hora}</td>
							<td scope="col" class='text-right align-middle small'>${parseFloat(cuenta.valor_abono).toLocaleString('es-CO',{style:'currency',currency:'COP'}).slice(0,-3)}</td>
							<td scope="col" class="align-middle small">${cuenta.forma_de_pago}</td>
							<td scope="col" class="align-middle small">${cuenta.items}</td>
					
					`;
					html+="</tr>";
					i++;
				});
				
				$("#datosEC").empty().html(html);
			
				$("#estadoCuentaModalCenterTitle").text(nombres+" "+paciente);
				$("#estadoCuentaModalCenterTitle").append(`<div class="col-sm-3 text-center">${dibujaCara(cara)}</div>`);
				$("#estadoCuentaModalCenter").modal().modal("show");
		  });


	$("#maps").click(function(e){

		$(".navbar-toggler").click();
		$("#mapaModalCenter").modal().modal("show");	

	});	  


	$("#urls").click(function(e){

		$(".navbar-toggler").click();
		$("input[name='database']").val();
		$("#urlModalCenter").modal().modal("show");	

	});


	$("#urlModalCenter").on('show.bs.modal', function(e) {
	
		$("#pacientesUrls").chosen("destroy");
		$("#pacientesUrls").chosen({width: "100%",no_results_text: "Lo siento no pude encontrar el procedimiento Buscado",allow_single_deselect: true});	

		
		
  });

  $("#pacientesUrls").chosen().change(async function(e){

	var historia=$("#pacientesUrls option:selected").data("historia");
	data.paciente=historia;
	$("#urlspin").removeClass("d-none");
	
	var response=await fetch(url+"urls",{
		method:"POST",
		body:JSON.stringify({database:data.database,paciente:historia}),
		headers:{"Content-Type":"application/json"}

	});
	var urls=await response.json();
	try {
		$("#onedriveurl").val(urls[0].onedrive);
		$("#icloudurl").val(urls[0].icloud);
	} catch (error) {
		console.clear();
		console.error(error);
	}


	$("#urlspin").addClass("d-none");

});

	$("#mapaModalCenter").on('show.bs.modal', function(e) {
	
		$("#pacientesMapas").chosen("destroy");
		$("#pacientesMapas").chosen({width: "100%",no_results_text: "Lo siento no pude encontrar el procedimiento Buscado",allow_single_deselect: true});	

		
		
  })
	$("#pacientesMapas").chosen().change(async function(e){

		var historia=$("#pacientesMapas option:selected").data("historia");
		$("#mpspin").removeClass("d-none");
		
		var response=await fetch(url+"getMapaPaciente",{
			method:"POST",
			body:JSON.stringify({database:data.database,historia:historia}),
			headers:{"Content-Type":"application/json"}

		});
		var mapa=await response.json();
		try{
		$("#mapActual").text("Mapa Actual :"+mapa[0].nombresp);
		}catch(error){
			console.log(error);
			$("#mapActual").text("Mapa Actual :Sin mapa asignado");
		}	
		$("#mpspin").addClass("d-none");

});

$("#frmMapas").submit(async function(e){

	e.preventDefault();
	var response=await fetch(url+"setMapaPaciente",{
		method:"POST",
		body:JSON.stringify({database:data.database,historia:$("#pacientesMapas").val(),map:$("#mapaPaciente option:selected").val()}),
		headers:{"Content-Type":"application/json"}
	});
	var data=await response.json();
	$("#mapaModalCenter").modal("hide");
});

$("#frmUrls").submit(async function(e){

	e.preventDefault();
	console.log($(e.currentTarget).serializeObject());
	var response=await fetch(url+"setUrlsPaciente",{
		method:"POST",
		body:JSON.stringify($(e.currentTarget).serializeObject()),
		headers:{"Content-Type":"application/json"}
	});
	var data=await response.json();
	$(e.currentTarget)[0].reset();
	$("#urlModalCenter").modal("hide");
	$(".toast").toast().toast("show");
});
	

$("#btnListadoMapas").click(async function(e){

	e.preventDefault();
	var response=await fetch(url+"listadoMapas",{

			method:"POST",
			body:JSON.stringify({database:data.database}),
			headers:{"Content-Type":"application/json"}

	});
	var listadoMapas=await response.json();
	var html="";
	listadoMapas.forEach(mapa=>{

				html+=`
				
							<tr scope="row">
								<td>${mapa.historia}</td>
								<td>${mapa.nombres}</td>
								<td>${mapa.mapa}</td>
							</tr>
				
				`;
	});
	$("#listadoBody").empty().html(html);

	
});

	
$("#onedrive,#icloud").click(async function(e){

	e.preventDefault();
	var url=$(e.currentTarget).attr("href");
	console.log("url:",url);
	console.log($(e.currentTarget).attr("id"));
	if (url==="") {
		
		$("#noUrls").modal().modal("show");
	}
	else if($(e.currentTarget).attr("id")==="keynote") {
		try{
		var response = await fetch(url);			
		console.log(response.statusText);
		if (response.statusText==="Not Found"){
			$("#noUrls").modal().modal("show");	
		}
		else window.open(url,"_blank");
	}catch(error){
		
		
		console.warn(error.name);
	    console.warn(error.message);
		if (error.message==="Failed to fetch"){
			window.open(url,"_blank");
		}
		
	}
	}
	else window.open(url,"_blank");
});
		 

$(".findPac").click(function(e){
	$("#modalFindPac").modal().modal("show");
});

$('#modalFindPac').on('shown.bs.modal', function (e) {
	$(e.target).find('[autofocus]').focus();
  });



  var findPac = async frm=>{
	var response = await fetch(url+"busquedaPacientes",{
			method:"POST",
			body:JSON.stringify(frm.serializeObject()),
			headers:{"Content-Type":"application/json"}
	});
	var pacientes = await response.json();
	var html="";
	pacientes.forEach(pacientfunction(e){
		html+=`
				<tr>
					<a href="#!">
					<td>
						${paciente.historia}
					</td>
					<td>
						${paciente.identificacion}
					</td>
					<td>
						${paciente.nombres}
					</td>
					</a>
				</tr>
		`;
	});
	$("#tfindPac").empty().html(html);
  }

$("#frmBusqueda").submit(async function(e){
	e.preventDefault();
	findPac($(e.currentTarget));
	
});

$("#criterio").on("input",function(e){
	if ($(e.currentTarget).val().length>3)
	$("#frmBusqueda").submit();	
	else $("#tfindPac").empty();
});



var getDataImgPswp = async function(e){


	var response = await fetch(url+"viewer",{
		method:"POST",
		body:JSON.stringify({paciente:$("#paciente").val()}),
		headers:{"Content-Type":"application/json"}
	});
	var files = await response.json();
	console.log(files);
	
	var htmlpswp="";
	
	Object.keys(files).forEach(k=>{
		if ((files[k].indexOf("jpg")>0)||(files[k].indexOf("png"))){
	
	
		htmlpswp+=`
		<figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
		<a href="keynote/${$("#paciente").val()}/${files[k]}" itemprop="contentUrl" data-size="4000x2250">
			<img src="keynote/${$("#paciente").val()}/Compressed/${files[k]}" itemprop="thumbnail" alt="Image description" />
		</a>
		<figcaption itemprop="caption description"></figcaption>
		</figure>
		`;
		}
	
	});
	console.clear();
	
	
	$(".my-gallery").empty().html(htmlpswp);

}

$("#keynote").click(async function(e){

	e.preventDefault();
	var response = await fetch(url+"viewer",{
		method:"POST",
		body:JSON.stringify({paciente:$("#paciente").val()}),
		headers:{"Content-Type":"application/json"}
	});
	var files = await response.json();
	console.log(files);
	var html="";
	var htmlt="";
	
	Object.keys(files).forEach(k=>{
		if ((files[k].indexOf("jpg")>0)||(files[k].indexOf("png"))){
	
		html+=`
			<div class="swiper-slide m-0 p-0"><img src="keynote/${$("#paciente").val()}/Compressed/${files[k]}" alt="image${k}" class="img-fluid swipper-img fullscreen" id="fs-toggle${k}"></div>
		`;
		htmlt+=`
			<div class="swiper-slide"><img src="keynote/${$("#paciente").val()}/Compressed/${files[k]}" alt="image${k}" class="img-fluid swipper-img fullscreen" ></div>
		`;
	
		}
	
	});
	console.clear();
	
	$(".swiper-wrapper").empty().html(html);	
	
	if (typeof galleryTop !== 'undefined') {
		galleryTop.destroy();
	  }
	if (typeof galleryThumbs !== 'undefined') {
		galleryThumbs.destroy();
	  }
	$(".container-swipe").removeClass("d-none");
	var galleryThumbs = new Swiper('.gallery-thumbs', {
	//	lazy:true,
		spaceBetween: 10,
		slidesPerView: 8,
		loop:true,
		freeMode: true,
		watchSlidesVisibility: true,
		watchSlidesProgress: true,
		
	  });
	var galleryTop = new Swiper('.gallery-top', {
	//	lazy: true,
		keyboard: {
			enabled: true,
		  },
		pagination: {
		  el: '.swiper-pagination',
		  clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		  },
		  mousewheel: true,
		  thumbs: {
			swiper: galleryThumbs
		  }
	  });
	  $("#swipeModalCenter").modal().modal("show");
	 
});





	
$(document).on("dblclick","[id^=fs-toggle]",function(e){

	$("#swipeModalCenter").modal("hide");
	galleryThumbs.destroy();
	galleryTop.destroy();

		
});


$(document).on("click","[id^=fs-toggle]",function(e){

	console.log("......");
	if (!document.fullscreenElement)
	makeFullScreen($(e.currentTarget).attr("id"));
	else closeFullscreen();
	
});

$(document).keyup(function(e) {
	if (e.key === "Escape") { 
		
		$("#swipeModalCenter").modal("hide");
	
   }
});


function makeFullScreen(image) {
	
  
  var divObj = document.getElementById(image);
  
 if (divObj.requestFullscreen) {
   divObj.requestFullscreen();
 }
 else if (divObj.msRequestFullscreen) {
   divObj.msRequestFullscreen();               
 }
 else if (divObj.mozRequestFullScreen) {
   divObj.mozRequestFullScreen();      
 }
 else if (divObj.webkitRequestFullscreen) {
   divObj.webkitRequestFullscreen();       
 } 
 else if (divObj.webkitEnterFullscreen) {
	divObj.webkitEnterFullscreen();       
  } 
 else {
	 alert("Fullscreen API is not supported");
   console.log("Fullscreen API is not supported");
 } 

}

function closeFullscreen() {
	
	
	if (document.fullscreenElement){
	if (document.exitFullscreen) {
	  document.exitFullscreen();
	} else if (document.mozCancelFullScreen) { /* Firefox */
	  document.mozCancelFullScreen();
	} else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
	  document.webkitExitFullscreen();
	} else if (document.msExitFullscreen) { /* IE/Edge */
	  document.msExitFullscreen();
	}
	}	

}

$(document).on("click","#ecara",async function(e){

	await getDataImgPswp();
	initPhotoSwipeFromDOM('.my-gallery');
	$("#pswpModalCenter").modal().modal("show");
	

});


$(".datepicker-days").css("font-size","25px");


});