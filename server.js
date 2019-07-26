const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const ObjectId= require ('mongodb').ObjectID

//conectando o banco
const MongoClient = require ('mongodb').MongoClient;
const uri= "mongodb+srv://admin:abacaxi123@cluster0-wgowu.mongodb.net/test?retryWrites=true&w=majority"
MongoClient.connect(uri, (err, client) => {
    if (err) return console.log(err)
    db = client.db('playlists')

    app.listen(3000,() => {
        console.log('server running on port 3000')
    })
})
//


app.use(bodyParser.urlencoded ({ extended: true }))

app.set('view engine', 'ejs')

app.get('/', (req,res) =>{
    res.render('index.ejs')
})

app.get('/', (req,res)=>{
    var cursor = db.collection('data').find()
})

app.get('/show', (req,res) => {
    db.collection('data').find().toArray((err,results)=>{
        if (err) return console.log(err)
        res.render('show.ejs', {data:results})
        })
    })

app.post('/show', (req, res)=> {
    db.collection('data').save(req.body, (err, result)=>{
        if (err) return console.log(err)
        console.log('salvo no banco')
        res.redirect('/show') 
    })
})



//editar músicas
app.route('/edit/:id')
.get((req, res)=>{
    var id= req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err,result)=>{
        if(err) return res.send(err)
        res.render('edit.ejs', {data: result })
    })
    
})
.post((req, res)=>{
    var id=req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('data').updateOne({_id: ObjectId(id)},{
        $set: {
            name: name,
            surname: surname
        }
//atualizar músicas
}, (err, result)=>{
    if(err) return res.send(err)
    res.redirect('/show')
    console.log("Atualizado no bd")
})
})


//deletar músicas
app.route('/delete/:id')
.get((req, res)=>{
    var id= req.params.id
    db.collection('data').deleteOne({_id: ObjectId(id)}, (err,result)=>{
        if(err) return res.send(500,err)
        console.log('Deletado com sucesso do Banco')
        res.redirect('/show')
    })
})