
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


const status = document.querySelector("#status")
const receipt= document.querySelector("#receipt")
const id  = document.querySelector("#receiptId")

const statusUpdate = document.querySelectorAll('.status-update.SUCCESSFUL')
statusUpdate.forEach(ele=>{
    ele.addEventListener('click',(e)=>{
            console.log(e.target.classList);
            tRow = e.target.closest('tr')
            id.value = tRow.querySelector('.id').innerHTML
            let currentStatus  = tRow.querySelector('.status').innerHTML.toLowerCase()
            // status.querySelector(`.${currentStatus}`).setAttribute('selected')
            $('#updateModal').modal('show')
        
      
    })
})
