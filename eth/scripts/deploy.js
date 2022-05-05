async function main() {
  // Get the contract to deploy
  const NoteFactory = await ethers.getContractFactory("NoteFactory");
  const notes = await NoteFactory.deploy();

  await notes.deployed();

  console.log("NoteFactory deployed to:", notes.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
