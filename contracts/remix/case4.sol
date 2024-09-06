// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MusicStreamingRoyalties {
    address payable public artist;
    address payable public label;
    address payable public platformOwner;
    
    uint256 public artistCut;
    uint256 public labelCut;
    uint256 public platformOwnerCut;
    
    constructor(address payable _artist, address payable _label, address payable _platformOwner, uint256 _artistCut, uint256 _labelCut, uint256 _platformOwnerCut) {
        require(_artistCut + _labelCut + _platformOwnerCut == 100, "Royalty percents must add up to 100%");
        artist = _artist;
        label = _label;
        platformOwner = _platformOwner;
        artistCut = _artistCut;
        labelCut = _labelCut;
        platformOwnerCut = _platformOwnerCut;
    }
    
    function distributeRoyalties(uint256 amount) public {
        require(msg.sender == artist || msg.sender == label || msg.sender == platformOwner, "Only the artist, label, or platform owner can call this function");
        uint256 artistShare = (amount * artistCut) / 100;
        uint256 labelShare = (amount * labelCut) / 100;
        uint256 platformOwnerShare = (amount * platformOwnerCut) / 100;
        
        payable(artist).transfer(artistShare);
        payable(label).transfer(labelShare);
        payable(platformOwner).transfer(platformOwnerShare);
    }
}