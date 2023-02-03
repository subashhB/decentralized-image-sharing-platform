const Deinsta = artifacts.require('./Deinsta.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Deinsta', ([deployer, author, tipper]) => {
  let deinsta

  before(async () => {
    deinsta = await Deinsta.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await deinsta.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await deinsta.name()
      assert.equal(name, 'De-Insta')
    })
  })
})