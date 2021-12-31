
$(document).ready(function() {    
    document.getElementById('upload-bill-status').addEventListener('change', (e)=>{
        getJsonFromExcel(e.target,(obj)=>{
                             url = "/admin/bills/electricity/uploadStatus"
                             axios({
                                method: 'post',
                                url: url,
                                data: JSON.stringify(obj),
                                contentType: "application/json"
                                // dataType: "json",
                              })
                            // .then(res=>res.json())
                            .then(obj=>{console.log(obj)})
     
        })
        
    });
} );
