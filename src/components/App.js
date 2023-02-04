import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Deinsta from '../abis/Deinsta.json'
import Navbar from './Navbar'
import Main from './Main'


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
            // Code...
            />
        }
      </div>
    );
  }
}

export default App;