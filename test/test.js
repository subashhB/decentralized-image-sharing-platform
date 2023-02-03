const { assert } = require('chai')

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
  describe('images', async ()=>{
    let result, imageCount
    const hash = 'imgHash'
    before(async()=>{
      result = await deinsta.uploadImage(hash,"Image Description", {from: author});
      imageCount = await deinsta.imageCount()
    })
    it('creates images', async()=>{
      assert.equal(imageCount, 1)
      console.log(result.logs[0].args)
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "Id is correct")
      assert.equal(event.hash, hash, "Hash is correct")
      assert.equal(event.description, "Image Description", "Description is correct")
      assert.equal(event.tipAmount, '0', "Tip Amount is correct")
      assert.equal(event.author, author, 'Author address is correct')
    })
  })
})