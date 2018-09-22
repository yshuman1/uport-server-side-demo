const express = require("express");
const uport = require("uport");
const jsontokens = require("jsontokens");
const bodyParser = require("body-parser");

const signer = uport.SimpleSigner(
  "8e2f0f1abf1763191753b6dd242e7f820eb9a382b97c804508ad737ec637f2ea"
);
const endpoint = "https://cfd626d1.ngrok.io"; // replace this with a public IP or HTTP tunnel

const credentials = new uport.Credentials({
  appName: "Pulse Credential Demo",
  address: "2ohjhgZvVWQoU4fxxSh7GbnDC2yK5gnUdAH",
  signer: signer
  //  networks: {'0x4': {'registry' : '0x2cc31912b2b0f3075a87b3640923d45a26cef3ee', 'rpcUrl' : 'https://rinkeby.infura.io'}}
  // Note: we use Rinkeby by default, the above is the explicit format for selecting a network
});

const app = express();

app.use(bodyParser.json({ type: "*/*" }));

app.get("/", function(req, res) {
  credentials
    .createRequest({
      requested: ["identity_no"],
      callbackUrl: `${endpoint}/callback`,
      exp: Math.floor(new Date().getTime() / 1000) + 300
    })
    .then(function(requestToken) {
      let uri =
        "me.uport:me?requestToken=" + requestToken + "%26callback_type=post";
      let qrurl =
        "http://chart.apis.google.com/chart?cht=qr&chs=400x400&chl=" + uri;
      let mobileUrl =
        "https://id.uport.me/me?requestToken=" +
        requestToken +
        "&callback_type=post";
      console.log(uri);
      res.send(
        "<div><img src=" +
          qrurl +
          "></img></div><div><a href=" +
          mobileUrl +
          ">Click here if on mobile</a></div>"
      );
    });
});

app.post("/callback", function(req, res) {
  let jwt = req.body.access_token;
  console.log("\n\nJWT (access token): \n");
  console.log(jwt);

  credentials.receive(jwt).then(function(creds) {
    console.log("\n\nDecoded JWT: \n");
    console.log(creds);
  });
});

let server = app.listen(8081, function() {
  console.log("\n\nCredential Requestor service up and running!");
  console.log(`Open your browser to ${endpoint} to test the service. \n`);
  console.log("Watch this console for results from the service. \n");
  console.log("Service Output: \n");
});
