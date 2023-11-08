const http = require('http');

class CustomHTTP{

    // Variables for CustomHTTP
    #HOST = "" 
    #PORT = 0
    #routes = {}

    constructor(HOST, PORT){
        this.#HOST = HOST;
        this.#PORT = PORT;
    }

    formDataHandler(){

    }

    requestListener(req, res){
        var method = req.method,
            path = req.url

        //console.log(req)
        console.log(this.addRoute)
        console.log(this)
        this.addRoute("/", "GET", (req, res) => "Random")
        console.log(this.#routes)
        res.writeHead(200);
        res.end("My first server!");

        

        if(method == "POST"){
            req.on("data", function(d){
                console.log(d.toString())
            })
            res.writeHead(200);
            res.end("My first server!");
        } else {

        }
    }

    addRoute = function (path, method, controller){
        this.#routes[path][method] = controller;
    }

    startWebServer(){
        const server = http.createServer(this.requestListener);
        server.listen(this.#PORT, this.#HOST, () => {
            console.log(`Server is running on http://${this.#HOST}:${this.#PORT}`);
        });
    }
}

module.exports = CustomHTTP;