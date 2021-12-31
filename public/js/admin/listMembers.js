

var infoButtons = document.querySelectorAll('.info-button')
var infoModal = document.querySelector('#infoModal')

var updateUrl = document.querySelector('#Update')
var usename = document.querySelector("#Username")
var pass = document.querySelector("#Password")
var balance = document.querySelector("#Balance")
var email = document.querySelector("#Eamil")
var mobile = document.querySelector("#Moile")
var sponseredBy = document.querySelector("#Sponsor")
var  updateBalanceForm = document.querySelector('#UpdateBalanceForm')



infoButtons.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        url = e.target.getAttribute('info-url')
        updateUrl.setAttribute('href',("/admin/members/update/"+url).replace(/([^:]\/)\/+/g, "$1"))
        updateBalanceForm.setAttribute('action',("/admin/members/updateBalance/"+url).replace(/([^:]\/)\/+/g, "$1"))
        // axios.get(url).then(
        //     data=>{
        //         console.log(data.data);
        //     }
        // )
         
    })
})


var amountInput = document.querySelector('#Amount')
var updateAmountButton = document.querySelector('.update-balance-button')
amountInput.addEventListener('input',(e)=>{
    console.log(e.target.value);
    value = e.target.value
    if(value.startsWith('-')){
        updateAmountButton.innerHTML = "Deduct"
        updateAmountButton.classList.remove('btn-primary')
        updateAmountButton.classList.add('btn-danger')

    } else {
        updateAmountButton.innerHTML = "Add"
        updateAmountButton.classList.remove('btn-danger')
        updateAmountButton.classList.add('btn-primary')
    }
   
})

