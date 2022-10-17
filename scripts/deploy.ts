import { ethers } from 'hardhat'

async function main() {
  const VerityNFT = await ethers.getContractFactory('VerityNFT')
  const verityNFT = await VerityNFT.deploy()

  await verityNFT.deployed()

  console.log(`Verity contract deployed to ${verityNFT.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
