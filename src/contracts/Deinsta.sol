pragma solidity ^0.5.0;

contract Deinsta {
  string public name ="De-Insta";

  uint public imageCount=0 ;

  //Store Images
  mapping(uint => Image) public images;

  struct Image{
    uint id;
    string hash;
    string desciption;
    uint tipAmount;
    address payable author;
  }
  event ImageCreated(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  //Create Images
  function uploadImage(string memory _imgHash, string memory _description) public{
    imageCount++;
    images[imageCount] = Image(imageCount,_imgHash,_description,0,msg.sender) ;
    emit ImageCreated(imageCount, _imgHash,_description,0,msg.sender);
  }

  //Tip Images
}