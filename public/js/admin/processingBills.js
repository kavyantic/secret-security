
// $(document).ready(function() {    
//     document.getElementById('upload-bill-status').addEventListener('change', (e)=>{
//         getJsonFromExcel(e.target,(obj)=>{
//                              url = "/admin/bills/electricity/uploadStatus"
//                              axios({
//                                 method: 'post',
//                                 url: url,
//                                 data: JSON.stringify(obj),
//                                 contentType: "application/json; charset=utf-8",
//                                 dataType: "json",
//                               })
//                             // .then(res=>res.json())
//                             .then(obj=>{console.log(obj)})
                              
//         })
        
//     });
// } );
const billTable = document.querySelector('#dataTable')
$(document).ready(function() {
    finalTable(billTable)   
} );

