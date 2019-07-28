import express from 'express';
import bodyParser from 'body-parser';

import { indexSearchRequest, retrieveSearchRequest } from './helper'

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/search', async (req, res) => {
    const result = retrieveSearchRequest()
    res.json(result.then(json => {
      console.log(result)
    }))
    // result.then(json => {
    //   console.log(json)
    //   res.status(json.status).send(json.success)
    // })
});

app.post('/index', (req, res) => {
  if(!req.body.document) {
    return res.status(400).send({
      success: 'false',
      message: 'document is required'
    });
  }

 const todo = {
   id: req.body.id, //this should be auto-created
   title: req.body.title,
   description: req.body.description
 }

 indexSearchRequest(todo)
 return res.status(201).send({
   success: 'true',
   message: 'success'
 })
});
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});
