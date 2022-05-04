require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
app.use(express.json());

let refreshTokens = []; 

/* const posts = [
    {
        username : "Ahmet",
        title : "CEO"
    },
    {
        username : "Seda",
        title : "CTO"
    }
]

app.get('/posts', authenticateToken, (req, res) => {
    //res.json(posts);
 
    res.json(posts.filter(posts => posts.username === req.user.name));
    
}); */

app.post('/token', (req, res) => {

    const refresh_token = req.body.token;
    console.log(req.body);
    console.log(req.body.token);
    if(refresh_token == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refresh_token)) return res.sendStatus(403);

    jwt.verify(refresh_token, process.env.REFRESH_TOKEN_SECRET, (err, user) =>{
        if(err) return res.sendStatus(403);
        const access_token = generateAccessToken({ name : user.name });
        res.json({ access_token : access_token});
    })

});

app.post('/login',(req, res) => {

    const username = req.body.username;
    const user = {name : username}
 
    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
    const refresh_token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    res.json({access_token : access_token, refresh_token : refresh_token});


});

//Middleware
function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn : '60s'}); 
}

app.listen(4000);