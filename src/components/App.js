import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Deinsta from '../abis/Deinsta.json'
import Navbar from './Navbar'
import Main from './Main'

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient('https://localhost:5001/api/v0') //if left empty it will fill the default value

class App extends Component {
  async componentWillMount(){
    await this.laodWeb3()
    await this.loadBlockChainData()
  }
  async laodWeb3(){
    if(window.ethereum){
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }else if(window.web3){
      window.web3 = new Web3(window.web3.currentProvider)
    }else{
      window.alert('No Ethereum Browser detected! Try Metamask to resolve this issue')
    }
  }
  async loadBlockChainData(){
    const web3 = await window.web3
    //Load Accounts
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    //Network ID (Ganache = 5777)
    const networkId = await web3.eth.net.getId();
    const networkData = Deinsta.networks[networkId];
    if(networkData){
      const deinsta = web3.eth.Contract(Deinsta.abi, networkData.address)
      this.setState({deinsta})
      const imageCount = await deinsta.methods.imageCount().call()
      this.setState({imageCount})
      this.setState({loading: false})
    }else{
      window.alert('De-insta Contract is not deployed to the detected network')
    }
    
  }

  captureFile = (event) =>{
    event.preventDefault()
    //Reading the file (files[0]: the file in the html)
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    //Setting the file in the format that the IPFS accepts
    reader.onloadend = () =>{
      this.setState({buffer: Buffer(reader.result)})
      console.log('buffer', this.state.buffer)
    }
  }
  uploadImage = description =>{
    console.log("Submitting file to ipfs....")
    ipfs.add(this.state.buffer, (error, result)=>{
      if(error){
        console.log(error)
        return
      }
      else{
        this.setState({loading: true})
        this.state.deinsta.methods.uploadImage(result[0], description).send({from: this.state.account}).on('transactionHash', (hash)=>{
          this.setState({loading: false})
        })
        
      }
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      deinsta: null,
      images: [],
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              captureFile = {this.captureFile}
              uploadImage = {this.uploadImage}
            />
        }
      </div>
    );
  }
}

export default App;