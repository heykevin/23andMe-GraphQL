import express from "express";
import graphQLHTTP from "express-graphql";
import Auth from "./auth.js";
import schema from "./schema";
import config from "../config.js";

const app = express();
const gqlApp = express();

app.get("/receive_code", function(req, res) {
    const auth = new Auth(true);
    auth.getToken(req.query.code)
    .then((token) => {
        // const graphQLLink = `<div> <a href=${config.uri}/graphql> GraphiQL UI </a> ${token.access_token} </div>`;
        const graphQLLink = `<div> <a href=${config.uri}/graphql> GraphiQL UI </a></div>`;
        return res.send(graphQLLink); 
    });
});

app.get("/", function(req, res) {
    res.send(`<div><a href='https://api.23andme.com/authorize/?redirect_uri=${config.uri}/receive_code/&response_type=code&client_id=${config.clientId}&scope=${config.scope}'> Connect with 23andMe</a> </div>`);
});

gqlApp.use(graphQLHTTP({
    schema,
    graphiql: true
}))

app.use("/graphql", gqlApp);

app.listen(
  5000,
  () => console.log(`Listening on ${config.uri}`)
);