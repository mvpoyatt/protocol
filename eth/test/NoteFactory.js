const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NoteFactory contract", function () {

  let NoteFactory;
  let NoteFactoryDeployment;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // Execute before each test
  beforeEach(async function () {
    NoteFactory = await ethers.getContractFactory("NoteFactory");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    NoteFactoryDeployment = await NoteFactory.deploy();
  });

  describe("Deployment", function () {
    // Make sure contract deploys properly
    it("Should set the right owner", async function () {
      expect(await NoteFactoryDeployment.owner()).to.equal(owner.address);
    });
  });

  describe("Writing and reading notes", function () {

    it("User can create and retrieve notebooks", async function () {
        // Create notebooks
        NoteFactoryDeployment.connect(addr1)._createNotebook("Notebook 1");
        NoteFactoryDeployment.connect(addr1)._createNotebook("Notebook 2");
        let UserNotebooks = await NoteFactoryDeployment.connect(addr1).getNotebooksForCaller();
        expect(UserNotebooks[0].name).to.equal("Notebook 1");
        expect(UserNotebooks[1].name).to.equal("Notebook 2");
    });

    it("Multiple users can create notebooks", async function () {
        NoteFactoryDeployment.connect(addr1)._createNotebook("User 1 Notebook");
        // Create second user's notebook
        NoteFactoryDeployment.connect(addr2)._createNotebook("User 2 Notebook");
        let User1Notebooks = await NoteFactoryDeployment.connect(addr1).getNotebooksForCaller();
        let User2Notebooks = await NoteFactoryDeployment.connect(addr2).getNotebooksForCaller();
        expect(User1Notebooks[0].name).to.equal("User 1 Notebook");
        expect(User2Notebooks[0].name).to.equal("User 2 Notebook");
    });

    it("User can create and retrieve new entries", async function () {
        // Create new notebook and get ID
        NoteFactoryDeployment.connect(addr1)._createNotebook("Notebook 1");
        let UserNotebooks = await NoteFactoryDeployment.connect(addr1).getNotebooksForCaller();
        let NotebookId = UserNotebooks[0].id;
        // Create entries in notebook
        NoteFactoryDeployment._createEntry(NotebookId, "Entry 1", "First entry in Notebook");
        NoteFactoryDeployment._createEntry(NotebookId, "Entry 2", "Second entry in Notebook");
        let Entries = await NoteFactoryDeployment.getEntriesForNotebook(NotebookId);
        expect(Entries[0].name).to.equal("Entry 1");
        expect(Entries[1].name).to.equal("Entry 2");
    });
  });

});