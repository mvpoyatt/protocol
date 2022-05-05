// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.13;

import "hardhat/console.sol";

contract NoteFactory {

    struct Notebook {
        uint id;
        string name;
    }

    struct Entry {
        uint id;
        uint notebookId;
        uint dateCreated;
        string name;
        string text;
    }

    address public owner;
    uint internal uniqueId;

    mapping (address => Notebook[]) ownerToNotebooks;
    mapping (uint => Entry[]) notebookToEntries;

    constructor() {
        owner = msg.sender;
    }

    function _createNotebook(string memory _name) external {
        Notebook memory newNotebook;
        newNotebook = Notebook(uniqueId++, _name);
        ownerToNotebooks[msg.sender].push(newNotebook);
    }

    function _createEntry(uint _notebookId, string memory _name, string memory _text) external {
        Entry memory newEntry;
        newEntry = Entry(uniqueId++, _notebookId, block.timestamp, _name, _text);
        notebookToEntries[_notebookId].push(newEntry); 
    }

    function getNotebooksForCaller() external view returns(Notebook[] memory) {
        return ownerToNotebooks[msg.sender];
    }

    function getEntriesForNotebook(uint _notebookId) external view returns(Entry[] memory) {
        return notebookToEntries[_notebookId];
    }

}