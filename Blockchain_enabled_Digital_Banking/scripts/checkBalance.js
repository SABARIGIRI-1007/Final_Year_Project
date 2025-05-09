module.exports = async function (callback) {
    const accounts = await web3.eth.getAccounts();
    console.log("Account balance:", await web3.eth.getBalance(accounts[0]));
    callback();
  };
