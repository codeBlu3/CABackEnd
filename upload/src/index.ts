import express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'
import * as path from 'path'
import * as fs from 'fs'
import md5 from 'blueimp-md5'
import  csv from 'csv-parser'

const app = express();
app.use(bodyParser.json());

//limits: { fieldSize: 25 * 2048 * 2048  } //what size is this ??
const upload = multer({
  });

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});	

/*
console.log(__dirname)
let a = fs.readdirSync('./src/images')
console.log(a)

*/

//app.use('/images', express.static('./src/images'));
//app.use('/images', express.static('./src/images')); csv? 
// should be base 64
app.post('/api/upload', upload.array('document'), function(req, res) {

    let base64Data  =  req.body.datauri
    let csvData = base64Data
    let fname = req.body.filename
//avoid file name collision
    console.log(fname)
    fs.writeFile(`./src/upload/${fname}`, csvData, 'base64', function(err) {
        if (err) console.log(err);
    });
    res.status(200).json({
      uploadstatus: 'success', 
      filename: fname, 
  });
});


//offload ba to sa fastapi? 
app.get('/api/headers',  (req, res) => {
//static upload please // eto pala ang error sa mobile 
fs.createReadStream(`./src/images/pi.csv`)
  .pipe(csv())
  .on('headers', (headers: any) => {
    console.log(`First header: ${headers[0]}`)
    console.log(headers)
  //  res.send(headers)
    res.status(200).json({
      headersColumns :headers 
    })

  })
}) 



app.post('/api/headersselected',  function(req, res) {

  console.log(req.body)
})


app.listen(process.env.PORT || 3000, () => {
  console.log(
    `server is running at http://localhost:${process.env.PORT || 3000}`
  );
});


/* 
    let fulluri = req.body.datauri;
    let base64Data  = fulluri.split(',')[1]
    let fext = fulluri.split(',')[0].split(';')[0].split('/')[1]
    let fname = md5(base64Data) + '.' + fext

*/
