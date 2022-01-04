const fs = require('fs')
// map = {}
// var maps = [
//     'ID',           'Name',
//     'CustomerNo',   'State',
//     'Department',   'Due Date',
//     'Amount',       'Status',
//     'Submitted At', 'Submitted By',
//     'Action'
//   ]
// maps.forEach(e=>{
//     map[e]=e
// })
// console.log(map);
// const readXlsxFile = require('read-excel-file/node')
// ex = fs.createReadStream('C:\\Users\\kavya\\Downloads\\xlsx (3).xlsx')
// readXlsxFile(ex,{map}).then(({rows}) => {
//     // if(err){
//     //     console.log(err);
//     // } else {
//         console.log(rows,err);
//     // }
//   })

const xlsx = require('node-xlsx')
ex = fs.readFileSync('C:\\Users\\kavya\\Downloads\\xlsx (3).xlsx')
a = xlsx.parse(ex)
arr = []


console.log(arr);
