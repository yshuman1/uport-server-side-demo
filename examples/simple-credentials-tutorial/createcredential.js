const express = require("express");
const uport = require("uport");
const jsontokens = require("jsontokens");

const app = express();
const signer = uport.SimpleSigner(
  "8e2f0f1abf1763191753b6dd242e7f820eb9a382b97c804508ad737ec637f2ea"
);

const credentials = new uport.Credentials({
  appName: "Pulse Credential Demo",
  address: "2ohjhgZvVWQoU4fxxSh7GbnDC2yK5gnUdAH",
  signer: signer
  //networks: {'0x4': {'registry' : '0x2cc31912b2b0f3075a87b3640923d45a26cef3ee', 'rpcUrl' : 'https://rinkeby.infura.io'}}
  // Note: we use Rinkeby by default, the above is the explicit format for selecting a network
});

app.get("/", function(req, res) {
  credentials
    .attest({
      sub: "2ofbjKDVcAjb5pkSZzwjsAKxWdMwc4zwiCs", //replace this with your MNID identifier
      exp: 1552046024,
      claim: {
        "Pulse ID Info": {
          email: "yasin@pulseagent.co",
          Twitter: "@yasin0424",
          LinkedIn: "https://www.linkedin.com/in/yshuman/"
        }
      }
      // Note, the above is a complex claim. Also supported are simple claims:
      // claim: {'Key' : 'Value'}
    })
    .then(function(att) {
      console.log(att);
      console.log(jsontokens.decodeToken(att));
      let uri = "me.uport:add?attestations=" + att + "%26callback_type=post";
      let qrurl =
        "http://chart.apis.google.com/chart?cht=qr&chs=400x400&chl=" + uri;
      let mobileUrl =
        "https://id.uport.me/add?attestations=" + att + "&callback_type=post";
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

let server = app.listen(8081, function() {
  console.log("\n\nCredential Creation service up and running!");
  console.log(
    "Open your browser to http://localhost:8081 to test the service. \n"
  );
  console.log("Watch this console for results from the service. \n");
  console.log("Service Output: \n");
});
