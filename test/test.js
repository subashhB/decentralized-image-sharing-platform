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
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), "Id is correct")
      assert.equal(event.hash, hash, "Hash is correct")
      assert.equal(event.description, "Image Description", "Description is correct")
      assert.equal(event.tipAmount, '0', "Tip Amount is correct")
      assert.equal(event.author, author, 'Author address is correct')

      //Checking whether the image has hash or not
      await deinsta.uploadImage('', "Image Description", {from: author}).should.be.rejected
      //Checking for the blank desciption
      await deinsta.uploadImage("Image Hash", "", {from: author}).should.be.rejected
    })
    it('list images', async ()=>{
      const image = await deinsta.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), "Id is correct")
      assert.equal(image.hash, hash, "Hash is correct")
      assert.equal(image.description, "Image Description", "Description is correct")
      assert.equal(image.tipAmount, '0', "Tip Amount is correct")
      assert.equal(image.author, author, 'Author address is correct')
    })
    it('allows the users to tip image', async()=>{
      //Track the author balance before the purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await deinsta.tipImageOwner(imageCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')})

      const event = result.logs[0].args
      assert.equal(event.id.toNumber(),imageCount, 'Id is Correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, "Image Description", "Description is correct")
      assert.equal(event.tipAmount, '1000000000000000000', "Tip Amount is correct")
      assert.equal(event.author, author, "Author address is correct")

      //Check the Author Balance has been increased after tipping
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = await web3.utils.BN(newAuthorBalance)

      //Check the Balance of the tipper if it has been decreased
      let tippedBalance
      tippedBalance = await web3.utils.toWei('1','Ether')
      tippedBalance = await web3.utils.BN(tippedBalance)

      const expectedBalance = oldAuthorBalance.add(tippedBalance)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      //Trying to tip an image that doesn't exist
      await deinsta.tipImageOwner(99,{from: tipper, value: web3.utils.toWei('1','Ether')}).should.be.rejected
    })
  })
})