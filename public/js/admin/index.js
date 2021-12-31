const accountTypeSelector = document.querySelector('#admin-new-member-account-type')
const newMemberForm = document.querySelector('#admin-new-member-form')
const sponseredByInput = document.querySelector('#sponsered-by-input')

// accountTypeSelector.addEventListener('change',(event)=>{
//     selectedValue = event.target.value.toLowerCase()

//     if(selectedValue=="retailer"){
//         console.log("helo");
//         newMemberForm.setAttribute('action',`/admin/members/register/retailer`)
//         sponseredByInput.style.display = "flex"
//     } else if(selectedValue=="distributor") {
//         newMemberForm.setAttribute('action',`/admin/members/register/distributor`)
//         sponseredByInput.style.display = "none"

//     }
// })

const billTable = document.querySelector('#dataTable')
$(document).ready(function() {
    finalTable(billTable)   
} );










 



