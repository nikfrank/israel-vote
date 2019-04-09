const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const rp = require('request-promise');
const cheerio = require('cheerio');

const calcTotals = (page)=>{

  
  const totals = page('table.TableData').find('td:nth-child(3)').map((i,p)=> page(p).text()).get().map(n => parseFloat(n.replace('%', ''), 10));
  const parties = page('table.TableData').find('td:nth-child(2)').map((i,p)=> page(p).text()).get();

  
  const cut = totals.filter(t=> t >= 3.25).length;

  const total = totals.slice(0,cut).reduce((p,c)=> p+c);

  const seats = {};

  parties.slice(0,cut).forEach((p,i)=> (
    seats[p] = Math.floor(totals[i] * 120 / total)
  ));

  return seats;
}

app.get('/', (req, res) => {
  rp('https://votes21.bechirot.gov.il/')
    .then(html => {
      const page = cheerio.load(html);

      res.json(calcTotals(page));
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
