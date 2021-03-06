require('dotenv').config();
const express = require('express');
const app = express();

const jwt = require('jsonwebtoken');
app.use(express.json());

const posts = [
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
    
});

app.post('/login',(req, res) => {

    const username = req.body.username;
    const user = {name : username}

    console.log()

    const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);

    res.json({access_token : access_token})


});

//Middleware
function authenticateToken(req, res, next){

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]
    
    if(token==null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err) return res.sendStatus(403);
        req.user = user
        next();
    });

}

app.listen(3000);