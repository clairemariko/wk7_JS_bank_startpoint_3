var Bank = require('./bank/bank.js');
var Account = require('./bank/account.js');


var createItemForAccount = function(account){
  var accountListItem = document.createElement('li');
  accountListItem.innerText = account.owner + ": £" + account.amount;
  return accountListItem;
}

var populateAccountList = function(listElement, accounts){
  for(account of accounts){
    listElement.appendChild(createItemForAccount(account));
  }
}

var displayBank = function(bank){

  var totalDisplay = document.getElementById('total');
  var businessTotalDisplay = document.getElementById('business-total');
  var personalTotalDisplay = document.getElementById('personal-total');

  totalDisplay.innerText = "Total: £" + bank.totalCash();
  businessTotalDisplay.innerText = "Total Business: £" + bank.totalCash('business');
  personalTotalDisplay.innerText = "Total Personal: £" + bank.totalCash('personal');

  var businessAccountList = document.getElementById('business-accounts');
  var personalAccountList = document.getElementById('personal-accounts');

  businessAccountList.innerHTML = " ";
  personalAccountList.innerHTML = " ";

  populateAccountList(businessAccountList, bank.filteredAccounts('business'))
  populateAccountList(personalAccountList, bank.filteredAccounts('personal'))
}

window.onload = function(){
  var bank = new Bank();
  var request = new XMLHttpRequest();
  request.open("GET", "http://localhost:3000/accounts");

  request.onload = function(){
    if(request.status === 200){
      var jsonString = request.responseText;
      var accounts = JSON.parse(jsonString);

      for(var account of accounts){
        bank.addAccount(new Account(account));
      }
      displayBank(bank);
    }
  }
  request.send();

  var form = document.querySelector("#add-account");
  form.onsubmit = function(e){//e is event
    e.preventDefault();
    console.log('e', e);

    var accountData = {
    owner: document.querySelector("#owner").value,
    amount: parseFloat(document.querySelector("#amount").value),
    type: document.querySelector("#type").value
    };
 

    var account = new Account(accountData);
    bank.addAccount(account);

    displayBank(bank);

    //persist val
    var request = new XMLHttpRequest();
    request.open("POST", "http://localhost:3000/accounts");
    request.setRequestHeader("Content-Type", "application/json");
    request.onload =  function(){
      console.log('got response');
    }
    request.send(JSON.stringify(accountData));

  }
};
