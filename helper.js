import fs from 'fs';

export const indexSearchRequest = data => {
  const written = writeToDb('./db/documents.json', JSON.stringify(data))
  written.then(json => {
    if(json) {
      performIndexing()
    }
  })
}

export const writeToDocuments = data => {
  writeToDb('./db/documents.json', JSON.stringify(data))
}

export const retrieveSearchRequest = async () => {
  const db = readDb('./db/indexing.json')
  db.then(result => {
    return new Promise((resolve, reject) => {
      if(result) {
        resolve(JSON.stringify({status: 200, success: true}))
      } else {
        reject(JSON.stringify({status: 404, success: false}))
      }
    })
  })
}

const writeToDb = async (file, json) => {
  fs.readFile(file, 'utf8', function readFileCallback(err, data) {
    if (err){
        console.log(err);
    } else {
      let obj = {}
      if(data) {
        obj = JSON.parse(data)
        obj.table.push(json)
      } else {
        obj.table = []
        obj.table.push(json)
      }
      json = JSON.stringify(obj); 
     return new Promise((resolve, reject) =>  fs.writeFile(file, json, 'utf8', (err, data) => {
        if(err) {
          reject(null)
        } else {
          resolve(data)
        }
      })
      )
    }
  });
}

const readDb = async file => {
  return new Promise( (resolve, reject) => {
    fs.readFile(file, 'utf8', function readFileCallback (err, data) {
      if (err){
         reject(null)
      } else {
      return resolve(data)
      }
    })
  }) 
}
  const performIndexing = data => {
  const indexedDb = readDb('./db/indexing.json')
  indexedDb.then(json => {
    if(json) {
    }
  })
}

// const sortDocuments = data => {

// }

// const dynamicSort = (property) => {
//   objs.sort((a, b) => a.last_nom.localeCompare(b.last_nom))
// }
