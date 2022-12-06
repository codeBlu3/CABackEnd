import express from 'express'
import multer from 'multer'
import bodyParser from 'body-parser'
import * as path from 'path'
import * as fs from 'fs'
import md5 from 'blueimp-md5'
import  csv from 'csv-parser'

const app = express();
app.use(bodyParser.json());

//limits: { fieldSize: 25 * 2048 * 2048  },
/*	
const upload = multer({
dest: "./src/upload/uploadchunk/" 
  });
  filename: function (req, file, cb) { 
    console.log(req.body)
    console.log(file)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }

*/	

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/upload/uploadchunk/')
  }, 
  filename: function (req, file, cb) { 
    const filehash = req.body.filehash
    const sequence = req.body.sequence
    cb(null, filehash + '_' + sequence)
  }

})




const upload = multer({ storage: storage })
const docparse = multer()


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});	


app.post('/api/upload', upload.array('document'), function(req, res) {

console.log(req)
    console.log(req.body)
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

app.post('/api/uploadchunk', upload.any(),  function(req, res) {
//add try catch here
    res.status(200).json({
      uploadstatus: 'success', 
     // filename: fname, 
  });
});


app.post('/api/mergefile', docparse.array('document'), function(req, res) {
//why sampu lang? 
    const filehash  = req.body.filehash
    const fname = req.body.filename
    let files = fs.readdirSync('./src/upload/uploadchunk/')
    files = files.filter(item => item.split('_')[0]=== filehash) // ahhh gets ko na, dahil dito, dapat pala split
    let ltChunksObj = files.map(function readChunks(item){
      const data =  fs.readFileSync(`./src/upload/uploadchunk/${item}`) 
      return {'index': parseInt(item.split('_')[1], 10) ,'chunk':data } 
    })
    ltChunksObj = ltChunksObj.sort((a,b)=> {return a.index - b.index})
    const sumLength  = ltChunksObj.map(item => item.chunk.length).reduce((a, b) => a + b, 0)
    const finalBuffer = Buffer.concat(ltChunksObj.map(item => item.chunk))
    let hash =  md5(finalBuffer.toString('base64'))
    if (filehash === hash){
      fs.writeFile(`./src/upload/${fname}`, finalBuffer,  function(err) {
        if (err) console.log(err);
    });
    } 
// should the files be deleted afterwards?
    res.status(200).json({
      uploadstatus: 'success', 
      filename: fname, 
  });
});




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
