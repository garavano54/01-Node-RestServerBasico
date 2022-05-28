
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client( process.env.GOOGLE_CLIENT_ID );

async function googleVerify( token = '') {
  const ticket = await client.verifyIdToken({
      idToken: token,                           // Specify the CLIENT_ID of the app that accesses the backend
      audience: process.env.GOOGLE_CLIENT_ID,   // Or, if multiple clients access the backend: [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const { name, email, picture } = ticket.getPayload();     // Devuelve el payload. console.log(payload);

  return {
    nombre: name,
    correo: email,
    img: picture
  }

}

module.exports = {
    googleVerify
}