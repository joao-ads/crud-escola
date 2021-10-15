const express = require ('express');
const cors = require ('cors');
const mongoose = require ('mongoose');
const professor_controller = require ('./professor_controller')

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

mongoose.connect("mongodb+srv://yasmine_pallin:yasmine_pallin@cluster0.q85je.mongodb.net/escolacrud_http?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology:true}) 

app.use('/professores', professor_controller);


app.listen(3000);