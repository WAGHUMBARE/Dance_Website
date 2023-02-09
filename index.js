const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); 

const mongoose = require('mongoose');
const { stringify } = require('querystring');
mongoose.set('strictQuery', false);
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');
}

const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  address: String,
  phone: String
});

const contact = mongoose.model('contact', ContactSchema);

app.use('/static', express.static('static'))
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.status(200).render('index.pug');
})

app.get('/contact', (req, res) => {
  res.status(200).render('contact.pug');
})

app.post('/contact', (req, res) => {
  console.log(req.body);
  const data = new contact(req.body);
  data.save().then(()=>{
    res.send("contact has been saved succesfully");
  }).catch(()=>{
    res.status(400).send("contact was not saved to database");
  })
})

const port = 80;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})