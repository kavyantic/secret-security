$(document).ready(function() {    

    document.getElementById('upload-bill-status').addEventListener('change', (e)=>{
        getJsonFromExcel(e.target,(obj)=>{
                            var formBody = [];
                            url = "/admin/bills/electricity/uploadStatus"
                            fetch(url, {
                                method: 'POST',
                                headers: {
                                'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(obj)
                            })
                            .then(res=>res.json())
                            .then(obj=>{alert(obj)})

                        
        })
        
    });
} );
