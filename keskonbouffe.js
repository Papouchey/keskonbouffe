/**
 * Created by ASUS on 03/07/2017.
 */
var Discord = require("discord.js");
var bot = new Discord.Client();
var text_bouffe;

bot.on("message", msg => {
    if(msg.content.startsWith("!bouffe")){
    //console.log("Coucou" + msg);
    //console.log("Coucou" + msg);
    bouffe(function() {
        msg.channel.sendMessage(text_bouffe);
    });
    }});

bot.login("MzMxNTExNjk4MjIzNzkyMTQw.DDwn4w.2ERzmVP4vQBr9RtZMUI8vrqhtf8");

//http://www.marmiton.org/recettes/recette-hasard.aspx

function bouffe(envoieMessage) {
    var http =  require('follow-redirects').http;
    var random = Math.floor((Math.random() * 98000) + 1157);

    var options = {
        host: 'www.cuisineaz.com',
        path: '/recettes/-'+random+'.aspx',
        followAllRedirects: true
    };

    console.log(random);

    callback = function (response) {
        console.log("statusCode: ", response.statusCode);
        if(response.statusCode != 200){
            bouffe(envoieMessage);
            return;
        }
        var str = '';
        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function (chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function () {
            var DOMParser = require('xmldom').DOMParser;
            var parser = new DOMParser();
            var doc = parser.parseFromString(str, "text/html");
            var titre_bouffe = doc.getElementsByTagName('h1')[0].childNodes[0].nodeValue;
            if(titre_bouffe == "Erreur 404 - Page non trouvée"){
                bouffe(envoieMessage);
                return;
            }
            text_bouffe = "**"+titre_bouffe+"**\n";
            checkifidexistsornot(doc,"ctl00_ContentPlaceHolder_LblRecetteNombre",":bust_in_silhouette:");
            checkifidexistsornot(doc,"ctl00_ContentPlaceHolder_LblRecetteTempsPrepa",":clock3:");
            checkifidexistsornot(doc,"ctl00_ContentPlaceHolder_LblRecetteTempsRepos",":pause_button:");
            checkifidexistsornot(doc,"ctl00_ContentPlaceHolder_LblRecetteTempsCuisson",":shallow_pan_of_food:");
            checkifidexistsornot(doc,"ctl00_ContentPlaceHolder_LblRecetteDifficulte",":chart_with_upwards_trend:");
            var titre_url = titre_bouffe.split(' ').join('-');

            text_bouffe += "\nAccéder à la recette : http://www.cuisineaz.com/recettes/"+titre_url+"-"+random+".aspx";
            if(response.statusCode == 200) {
                envoieMessage();
            }
        });
    }

    http.request(options, callback).end();
}

function checkifidexistsornot(doc,id_name,icon){
    var check_id = doc.getElementById(id_name);
    console.log(check_id);
    if(check_id != null && check_id.childNodes[0] != null){
            check_id = check_id.childNodes[0].nodeValue;
            console.log(check_id);
            text_bouffe += "\n" + icon + check_id + "\n";
    }
}