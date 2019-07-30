import fs from 'fs';

export const saveDocument = doc => {
  let sql = `INSERT INTO documents(description) \
    VALUES('${doc.document}');`
  return sql;
}

export const indexSearchRequest = data => {
  return data.split(' ')
}

export const splitTitleIntoArray = title => {
  return title.split(' ')
}

export const saveIndexes = elem => {
  let sql = `INSERT INTO indexes(title) \
    VALUES('${elem}');`
  return sql;
}

export const insertToTitleWords = title => {
  const sql = `INSERT IGNORE INTO title_words(title) VALUES('${title}');`
  return sql
}

export const fetchWordCount = _ => {
  return `SELECT count from word_count`
}

export const countWords = doc => {
  const c =  doc.split(' ').length
  return c
}

export const updateCount = count => {
  return `UPDATE word_count SET count = ${count} WHERE id = 1;`
}

export const insertCount = count => {
  return `INSERT INTO word_count(count) VALUES (${count});`
}

export const insertIntoTitleWordDoc = data => {
  return `INSERT INTO title_word_document(title_word)`
}

export const getCurrentTF = (frequency, titleWordId, documentId) => {
  return `SELECT count * from title_word_document where t_id = ${id}; `
}

export const getTotalFrequency = id => {
  return `SELECT SUM(frequency) from title_word_document where t_id = ${id};`
}

export const setCurrentFrequency = (tid, did, frequency) => {
  return `INSERT IGNORE INTO title_word_document(t_id, d_id, frequency) VALUES('${tid}', '${did}', '${frequency}');`
}

export const getFrequency = (word, string) => {
  let count = 0
  let cleanString = string.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g,""),
    words = cleanString.split(' ')
    words.forEach(element => {
      if(element === word) {
        count = count + 1
      }
    })
    return count
}