const express = require('express');
const PORT = 5000;
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');



app.use(bodyParser.json())

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/books',(req,res)=>{
    let bookList = [];
    let filePath = './collection/';
    fs.readdirSync(filePath).forEach(file => {
        let files = filePath+file;
        let fileData = fs.readFileSync(files, { encoding: 'utf-8'},function(err,data){
            console.log(err)
        });
        let jsonData = JSON.parse(fileData)
        bookList.push(jsonData);
      });
    res.json(bookList);
});


app.post('/books',(req,res)=>{
    const uid = Date.now()*112;
    const folderPath = './collection/'
    const fileName = folderPath+uid+'.json';
    const {title ,author, publishedDate } = req.body;

    if(!title || !author ){
        let msg = {
            "status":"error",
            "messages": "Title and author is required."
        }
        res.json(msg);
    }


    let data ={
            "id": uid,
            "title": title,
            "author": author,
            "publishedDate":publishedDate
        };
    let datas = JSON.stringify(data);
    fs.writeFile(fileName, datas, function(error){
       if(!error){
        console.log('file is created');
       }else{
        console.log(error);
       }
    });
    
    res.json(data);
   
});



app.delete('/books/:id',(req,res)=>{
    // Check data is exist or not
    let folderPath = './collection/';
    let requestedId = req.params.id;
    let fullPath = folderPath+requestedId+'.json';
    let checkIsExist = fs.existsSync(fullPath);
    var msg;
    var status;
    if(checkIsExist){
       const isDelete =  fs.unlinkSync(fullPath);
       status = 200;
       msg = {"message":"Book Deleted Successfully"}; 
    }else{
        status = 404;
         msg = {"message":"Book Not Found Please make sure you enter correct id"}; 
    }
    res.json(status,msg);
})


app.listen(PORT,function(){
    console.log(`Server is running at port ${PORT}`);
})