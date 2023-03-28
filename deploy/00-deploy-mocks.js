const { network } = require("hardhat")
const { developmentChain } = require("../helper-hardhat-config")

const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() // 获得命名账户（部署者）
    const chainId = network.config.chainId

    // 通过【链id】来使用不同的价格地址
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks deployed!")
        log("-----------------------------------")
    }
}

// yarn hardhat deploy --tags mocks
module.exports.tags = ["all", "mocks"] // 打标签
