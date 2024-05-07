var CONFIG = require("./config.json")

(function () {
    var client = window.ZAFClient.init();
    client.invoke('resize', { width: '100%', height: '200px' });

    client.get('ticket.requester.id').then(
        function(data) {
          var user_id = data['ticket.requester.id'];
          console.log('Requester id is ' + user_id);
        }
    );

    client.get('ticket.subject').then(
        function(data) {
            var subject = data['ticket.subject'];
            console.log('and the subject is ' + subject);
        }
    );

    client.get('ticket.id').then(
        function(data) {
            var id = data['ticket.id'];
            console.log('and the id is ' + id);
        }
    );

    client.get('ticket.customField:custom_field_' + CONFIG.customField_Id_1).then(
        function(data){
            console.log("HOLA, ESTE ES EL OUTPUT ", data['ticket.customField:custom_field_' + CONFIG.customField_Id_1])
        }
    );
    
    requestUserInfo(client)

})();

//obtener token para acceder a la API de TigoMoney
function getToken(client) {
    var auth = {
        url: 'http://localhost:3000/api/login',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'POST'
    }
    var token = ''
    client.request(auth).then(
    function (data ) {
            token = data.access_token
            console.log(token)
        }
    )
    
}

//solicitar información a la API de TigoMoney
function requestUserInfo(client){
    var settings = {
        url: "https://pokeapi.co/api/v2/pokemon/ditto",
        headers: {},
        type: "GET",
        dataType: "json"
    }
    client.request(settings).then(
        function(data){
            showInfo(data);
            console.log(data)
        },
        function(response){
            console.log(response);
        }
    )
}

function showInfo(data){
    var requester_data = {
        'documentNumber': data.name,
        'saldo': data.base_experience,
    };

    var source = document.getElementById("requester-template").innerHTML;
    var template = Handlebars.compile(source);
    var html = template(requester_data);
    document.getElementById("content").innerHTML = html;
}