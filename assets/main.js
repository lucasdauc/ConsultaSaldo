import CONFIG from "./config.js"

var client = window.ZAFClient.init();

(async function () {
    var numDoc;
    var numBill;

    client.invoke('resize', { width: '100%', height: '200px' });

    let p1;
    p1 = client.get('ticket.customField:custom_field_' + CONFIG.CUSTOM_FIELD_ID_1).then(
        function(data){
            numDoc = data['ticket.customField:custom_field_' + CONFIG.CUSTOM_FIELD_ID_1];
            //console.log("function-> get customfield -> numDoc: ", numDoc);
            return numDoc;
        }
    );

    let p2;
    p2 = client.get('ticket.customField:custom_field_' + CONFIG.CUSTOM_FIELD_ID_2).then(
        function(data){
            numBill = data['ticket.customField:custom_field_' + CONFIG.CUSTOM_FIELD_ID_2];
            //console.log("function-> get customfield -> numBill: ", numBill);
            return numBill;
        }
    );


    const valores = await Promise.all([p1, p2]); //obtengo el valor de las promesas (no la promesa)
    console.log("VALORES: ", valores[0], valores[1])

})();

async function getTicket(client, param){ //las funciones asíncronas retornan una promesa
    const data = await client.get('ticket');
    console.log(data);
    console.log(param);
    return data
}

const ticket = getTicket(client, "HOLAAAAAAAAAA");


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
function requestUserInfo(client, numDoc, numBill){

    var settings = {
        url: "https://pokeapi.co/api/v2/pokemon/"+numDoc,
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