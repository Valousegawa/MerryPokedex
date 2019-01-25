const request = require('sync-request');

class HelloController {
    
    constructor(io){
            this.io = io;
    }
    
    postAction(req, res){
        switch(req.params.actionId){
            case "hello":
			case "hello2":
			case "hello3":
			case "hello4":
			case "hello5":
                var textResponse= "Bonjour à toi";
                if(!textResponse){
                    res.end(JSON.stringify({resultText: "je n'ai pas d'informations"}));
                }else{
                    res.end(JSON.stringify({resultText: textResponse}));
                }
                break;
            default:
                res.end(JSON.stringify({}));
                break;
            
        }
    }
}

module.exports = HelloController;