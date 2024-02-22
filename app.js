const express = require ('express');
const axios = require ('axios');
const path = require ('path');
const cors = require ('cors');
const config = require ('./config.json')
const apikey = config.apikey;

const app = express();
app.listen(3000);

app.use(cors());
app.use(expres.json());
app.use(express.static(path.join(__dirname, 'public')));

const traducaoClima = {
    'few clouds': 'poucas nuvens',
    'scattered clouds': 'Nuvens dispersas',
}

app.get('/climatempo/:cidade', async(req, res)=>{
    const city = req.params.cidade;

    try{
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`)
            if(response.status === 200){

                const clima = traducaoClima[response.data.weather[0].description] 
                || response.data.weather[0].description;

                const weatherData = {
                    Temperature: response.data.main.temp,
                    Unidade: response.data.main.humidity,
                    VelocidadeDoVento: response.data.wind.speed,
                    Clima: clima
                };

                res.send(weatherData);
            }else{
                res.status(response.status).send({erro: 'Erro ao obter dados metereológicos'});
            }

    }catch (error){
        res.status(500).send('Erro ao obter dados do clima')
    }
}
)