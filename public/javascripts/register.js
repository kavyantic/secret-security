const accountTypeSelector = document.querySelector("#select-account-type")
const entryForm = document.querySelector('#entry-form')
const action = entryForm.getAttribute('action').split('/')[1]

accountTypeSelector.addEventListener('change',(event)=>{
    selectedValue = event.target.value.toLowerCase()
    console.log(selectedValue);

    if(selectedValue=="retailer"){
        entryForm.setAttribute('action',`/${action}/retailer`)
    } else if(selectedValue=="distributor") {

        entryForm.setAttribute('action',`/${action}/distributor`)

    } else if(selectedValue =="admin"){

        entryForm.setAttribute('action',`/${action}/admin`)

    }
})
