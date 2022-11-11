const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

//const url = "mongodb://127.0.0.1:27017";
const url = "mongodb+srv://admin:Xq0Yb7JSQmuGSvB5@cluster0.gqibepj.mongodb.net";
const bancoDadosNome = "ocean_jornada_fullstack";

async function main() {
  // Realiza a conexão com o client
  const client = await MongoClient.connect(url);

  // Obtém acesso ao banco de dados
  const bancoDados = client.db(bancoDadosNome);

  // Obtém acesso à collection
  const collection = bancoDados.collection("itens");

  const app = express();

  // Sinalizamos que estamos usando JSON no Body
  app.use(express.json());

  // Endpoint principal
  app.get("/", function (req, res) {
    res.send("Hello World!!!");
  });

  // Endpoint /oi
  app.get("/oi", function (req, res) {
    res.send("Olá, mundo!");
  });

  // Lista de informações
  const itens = ["Café Pelé", "Café Pilão", "Café Arábico"];
  //             0             1             2

  // Endpoint [GET] /itens - READ ALL (Ler todos os itens)
  app.get("/itens", async function (req, res) {
    // Leio todos os documentos da collection
    const documentos = await collection.find().toArray();

    // Envio como resposta para o endpoint
    res.send(documentos);
  });

  // Endpoint [POST] /itens - CREATE (Criar um item)
  app.post("/itens", async function (req, res) {
    // console.log(req.body);

    // Pegamos o nome enviado no body
    const item = req.body;

    // Inserimos o valor recebido na collection
    await collection.insertOne(item);
    //itens.push(item);

    // Exibimos uma mensagem de sucesso
    res.send("Item criado com sucesso!");
  });

  // Endpoint [GET] /itens/:id - READ BY ID (Ler pelo ID)
  app.get("/itens/:id", async function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;
    //Realizamos uma busca no bd
    const item = await collection.findOne({
        _id: new ObjectId(id),
    });
    // Exibimos o item encontrado
    res.send(item);
  });

  // Endpoint [PUT] /itens/:id - UPDATE BY ID (Atualizar pelo ID)
  app.put("/itens/:id", async function (req, res) {
    // Pegamos o parametro de rota ID
    const id = req.params.id;
    // Pegamos o objeto enviado no body
    const item = req.body;
    //Atualizamos o item no BD
    await collection.updateOne(
        { _id: new ObjectId(id)},
        { $set: item }
    )
    res.send("Item atualizado com sucesso!");
  });

  // Endpoint [DELETE] /itens/:id - DELETE BY ID (Remover pelo ID)
  app.delete("/itens/:id", async function (req, res) {
    // Pegamos o parâmetro de rota ID
    const id = req.params.id;

    // Remove o item da lista
    await collection.deleteOne({
        _id: new ObjectId(id),
    });

    // Exibimos uma mensagem de sucesso
    res.send("Item removido com sucesso!");
  });

  app.listen(process.env.PORT || 3000, function() {
    console.log("Servidor rodando em http://localhost:3000");
  });
}

main();
