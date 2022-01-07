const requestingUser = document.querySelector("#requestingUser")
const requestedAmount =  document.querySelector("#requestedAmount")
const transactionId = document.querySelector("#transactionId")
const requestingAccountType = document.querySelector("#requestingAccountType")
const updateFundRequestButtons = document.querySelectorAll("td.td.update-fund-button > button")
updateFundRequestButtons.forEach(btn=>{
    btn.addEventListener('click',e=>{
        let id = e.target.getAttribute('transationId')
        let tRow = document.querySelector(`tr#t${id}`)
        requestingAccountType.value =  tRow.querySelector('.requesting-account-type').innerHTML
        transactionId.value = id
        requestedAmount.value = tRow.querySelector('.transaction-amount').innerHTML+" ₹"
        requestingUser.value = tRow.querySelector('.requesting-username').innerHTML
    })

})