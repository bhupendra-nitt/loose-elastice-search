import express from 'express'
import bodyParser from 'body-parser'
import mysql from 'mysql'

import {
  retrieveSearchRequest,
  saveDocument,
  splitTitleIntoArray,
  fetchWordCount,
  countWords,
  updateCount,
  insertCount,
  insertToTitleWords,
  getFrequency,
  getTotalFrequency,
  setCurrentFrequency,
  fetchResults
} from './helper'

const PORT = 5000;
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});

connection.connect(function(err) {
  if (err) throw err
})

connection.query('CREATE DATABASE IF NOT EXISTS ledb', function (err) {
  if (err) throw err
  connection.query('USE ledb', function (err) {
    if (err) throw err
    connection.query('CREATE TABLE IF NOT EXISTS documents('
      + 'id INT NOT NULL AUTO_INCREMENT,'
      + 'PRIMARY KEY(id),'
      + 'description BLOB'
      +  ')', (err) => {
        if (err) throw err
      })

  connection.query('CREATE TABLE IF NOT EXISTS title_words('
    + 'id INT NOT NULL AUTO_INCREMENT,'
    + 'title VARCHAR(30) UNIQUE,'
    + 'PRIMARY KEY(id)'
    +  ')', (err) => {
        if (err) throw err
    })

    connection.query('CREATE TABLE IF NOT EXISTS title_word_document('
    + 't_id INT NOT NULL,'
    + 'd_id INT NOT NULL,'
    + 'PRIMARY KEY(t_id, d_id),'
    + 'frequency INT,'
    + 'tf DECIMAL,'
    + 'idf DECIMAL'
    +  ')', (err) => {
        if (err) throw err
    })

    connection.query('CREATE TABLE IF NOT EXISTS word_count('
    + 'id INT NOT NULL AUTO_INCREMENT,'
    + 'count INT NOT NULL DEFAULT 0,'
    + 'PRIMARY KEY(id)'
    +  ')', (err, result) => {
        if (err) throw err
    })
  })
})

app.get('/search', (req, res) => { // Building
  const queryString = req.query.q
  const queryArray = queryString.split(' ')
  let results = []
  queryArray.forEach(elem => {
    connection.query(fetchResults(elem), (err, result) => {
      if (err) throw err
      else {
        console.log(result)
      }
    })
  })
});

app.get('/build', (req, res) => { // TODO
  const queryString = req.query.q
  const queryArray = queryString.split(' ')
  queryArray.forEach(elem => {
    connection.query(fetchResults(elem), (err, result) => {
      if (err) throw err
      else {
        console.log(result)
      }
    })
  })
});

app.post('/index', (req, res) => {
  if(!req.body.document) {
    return res.status(400).send({
      success: 'false',
      message: 'document is required'
    })
  }

 const doc = {
   title: req.body.title,
   document: req.body.document
 }
 connection.query(saveDocument(doc), (err, result) => {
  let wordCount 
   if(err) {
     return res.status(500).send({})
   } else  {
     const documentId = result.insertId
     connection.query(fetchWordCount(), (err, result) => {
       if (err) throw err
       else {
         if(result.length === 0) {
           const count = countWords(req.body.title)
           connection.query(insertCount(count), (err, result) => {
             if (err) throw err
           })
         } else {
           const existingCount = parseInt(JSON.stringify(result[0].count))
            const count = countWords(req.body.title)
            wordCount = count + existingCount
            connection.query(updateCount(wordCount), err => {
              if (err) throw err
            })
         }
       }
     })
     const indexWordsArray = splitTitleIntoArray(req.body.title)
     indexWordsArray.forEach(element => {
       connection.query(insertToTitleWords(element), (err, result) => {
         if (err) throw err
         else {
           const titleWordId = result.insertId
           const frequency = getFrequency(element, req.body.document)
           const words = countWords(req.body.document)
           const tf = parseFloat(frequency/words)
           console.log('tf' + tf)
           connection.query(getTotalFrequency(titleWordId), (err, result) => {
             if (err) throw err
             else {
              if(result[0]['SUM(frequency)'] === null) {
                connection.query(setCurrentFrequency(titleWordId, documentId, frequency, tf),(err, result) => {
                  if (err) throw err
                  else {
                  }
                })
              } else {
                connection.query(setCurrentFrequency(titleWordId, documentId, frequency + parseInt(result[0]['SUM(frequency)'], tf)),(err, result) => {
                  if (err) throw err
                  else {
                  }
                })
              }
             }
           })
         }
       })
     });
     return res.status(201).send({
      success: 'true',
      message: 'success'
     })
  }
 })
})

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
