const express = require('express');
const bodyParser = require('body-parser');
const googleSheets = require('gsa-sheets');

const key = require('./privateSettings.json');

// TODO(you): Change the value of this string to the spreadsheet id for your
// GSA spreadsheet. See HW5 spec for more information.
const SPREADSHEET_ID = '18afXzIplEZzLgJKSaErx1F_Z82awWyQ-h0GkahFuF7g';

const app = express();
const jsonParser = bodyParser.json();
const sheet = googleSheets(key.client_email, key.private_key, SPREADSHEET_ID);

app.use(express.static('public'));

async function onGet(req, res) {
  const result = await sheet.getRows();
  const rows = result.rows;
  console.log(rows);

  var array = [] ;

  // TODO(you): Finish onGet.
  for(let i=1 ; i < rows.length; i++)
  {
    let line = {} ;

    for(let j=0 ; j< rows[0].length; j++)
    {
      line[rows[0][j]] = rows[i][j] ;
    }

    array.push(line);

    console.log(array);
    console.log(line);
  }
  //res.json( { status: 'unimplemented!!!'} );
  res.json(array);
}
app.get('/api', onGet);

async function onPost(req, res) {
  const messageBody = req.body;

  const keyinput = Object.keys(messageBody);
  const valueinput = Object.values(messageBody);

  const result = await sheet.getRows();
  const rows = result.rows;

  var postrow = [] ;

  let n = 0 ;

  // TODO(you): Implement onPost.

    console.log(keyinput);
    console.log(valueinput);

  while( n < keyinput.length)
  {
    for(let i=0 ; i<rows[0].length; i++)
    {
      if(rows[0][i] === keyinput[n])
      {
        postrow[i] = valueinput[n];
        n++ ;
      }
    }
  }

  await sheet.appendRow(postrow);
  res.json({"response": "success"});

  //res.json( { status: 'unimplemented'} );
}
app.post('/api', jsonParser, onPost);

async function onPatch(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  const messageBody = req.body;

  const keyinput = Object.keys(messageBody);
  const valueinput = Object.values(messageBody);

  const result = await sheet.getRows();
  const rows = result.rows;

  let beupdate1 ;
  let beupdate2 ;
  let n=0 ;
  var patchrow = [] ;

  // TODO(you): Implement onPatch.

  for(let i=0 ; i<rows[0].length;i++)
  {
      if(rows[0][i] === column)
      {
          beupdate1 = i ;
          break ;
      }
  }

  for(let i=1 ; i<rows.length; i++)
  {
    if(rows[i][beupdate1] === value)
    {
      beupdate2 = i ;
      break ;
    }
  }

  patchrow[beupdate1] = rows[beupdate2][beupdate1] ;

    while( n < keyinput.length)
    {
        for(let i=0 ; i<rows[0].length; i++)
        {
            if(rows[0][i] === keyinput[n])
            {
                patchrow[i] = valueinput[n];
                n++ ;
            }
        }
    }

    console.log(patchrow);

    await sheet.setRow(beupdate2 , patchrow);
    res.json({"response": "success" });

  //res.json( { status: 'unimplemented'} );
}
app.patch('/api/:column/:value', jsonParser, onPatch);

async function onDelete(req, res) {
  const column  = req.params.column;
  const value  = req.params.value;
  const result = await sheet.getRows();
  const rows = result.rows ;

  let bedelete ;

  // TODO(you): Implement onDelete.

    console.log(column);
    console.log(value);

    for(let i=0 ; i<rows[0].length; i++)
    {
      if(rows[0][i] === column)
      {
        bedelete = i ;
        break ;
      }
    }

    for(let i=0 ; i<rows.length; i++)
    {
      if(rows[i][bedelete] === value)
      {
        await sheet.deleteRow(i);
        res.json({"response": "success" });
        break;
      }
    }

  //res.json( { status: 'unimplemented'} );
}
app.delete('/api/:column/:value',  onDelete);


// Please don't change this; this is needed
const port = process.env.PORT || 3000;

app.listen(port, function () {
	  console.log(`Server listening on port ${port}!`);
});


