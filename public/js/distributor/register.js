const accountTypeSelector = document.querySelector("#select-account-type")
const registerForm = document.querySelector('#admin-register-member')
const checkboxes = registerForm.querySelectorAll('input[type=checkbox]')


// const action = entryForm.getAttribute('action').split('/')[1]
    accountTypeSelector.addEventListener('change',(event)=>{
        selectedValue = event.target.value.toLowerCase()
        
        console.log(selectedValue);
        if(selectedValue=="retailer"){
            registerForm.setAttribute('action',`/admin/members/register/retailer`)
        } else if(selectedValue=="distributor") {
            registerForm.setAttribute('action',`/admin/members/register/distributor`)
        } else if(selectedValue =="distributor(super)"){
            registerForm.setAttribute('action',`/admin/members/register/superdistributor`)
        }
    })

checkboxes.forEach(element => {
    element.addEventListener('change',e=>{
        e.target.value = e.target.checked
    })
});

// registerForm.addEventListener('submit',(e)=>{
//     checkboxes.forEach(c=>{
//         if(!JSON.parse(c.value)){
//         }
//     })
// })
    // registerForm.addEventListener('submit',(event)=>{
    //     event.preventDefault()
    //     console.log(new FormData(event.target));
    //     postData(event.target.getAttribute('action'),new FormData(event.target),(response)=>{
    //         console.log(response)
    //     })
        
    // })
    