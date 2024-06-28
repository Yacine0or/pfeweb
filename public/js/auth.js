const express = require("express");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const cors = require("cors");  // Import cors

const serviceAccount = {
    "type": "service_account",
    "project_id": "flutterfirebase-d1c32",
    "private_key_id": "df9fb45298293e6978a29a10bd44f38c76931237",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2G0ZrHXuFwq5D\njqO1KQYB304R9AXuf3gEouESkBqffAdhCkU/gKGj5ILAf3gp5ADpJ8B9bE8rHiJX\nh4SLwUyi3liUY2A9PmwSbc1Oiht/GwQGpzZX0FXjxtoyzUIL0+guk3KdBOMGnGOx\nKJzo0F3uztBSdiWvIPaqJYHVERfq9YFRXhNux2Pr7oNAduMLVpLMDqdTKQPuSdmy\n416R5bf0R8qp8EFKUFaNMWGapCRJ1xaj5SjluLxEaLGaXicnIvFROcQjkIaXq1h4\nojwxfyjnlbATanotfQ9VLAP0X/fbX4m0fVn0adrpaLOMf9q9MgbAsRnVEQsnz3f8\nVXi0EzxhAgMBAAECggEADxlv203UgiDERkG7fTfrkZgsZvyuyTm0f93pf5qHOpYU\nHo21dDB8NpSp6sAm/II1OR/crAmg/tg+zLcl3FiovBBnk9YxkqJsX5LPJSX6Za2d\nxddzgBB8Lqi8St4ODeECLWp4ZGCVWmT5NyVA7WTphPWM/GljcoPvL+hwPXRvYUHa\nH9mnztzb8LcvOGHosiW7Ynf9styBYz8W2MTxf486qYgdb+tF8yq89yRAP2b/B1P2\nkWGE88mc61V5NFO4dYDzfIBNw7S3N05zn0iyk8lD3/gRXCXxt3F5WBst3yserbJv\nQIzdMKBR61Yfoa8dSdNtN+Q53ewMwFSyLza571uAiQKBgQDiwguplpbthyF6PAp4\nqju08/GfK7X/UYRyviHeM3k+jwijEgXpNOWdy32CXbz+FQE3LfubrZwNSKxNVftK\najiin/sz3vY+iSFCs/Lc3kWV9hjEI+YAEb1teQNCKaRzXuNZFdqVKtGGRGjscOWX\nSvVL2OhKh/O5ljJABq7U+BMpOwKBgQDNlycWbxnPvF+9wTC49RtcF3Wvu+7QPKSD\ns0ghpwjG/4uF0Dn3rJwuig36A16B9oIdZSMC1yGk22Y/b5ceQiwfIuKvXFLpjTBX\npEH81zya5N1vpa45N/V9aoDa7sXLfahVynGAyJTpuB/Eeor0KV7KA1LC84OEbjZ+\nKK0WNaq3EwKBgQDhnNvpshEc59RhQBfTEt0xH34KNn1wOPUlDRO5d1Fs8vdO+IG1\nFJJZO7v217lQvClnc3Lh5AxeEy6MC75oveL3u2E+rNooQlw7d7tuEiD+Ictma6lN\n7Fii8UJStAgRWhmt61Z+EApEIxCaH4Hv0/7XpksIzNeskUoR9hRBhUnbPQKBgFXE\nFN5bAt2SrC4xBe5i8kL81m+1au8cHVWD2TeQwyyhNsdgEo6sR4tytFn0RdzZxXYV\n1wE8ViC8Fm+oUdahrF5g40hcr4oXCG/Ham/cKsBDcc09xOzB13u2joLG0WUOysbf\naXJcOyM1WKtSo90v1QdZU5FYnSkGAV2oAm0dflZZAoGAMmn+kY6PgQAiqX3NjVjb\nu1e0hgCMro2M4mx82LOtyL9g1KKG43tZ4vk4ocw4DXeznuX3B7Y3KJ42Q6MQ1bNO\nM41lFrZedFogOmHxGdvscCCRzleTDgVZjVEAHG8gX5AEXxqeT3P/7lbEqWAFVeR1\ngqOk3ykrmQOxc/BIcZ/nHjw=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-p40zq@flutterfirebase-d1c32.iam.gserviceaccount.com",
    "client_id": "111075010464084795852",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-p40zq%40flutterfirebase-d1c32.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }; // Replace with the path to your service account key file

const app = express();
app.use(bodyParser.json()); // Middleware to parse JSON bodies
app.use(cors())

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flutterfirebase-d1c32.firebaseio.com" // Replace with your Firebase project ID
});

// Helper function to handle errors
function handleError(err, res) {
  console.error(err);
  res.status(500).send({ message: "An error occurred. Please try again later." });
}

app.get("/add",async (req,res)=>{
    console.log("in request");
    const email = req.query.email;
    const password = req.query.password;
    console.log(email);
    console.log(password);

    try{
        if(email && password){
        var user = await admin.auth().createUser({
           email: email,
           password: password,
         });
         res.status(200).send(user.uid);
         console.log("success");}
         else{
            console.log("error undifined");
         }

   }catch(e){
    console.log("error"+e);
    res.status(404).send("error : "+e);
 }
})

app.get("/",(req,res)=>{
    res.send("welcome")
})


app.listen(8000, () => {
  console.log("Server listening on port 8000");
});