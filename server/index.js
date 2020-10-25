const express = require("express");
const app = express();
var cors = require('cors')
const AWS = require("aws-sdk");
const fs = require("fs");
const bodyParser = require('body-parser');
const docClient = new AWS.DynamoDB.DocumentClient({
    region: "us-east-2",
    accessKeyId: "",
    secretAccessKey: ""
});
// AWS.config.update({
//     region: "us-east-2",
// });



app.use(cors());
app.use(bodyParser.json());
app.listen(3001,(err)=>{
    if(err){
        console.log("Loi",err);
    }
    else {
        console.log("server running port: ",3001);
    }
});


app.post('/api/addSinhVien',(req,res)=>{
    const id =  req.body.id;
    const ma_sinhvien = req.body.ma_sinhvien;
    const ten_sinhvien = req.body.ten_sinhvien;
    const ngay_sinh = req.body.ngay_sinh;
    const avatar = req.body.avatar;
    const params_addSinhVien = {
        TableName: "Student",
        Item :{
            "id" : id,
            "ma_sinhvien" : ma_sinhvien,
            "ten_sinhvien" : ten_sinhvien,
            "ngay_sinh": ngay_sinh,
            "avatar": avatar
        }
    };
    docClient.put(params_addSinhVien,(err,data) =>{
        if(err){
            console.log("Loi khong the them student ",JSON.stringify(err,null,2));
            return res.json({msg:"false"});
        }
        else{
            console.log("Them thanh cong student: ",JSON.stringify(data,null,2));
            return res.json({msg:"true"});
        }
    });
});
// scan table
app.get('/api/getALLSinhVien',(req,res) =>{
    const params_scanStudent ={
        TableName: "Student",
    };
    console.log('Scanning Student Table...');
    docClient.scan(params_scanStudent,onScan);
    function onScan(err,data){
        if(err){
            console.log("Loi khi scan",JSON.stringify(err,null,2));
            res.send(err);
        }
        else{
            res.send(JSON.stringify({status:200,error:null,response:data.Items}));
        }
    }
});
// update student
app.post('/api/updateSinhVien',(req,res)=>{
    const id = req.body.id;
    const ma_sinhvien = req.body.ma_sinhvien;
    const ten_sinhvien = req.body.ten_sinhvien;
    const ngay_sinh = req.body.ngay_sinh;
    const avatar = req.body.avatar;
    const params_updateStudent ={
        TableName:"Student",
        Key:{
            "id":id,
            "ma_sinhvien": ma_sinhvien,
        },
        UpdateExpression: "set ten_sinhvien = :ten_sinhvien, ngay_sinh = :ngay_sinh , avatar =:avt ",
        ExpressionAttributeValues:{
            ":ten_sinhvien":ten_sinhvien,
            ":ngay_sinh":ngay_sinh,
            ":avt":avatar, 
        },
        ReturnValues:"UPDATED_NEW"
    };  
    docClient.update(params_updateStudent,(err,data) =>{
        if(err){
            console.log("Loi khi update: " , JSON.stringify(err,null,2));
            return res.json({msg:"false"});
        }
        else{
            console.log("update sinh vien thanh cong!!!",JSON.stringify(err,null,2));
            return res.json({msg:"true"});
        }
    });
}); 
//delete student
app.post('/api/deleteStudent',(req,res)=>{
    const id =  req.body.id;
    const ma_sinhvien = req.body.ma_sinhvien;
    const params_deleteStudent = {
        TableName :"Student",
        Key:{
            "id":id,
            "ma_sinhvien":ma_sinhvien
        }
    };
    console.log("delete student...");
    docClient.delete(params_deleteStudent,(err,data)=>{
        if(err){
            console.log("Loi khi xoa student!!!",JSON.stringify(err,null,2));
            return res.json({msg:"false"});
        }
        else{
            console.log("Xoa thanh cong student!!!",JSON.stringify(data,null,2));
            return res.json({msg:"true"});
        }
    });
});


////////////////////
// const dynamodb = new AWS.DynamoDB();

// const params = {
//     TableName : "Student",
//     KeySchema: [
//         { AttributeName: "id",KeyType: "HASH"},
//         { AttributeName: "ma_sinhvien",KeyType: "RANGE"},
//     ],
//     AttributeDefinitions: [
//         { AttributeName: "id",AttributeType: "N"},
//         { AttributeName: "ma_sinhvien",AttributeType: "S"},
//     ],
//     ProvisionedThroughput: {       
//         ReadCapacityUnits: 10, 
//         WriteCapacityUnits: 10
//     }
// };

// dynamodb.createTable(params , (err,data) =>{
//     if(err){
//         console.log("Loi",JSON.stringify(err,null,2));
//     }
//     else {
//         console.log("Tao bang thanh cong!!!",JSON.stringify(data,null,2));
//     }
// });
// them du lieu cho bang

// const allStudent = JSON.parse(fs.readFileSync('student.json', 'utf8'));
// allStudent.forEach((student) => {
//     const params_addStudent = {
//         TableName : "Student",
//         Item:{
//             "id":student.id,
//             "ma_sinhvien" : student.ma_sinhvien,
//             "ten_sinhvien" : student.ten_sinhvien,
//             "ngay_sinh": student.ngay_sinh,
//             "avatar": student.avatar
//         }
//     };
//     docClient.put(params_addStudent,(err,data) =>{
//         if(err){
//             console.log("Loi",JSON.stringify(err,null,2));
//         }
//         else{
//             console.log("Them thanh cong",JSON.stringify(data,null,2));
//         }
//     });
// });
