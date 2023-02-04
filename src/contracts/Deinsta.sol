pragma solidity ^0.5.0;

contract Deinsta {
  string public name ="De-Insta";

  uint public imageCount=0 ;

  //Store Images
  mapping(uint => Image) public images;

  struct Image{
    uint id;
    string hash;
    string description;
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
  event ImageTipped(
    uint id,
    string hash,
    string description,
    uint tipAmount,
    address payable author
  );

  //Create Images
  function uploadImage(string memory _imgHash, string memory _description) public{
    //Desciption cannot be blank for an image (Convert it to bytes from string beccause we can determine length that way.)
    require(bytes(_description).length >0, "The image description is required.");
    //To make sure that the image is provided
    require(bytes(_imgHash).length > 0,"The image is not provided");
    //To make sure that a valid uploader exists
    require(msg.sender != address(0x0), "The uploader doesn't exist");
    imageCount++;
    images[imageCount] = Image(imageCount,_imgHash,_description,0,msg.sender) ;
    emit ImageCreated(imageCount, _imgHash,_description,0,msg.sender);
  }

  //Tip Images
  function tipImageOwner(uint _id) payable public{
    //To make sure that the image id is valid
    require(_id > 0 && _id <= imageCount, "Invalid Image Id!");
    //Fetch the image you want to tip
    Image memory image = images[_id];
    //Get the address of the image uploader
    address payable author = image.author;
    //Tip the uploader by sending them Ether
    address(author).transfer(msg.value);
    //Increase the tip amount
    image.tipAmount = image.tipAmount + msg.value;
    //Put the image back to mapping
    images[_id] = image;
    emit ImageTipped(_id, image.hash, image.description, image.tipAmount, author);
  }
}