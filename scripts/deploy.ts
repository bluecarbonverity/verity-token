import { ethers, upgrades, run } from './exports'

async function main() {
  const VerityNFT = await ethers.getContractFactory('VerityNFT')

  const verityNFT = await upgrades.deployProxy(VerityNFT, [])

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
