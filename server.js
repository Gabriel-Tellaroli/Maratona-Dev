//CONFIGURANDO O SERVIDOR
const express = require ("express")
const server = express()

//CONFIGURAR O SERVIDOR PARA APRESENTAR ARQUIVOS Estaticos
server.use(express.static('public'))

//HABILITAR BODY DO FORMULARIO
server.use(express.urlencoded({ extended: true }))

//CONFIGURAR A CONEXÃO COM O BANCO DE DADOS
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password:'Bifiloko1',
    host: 'localhost',
    port: 5432,
    database: 'doe'
})

//CONFIGURANDO A TEMPLATE ENGINE
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true
})


//CONFIGURAR A APRESENTAÇÃO DA PÁGINA
server.get("/", function(req, res){
        
        db.query("SELECT * FROM donors", function(err, result){
            if (err)return res.send("Erro no Banco de Dados.")

            const donors = result.rows
            return res.render("index.html", { donors })
        })

        
})

server.post("/", function(req, res){
        //Pegar dados do formulario
        const name = req.body.name
        const email = req.body.email
        const blood = req.body.blood.toUpperCase()

        if (name == "" || email == "" || blood == ""){
            return res.send("Todos os campos são obrigatórios.")
        }
        
        //COLOCA VALORES DENTRO DO BANCO DE DADOS
        const query = `
        INSERT INTO donors ("name", "email", "blood") 
        VALUES ($1, $2, $3)`

        const values = [name, email, blood]

        db.query(query, values, function(err) {

            //FLUXO DE ERRO
            if (err)return res.send("Erro no Banco de Dados.")

            // FLUXO IDEAL
            return res.redirect("/")
        })   
})

//LIGAR O SERVIDOR E PERMITIR ACESSO NA PORTA 3000
server.listen(3000, function(){
        console.log("Iniciei o servidor.")
})