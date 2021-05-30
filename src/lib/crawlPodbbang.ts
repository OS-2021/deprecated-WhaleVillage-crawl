const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const mariadb = require('mariadb');
import request from 'request-promise';
const connection = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'whale'
});



export const getLinkMp3 = (async(link) => {
  let options = { uri: link, method: 'get', json:true };
  let list = [];

  await request(options).then(async (parsedBody) => { list = parsedBody; });

  
  for await (let variable of list['data']) {
    console.log(variable['id']);
    console.log(variable['title']);
    console.log(variable['media']['url']);
    console.log(variable['publishedAt']);

    let sql = `INSERT INTO crawl(page, title, link)
    SELECT "podbbang", "${variable.title}", "${variable.media.url}"
    FROM dual
    WHERE NOT EXISTS (SELECT title FROM crawl WHERE title = "${variable.title}" AND link = "${variable.media.url}");`;
	  await connection.query(sql,() =>{connection.release();});
    }

  return;
});