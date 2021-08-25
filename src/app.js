const { default: axios } = require("axios");
const express = require(`express`);
const app = express();
const path = require(`path`);

const api = require(`./config/api`);

express.urlencoded({ extended: true });
express.json();

app.set(`view engine`, `ejs`);
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(`src/public`));

app.get(`/`, async (req, res) => {


    const moreDataPokemons = async (pokemons) => {
        try {
            const { results } = pokemons;
            let arrayPokemons = [];
            for (let i = 0; i < results.length; i++) {
                let { data } = await api.get(results[i].url);
                arrayPokemons.push({ ...results[i], data });
            }
            return arrayPokemons;
        } catch (err) {
            res.send(`Response Error`);
        }
    }


    try {
        const { data: pokemons } = await api.get(`pokemon`, {
            params: {
                limit: 10,
                offset: 0
            }
        });
        let mappingPokemons = await moreDataPokemons(pokemons);
        return res.render(`index.ejs`, { pokemons: mappingPokemons });
    } catch (err) {
        res.send(`Response Error`);
    }

});

app.listen(3030, () => {
    console.log(`Servidor Rodando`);
});