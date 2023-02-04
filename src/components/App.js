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
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
  }
  constructor(props) {
    super(props)
    this.state = {
      account: '',
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