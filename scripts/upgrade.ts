import { ethers, upgrades, run } from './exports'

async function main() {
  const CONTRACT_ADDRESS = '0x01Df1f172AD55F088af1B465974396d61aFE11ab'
  // const IMPLEMENTATION_ADDRESS = '0x9E79fD3B479f9F38c20f391BFc2612FbB0FADdE1'
  const VerityNFT = await ethers.getContractFactory('VerityNFTTest')
  const verityNFT = await upgrades.upgradeProxy(CONTRACT_ADDRESS, VerityNFT)

  await verityNFT.deployed()

  console.log(`Verity contract deployed to ${verityNFT.address}`)
  console.log(
    await upgrades.erc1967.getImplementationAddress(verityNFT.address),
    ' getImplementationAddress'
  )

  await run(`verify:verify`, {
    address: verityNFT.address,
    constructorArguments: [],
  })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch(error => {
  console.error(error)
  process.exitCode = 1
})
