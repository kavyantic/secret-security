const accountTypeSelector = document.querySelector("#select-account-type")
const entryForm = document.querySelector('#login-form')
const redirectUrl = document.querySelector('[name=redirect]')

// const action = entryForm.getAttribute('action').split('/')[1]
accountTypeSelector.addEventListener('change',(event)=>{
    selectedValue = event.target.value.toLowerCase()
    console.log(selectedValue);
    redirectUrl.remove()
    if(selectedValue=="retailer"){
        entryForm.setAttribute('action',`/login/retailer`)
    } else if(selectedValue=="distributor") {
        entryForm.setAttribute('action',`/login/distributor`)
    } else if(selectedValue =="admin"){
        entryForm.setAttribute('action',`/login/admin`)
    }
     else if(selectedValue =="super distributor"){
    entryForm.setAttribute('action',`/login/superDistributor`)
    }
})
