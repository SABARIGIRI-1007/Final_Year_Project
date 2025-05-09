const Bank = artifacts.require('Bank');

contract('Bank', (accounts) => {
  let bank;
  const [owner, employee1] = accounts;

  beforeEach(async () => {
    bank = await Bank.new();
  });

  it('should deposit and track balance', async () => {
    await bank.deposit({ from: owner, value: web3.utils.toWei('1', 'ether') });
    const balance = await bank.balances(owner);
    assert.equal(web3.utils.fromWei(balance, 'ether'), '1');
  });

  it('should process payroll correctly', async () => {
    await bank.manageEmployee(employee1, web3.utils.toWei('0.1', 'ether'), 0, { from: owner });
    await bank.deposit({ from: owner, value: web3.utils.toWei('1', 'ether') });
    
    const initialBalance = await web3.eth.getBalance(employee1);
    await bank.processPayroll({ from: owner });
    const finalBalance = await web3.eth.getBalance(employee1);
    
    assert.isAbove(Number(finalBalance), Number(initialBalance));
  });
});
