var database;
var tipo;
var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var reload = require('reload');
var logger = require('morgan');
var app = express();
var path = require('path');
var os = require('os');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
var cors = require('cors');
const param = require('jquery-param');
var FormData = require('form-data');
var ifaces = os.networkInterfaces();
const fs = require('fs');
var iddata = {};
app.use('/', express.static(__dirname + '/public'));
app.use('/caras', express.static(__dirname + '/public/assets/caras'));
app.use('/imagenes', express.static(__dirname + '/public/assets/imagenes'));
app.use('/keynote', express.static(__dirname + '/public/pacientesKeyNote'));
app.use(bodyParser.json());
app.use(cors());
//app.use(logger('combined'));
app.set('port', process.env.PORT || 3000);
const directoryPath = path.join(__dirname, '/public/pacientesKeyNote');

app.get('/', function (req, res) {
  res.sendFile('index.html');
});

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});


//const URL = "http://127.0.0.1/adoweb/php/";
const URL = "http://192.168.0.9/adoweb/php/";
//const URL = "https://adoweb.ngrok.io/adoweb/php/";
const getData = async (file, params) => {

  console.log(file);
  console.log("data:", params);
  try {
    const response = await fetch(`${URL}${file}.php`, {
      method: "POST",
      body: params,

    });

    return (await response.json());
  } catch (error) {
    console.error(error.message);

  }
}



const setParams = (req) => {

  const params = new URLSearchParams();
  Object.keys(req.body).forEach(key => {
    params.append(key, req.body[key]);
  });
  return (params);

}

const setParams2 = (req) => {


  let result = "{"
  Object.keys(req.body).forEach(key => {

    result += `"${key}":"${req.body[key]}",`;

  });
  result = result.slice(0, -1);
  result += "}";
  return (result);

}


app.post('/urls', async (req, res) => {

  let params = param(req.body);
  console.log("Parametros de urls:", params);
  try {
    let response = await fetch(`${URL}getUrls.php?`, {
      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }
    });
    let urls = await response.json();
    console.log(urls);
    res.send(urls);
  } catch (error) {
    console.error(error);
    res.send(error);
  }

});


app.post('/confirmarP', async (req, res) => {

  let params = param(req.body);
  console.log("Parametros de confirmar:", setParams2(req));
  try {
    let response = await fetch(`${URL}confirmar.php?`, {
      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }
    });
    let datos = await response.json();
    console.log(datos);
    res.send(datos);
  } catch (error) {
    console.error(error);
    res.send(error);
  }

});


app.post('/cancelarP', async (req, res) => {

  console.log(req.body);
  console.log("Parametros de cancelar:", setParams2(req));
  try {
    let response = await fetch(`${URL}cancelar.php?`, {
      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }
    });
    let datos = await response.json();
    console.log(datos);
    res.send(datos);
  } catch (error) {
    console.error(error);
    res.send(error);
  }

});



app.post('/citas', async (req, res) => {


  console.log("Remote Ip:" + req.connection.remoteAddress);
  console.log(`Request:`);
  console.log(req.body);
  let params = param(req.body);
  console.log(params);
  res.send(await getData("getCitas_", setParams(req)));

});

app.post('/citas2', async (req, res) => {


  console.log("Remote Ip:" + req.connection.remoteAddress);
  console.log(`Request:`);
  console.log(req.body);
  let params = param(req.body);
  console.log(params);
  res.send(await getData("getCitas2_", setParams(req)));

});

app.post('/maps', async (req, res) => {

  let params = param(req.body);
  console.log("Parametros de maps:", params);
  try {
    let response = await fetch(`${URL}get_maps.php?${params}`);
    let maps = await response.json();
    console.log(maps);
    res.send(maps);
  } catch (error) {
    console.error(error);
    res.send(error);
  }

});


app.post('/setUrlsPaciente', async (req, res) => {


  console.log('Parametros :', setParams2(req));

  try {
    let response = await fetch(`${URL}setUrlsPaciente.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
}
);

app.post('/foto', async (req, res) => {


  let params = param(req.body);
  console.log(params);
  try {
    console.log(`${URL}get_foto.php?${params}`);
    let response = await fetch(`${URL}get_foto.php?${params}`);

    res.send(await response.json());
  } catch (error) {
    console.error(error);
    res.send(error);
  }

});


app.post('/pacientes', async (req, res) => {

  let params = param(req.body);
  console.log("Parametros de pacientes:", params);
  try {
    let response = await fetch(`${URL}get_pacientes.php?${params}`);
    let pacientes = await response.json();
    console.log(pacientes);
    res.send(pacientes);
  } catch (error) {
    console.error(error);
    res.send({ "Mensaje": "Hay un error en el php", "error": error });
  }

});

app.post('/procedimientos', async (req, res) => {

  let params = param(req.body);
  console.log("Params:");
  console.log(params);
  try {
    let response = await fetch(`${URL}get_procedimientos.php?${params}`);
    let procedimientos = await response.json();

    res.send(procedimientos);
  } catch (error) {
    console.error(error);
  }

});

app.post('/agenda', async (req, res) => {

  try {
    res.send(await getData("agenda", setParams(req)));
  } catch (error) {
    res.send([{ "error": error.message }]);
  }

});

app.post("/getHistorial", async (req, res) => {



  try {
    let response = await fetch(`${URL}get_historial.php`, {
      method: "POST",
      body: setParams(req)
    });
    let historial = await response.json();

    res.send(historial);
  } catch (error) {

  }
});

app.post("/datosFinancieros", async (req, res) => {


  console.log(setParams2(req));
  try {
    let response = await fetch(`${URL}getDatosFinancieros.php`, {
      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }
    });
    let datosFinancieros = await response.json();

    res.send(datosFinancieros);
  } catch (error) {

  }
});



app.post("/guardaEvolucion", async (req, res) => {



  // console.log(setParams(req));
  let response = await fetch(`${URL}guardarv2.php`, {

    method: "POST",
    body: setParams2(req)


  });
  let data = await response.json()
  res.send(data);


});


app.post('/cabecita', async (req, res) => {

  console.log(setParams(req));
  let params = param(req.body);
  console.log(params);

  let response = await fetch(`${URL}cabecita.php`, {

    method: "POST",
    body: setParams(req)


  });
  let data = await response.json()
  res.send(data);



});

app.post("/guardaCita", async (req, res) => {


  console.log('Parametros Citas', setParams2(req));

  try {
    let response = await fetch(`${URL}guardarv2.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
});


app.post("/actuaCita", async (req, res) => {


  console.log('Parametros Citas', setParams2(req));

  try {
    let response = await fetch(`${URL}actuaCita.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
});


app.post("/estadoCuenta", async (req, res) => {


  console.log('Parametros :', setParams2(req));

  try {
    let response = await fetch(`${URL}get_estadoCuenta.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
});


app.post("/getMapaPaciente", async (req, res) => {


  console.log('Parametros :', setParams2(req));

  try {
    let response = await fetch(`${URL}getMapaPaciente.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
});


app.post("/getEspecialistas", async (req, res) => {


  console.log('Parametros :', setParams2(req));

  try {
    let response = await fetch(`${URL}get_especialistas.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
});



app.post("/listadoMapas", async (req, res) => {


  console.log('Parametros :', setParams2(req));

  try {
    let response = await fetch(`${URL}getListadoMapas.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
});

app.post("/setMapaPaciente", async (req, res) => {


  console.log('Parametros :', setParams2(req));

  try {
    let response = await fetch(`${URL}setMapaPaciente.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
});


app.post("/busquedaPacientes", async (req, res) => {


  console.log('Parametros :', setParams2(req));

  try {
    let response = await fetch(`${URL}busquedaPacientes.php`, {

      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }


    });
    let data = await response.json();
    console.log(data);
    res.send(data);
  }
  catch (error) {
    console.log("Error=", error);
    res.send({ "error": error });
  }
});

app.post("/login", async (req, res) => {

  let params = param(req.body);
  console.log("Params:");
  console.log(params);
  /*let response=await fetch(`${URL}login.php`,{

    method:"GET",
    body:setParams(req)
   });*/
  console.log(`${URL}login.php?${params}`);
  let response = await fetch(`${URL}login.php?${params}`)
  let datosLogin = await response.json();
  console.log("Login:");
  console.log(datosLogin);

  res.send(datosLogin);

});


app.get('/url', async (req, res) => {

  res.send({ "servidor": URL });
});


app.get('/databases', async (req, res) => {

  try {
    let response = await fetch(`${URL}getDatabases.php`);
    let databases = await response.json();
    console.log(databases);
    res.send(databases);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post('/especialidades', async (req, res) => {

  try {
    console.log("eq:", setParams2(req));
    let response = await fetch(`${URL}getEspecialidades.php`, {
      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }
    });
    let especialidades = await response.json();
    console.log(especialidades);
    res.send(especialidades);
  } catch (error) {
    console.log(error);
  }
});


app.post('/causa_externa', async (req, res) => {

  let response = await fetch(`${URL}causa_externa.php?${param(req.body)}`);
  let causas_externas = await response.json();
  //console.log(causas_externas);
  res.send(causas_externas);

});

app.post('/diagnosticos', async (req, res) => {

  let response = await fetch(`${URL}diagnosticos.php?${param(req.body)}`);
  let diagnosticos = await response.json();
  //console.log(diagnosticos);
  res.send(diagnosticos);

});

app.post('/evoluciones', async (req, res) => {

  console.log(setParams(req));
  let response = await fetch(`${URL}get_evolucion.php`, {
    method: "POST",
    body: setParams(req)
  });
  let evoluciones = await response.json();
  console.log(evoluciones);
  res.send(evoluciones);

});



app.post("/cuadre", async (req, res) => {

  let params = param(req.body);
  console.log(params);
  try {
    let response = await fetch(`${URL}getCuadre.php?${params}`);
    let datos = await response.json();
    console.log(datos);
    res.send(datos);
  } catch (error) {
    console.log(error);
    res.send({ "data": "No hay Datos", "mensaje": "Ha ocurrido un error", error: error });
  }
});


app.post("/dataPac", async (req, res) => {

  try {
    console.log("eq:", setParams2(req));
    let response = await fetch(`${URL}getDataPac.php`, {
      method: "POST",
      body: setParams2(req),
      headers: { "Content-Type": "application/json" }
    });
    let especialidades = await response.json();
    console.log(especialidades);
    res.send(especialidades);
  } catch (error) {
    console.log(error);
  }
});



app.post("/viewer", async (req, res) => {

  console.log(req.body.paciente);
  let dir = path.join(directoryPath, req.body.paciente, "Compressed");
  console.log(dir);
  fs.readdir(dir, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files = files.map(function (fileName) {
      if (fileName != "Compressed")
        return {
          name: fileName,
          time: fs.statSync(dir + '/' + fileName).mtime.getTime(),
          ls: parseInt(fileName.substring(fileName.indexOf("-"), fileName.indexOf(".")))
        };
    })
      .sort(function (a, b) {
        return b.ls - a.ls;
      })
      .map(function (v) {
        return v.name;
      });
    console.log(files);
    jsonfiles = { ...files }
    console.log(jsonfiles);


    res.send(jsonfiles);

  });

});

var server = http.createServer(app);
/*
var io = require('socket.io')(server);


io.on('connection', function(socket){
  console.log('a user connected');
  
  console.log('referer:',socket.handshake.headers.referer);
  console.log('User agent:',socket.handshake.headers['user-agent']);
  console.log('Remote Address:=>',socket.handshake.address);
  socket.broadcast.emit('hi');
  socket.on('disconnect', ()=>{
    console.log('user disconnected');
  });

  socket.on('message', function(msg){
    console.log('message: ' + msg);
  });

  io.emit('data', iddata);


});*/

app.post('/laser', (req, res) => {


  console.log(req.body);
  io.emit("data", req.body);
  res.send(req.body);
});

reload(app).then(function (reloadReturned) {
  // reloadReturned is documented in the returns API in the README

  // Reload started, start web server
  server.listen(app.get('port'), function () {
    console.log('Web server listening on port ' + app.get('port'))
  })
}).catch(function (err) {
  console.error('Reload could not start, could not start server/sample app', err)
});
  /*
app.listen(8080,()=>{


  console.log("Server on port 8080");


});*/