// Importação de módulos
const express = require('express'); // Importa o framework Express
const axios =  require('axios'); // Importa a biblioteca Axios para requisições HTTP
const path = require('path'); // Importa o módulo Path para manipulação de caminhos de arquivos
const cors = require('cors'); // Importa o middleware CORS para permitir requisições entre diferentes origens
const config = require('./config.json'); // Importa as configurações do arquivo JSON
const apikey = config.apikey; // Obtém a chave da API do arquivo de configuração

// Cria uma instância do aplicativo Express
const app = express();

// Inicia o servidor na porta 3000
app.listen(3000);

// Usa o middleware CORS para permitir requisições de diferentes origens
app.use(cors());

// Usa o middleware para analisar o corpo das requisições como JSON
app.use(express.json());

// Define o diretório 'public' como o diretório de arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Objeto com tradução do clima
const traducaoClima = {
    "few clouds": "Poucas nuvens",
    "scattered clouds": "Nuvens dispersas",
    "overcast clouds": "Nublado",
    "broken clouds": "Nuvens quebradas",
    "light rain": "Chuva leve",
    "clear sky": "Céu limpo",
    "moderate rain": "Chuva moderada",
    "light snow": "Pouca neve",
    "very heavy rain": "chuva muito forte",
    "thunderstorm with heavy rain": "Trovoada com chuva forte",
    "heavy intensity rain": "chuva de forte intensidade",
    "": ""
}

// Rota para obter dados meteorológicos com base na cidade fornecida
app.get('/climatempo/:cidade', async(req,res) => {
    const city = req.params.cidade; // Obtém o parâmetro de cidade da requisição
    try {
        // Faz uma requisição à API de previsão do tempo
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
        // Verifica se a requisição foi bem-sucedida
        if(response.status === 200){
            // Traduz o texto descritivo do clima, se estiver presente no objeto de tradução, caso contrário, mantém o original
            const clima = traducaoClima[response.data.weather[0].description] || response.data.weather[0].description;
            // Monta um objeto com os dados meteorológicos relevantes
            const weatherData = {
                Local: response.data.name, // Nome da cidade
                Temperatura: response.data.main.temp, // Temperatura atual
                Umidade: response.data.main.humidity, // Umidade relativa do ar
                VelocidadeDoVento: response.data.wind.speed, // Velocidade do vento
                Clima: clima // Condição do clima
            };
            // Envia os dados meteorológicos como resposta
            res.send(weatherData);
        } else {
            // Caso a requisição não seja bem-sucedida, envia uma mensagem de erro com o código de status correspondente
            res.status(response.status).send({erro: "Erro ao obter dados meteorológicos"});
        }
    } catch(error) {
        // Em caso de erro durante o processamento da requisição, envia uma mensagem de erro com o status 500 e o erro detalhado
        res.status(500).send({erro: "Erro ao obter dados meteorológicos", error});
    }
});
