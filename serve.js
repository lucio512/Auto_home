/**
 * iniciando e instanciando as bibiliotecas 
 */

 var http = require('http').createServer(servidor);
 var fs = require('fs');
 var io = require('socket.io').listen(http);
 var five = require('johnny-five');

//Define uma lib do johnny-five
var Fn = five.Fn;
// define uma placa arduino automaticamente
var arduino = new five.Board();

/**
 * arduino.on inicializa o arduino
 */
 arduino.on('ready', function(){
 	console.log("Arduino conectado!");

//indicando que o sensor está na porta analogica A0
 var sensorTemp = new five.Sensor("A0").scale([0, 100]);
     
     //definindo variaveis do projeto 
     var led;
     var ventilador;
     
     ventilador = new five.Led(6);
     led = new five.Led(7);
     
     //aqui começa a comunicação servidor e webpage 
     io.on('connection', function(socket){
      
         //quando socket.on receber 'ledON' ele liga o reley na porta 7
         socket.on('ledON', function (data) {
    
        led.on();
  });
     socket.on('ledOFF', function (data) {
    
         led.off();
  });
         
         socket.on('vON', function (data) {
    
         ventilador.on();
  });
         
         socket.on('vOFF', function (data) {
    
         ventilador.off();
  });
});
    

 /**
 * sensorTemp.on - Envia os valores lidos pelo sensor, para o socket.io exibir na pagina html..
 * io.emit - envia dados.
 * toFixed() - Arendondamento de valores.
 */
 sensorTemp.on('change', function(){
 	io.emit('sensorTemp', this.value.toFixed() + '°C');
 });

});

/**
 * servidor - instancia o servidor
 */
 function servidor(req, res){
 	res.writeHead(200);
 	res.end(fs.readFileSync('index.html'));
     //cria um log no terminal quan um cliente conecta no servidor
     console.log("Cliente conectado!");
 };

var port = '4000';

 http.listen(port, function(){
 	console.log("Servidor abero na porta:" + port);
 	console.log("Para sair Ctrl+C");
 });