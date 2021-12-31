
finalTable = (table)=>{
  return new DataTable(table, {
    dom: 'Bfrtip',
    buttons: [
         'excel',"csv" ,'pdf'
    ]
})
}

buttons =  [
  'copy', 'csv', 'excel', 'pdf', 'print'
]

function getJsonFromExcel(evt,call) {
  var files = evt.files; // FileList object
  var xl2json = ExcelToJSON(files[[0]],call);
}

var ExcelToJSON = function(file,call) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = e.target.result;
      var workbook = XLSX.read(data, {
        type: 'binary'
      });
        var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[workbook.SheetNames[0]]);
        var json_object = (XL_row_object);
        call(XL_row_object)
     
    };
    reader.onerror = function(ex) {
      console.log(ex);
    };
    reader.readAsBinaryString(file);
};


// $(document).ready(function() {
//   $('#dataTable').DataTable( {
//       dom: 'Bfrtip',
//       buttons: [
//           'copy', 'csv', 'excel', 'pdf', 'print'
//       ]
//   } );
// } );
// function postData(url,data,callback){
//     var formBody = [];
//     for (var property in data) {
//         var encodedKey = encodeURIComponent(property);
//         var encodedValue = encodeURIComponent(data[property]);
//         formBody.push(encodedKey + "=" + encodedValue);
//       }
//       formBody = formBody.join("&");
//       fetch(url, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
//         },
//         body: formBody
//       })
//       .then(res=>res.json())
//       .then(obj=>{callback(obj)})

// }




