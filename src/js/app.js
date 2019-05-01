App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async () => {
        App.readForm()
        /// Setup access to blockchain
        return await App.initWeb3()
    },

    readForm: () => {
        App.sku = $("#sku").val()
        App.upc = $("#upc").val()
        App.ownerID = $("#ownerID").val()
        App.originFarmerID = $("#originFarmerID").val()
        App.originFarmName = $("#originFarmName").val()
        App.originFarmInformation = $("#originFarmInformation").val()
        App.originFarmLatitude = $("#originFarmLatitude").val()
        App.originFarmLongitude = $("#originFarmLongitude").val()
        App.productNotes = $("#productNotes").val()
        App.productPrice = $("#productPrice").val()
        App.distributorID = $("#distributorID").val()
        App.retailerID = $("#retailerID").val()
        App.consumerID = $("#consumerID").val()
        App.address = $("#address").val()
    },

    initWeb3: async () => {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum
            try {
                // Request account access
                await window.ethereum.enable()
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
        }

        App.getMetaskAccountID()

        return App.initSupplyChain()
    },

    getMetaskAccountID: () => {
        web3 = new Web3(App.web3Provider)

        // Retrieving accounts
        web3.eth.getAccounts((err, res) => {
            if (err) {
                console.log('Error: ', err)
                return
            }
            App.metamaskAccountID = res[0]

        })
    },

    initSupplyChain: () => {
        /// Source the truffle compiled smart contracts
        const jsonSupplyChain = '/build/contracts/SupplyChain.json'

        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, (data) => {
            let SupplyChainArtifact = data
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact)
            App.contracts.SupplyChain.setProvider(App.web3Provider)

            App.fetchItemBufferOne()
            App.fetchItemBufferTwo()
            App.fetchEvents()

        })

        return App.bindEvents()
    },

    bindEvents: () => {
        $(document).on('click', App.handleButtonClick)
    },

    handleButtonClick: async (event) => {
        event.preventDefault()
        App.readForm()
        App.getMetaskAccountID()

        const processId = parseInt($(event.target).data('id'))

        switch (processId) {
            case 1:
                return await App.harvestItem(event)
            case 2:
                return await App.processItem(event)
            case 3:
                return await App.packItem(event)
            case 4:
                return await App.sellItem(event)
            case 5:
                return await App.buyItem(event)
            case 6:
                return await App.shipItem(event)
            case 7:
                return await App.receiveItem(event)
            case 8:
                return await App.purchaseItem(event)
            case 9:
                return await App.fetchItemBufferOne(event)
            case 10:
                return await App.fetchItemBufferTwo(event)
            case 11:
                return await App.addFarmer(event)
            case 12:
                return await App.addDistributor(event)
            case 13:
                return await App.addRetailer(event)
            case 14:
                return await App.addConsumer(event)
        }
    },

    harvestItem: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.harvestItem(
                App.upc,
                App.metamaskAccountID,
                App.originFarmName,
                App.originFarmInformation,
                App.originFarmLatitude,
                App.originFarmLongitude,
                App.productNotes
            )
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('harvestItem', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    processItem: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.processItem(App.upc, {
                from: App.metamaskAccountID
            })
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('processItem', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    packItem: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.packItem(App.upc, {
                from: App.metamaskAccountID
            })
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('packItem', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    sellItem: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) => {
            const productPrice = web3.toWei(App.productPrice, "ether")
            console.log(productPrice)
            return instance.sellItem(App.upc, productPrice, {
                from: App.metamaskAccountID
            })
        }).then((result) => {
            $("#ftc-item").text(result)
            console.log('sellItem', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    buyItem: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) => {
            const productPrice = web3.toWei(App.productPrice, "ether")
            console.log(productPrice)
            return instance.buyItem(App.upc, {
                from: App.metamaskAccountID,
                value: productPrice
            })
        }).then((result) => {
            $("#ftc-item").text(result)
            console.log('buyItem', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    shipItem: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.shipItem(App.upc, {
                from: App.metamaskAccountID
            })
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('shipItem', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    receiveItem: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.receiveItem(App.upc, {
                from: App.metamaskAccountID
            })
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('receiveItem', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    purchaseItem: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.purchaseItem(App.upc, {
                from: App.metamaskAccountID
            })
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('purchaseItem', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    fetchItemBufferOne: () => {
        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.fetchItemBufferOne(App.upc)
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('fetchItemBufferOne', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    fetchItemBufferTwo: () => {
        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.fetchItemBufferTwo.call(App.upc)
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('fetchItemBufferTwo', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    addFarmer: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.addFarmer(App.address)
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('addFarmer', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    addDistributor: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.addDistributor(App.address)
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('addDistributor', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    addRetailer: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.addRetailer(App.address)
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('addRetailer', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    addConsumer: (event) => {
        event.preventDefault()

        App.contracts.SupplyChain.deployed().then((instance) =>
            instance.addConsumer(App.address)
        ).then((result) => {
            $("#ftc-item").text(result)
            console.log('addConsumer', result)
        }).catch((err) => {
            console.log(err.message)
        })
    },

    fetchEvents: () => {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = () => {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                    App.contracts.SupplyChain.currentProvider,
                    arguments
                )
            }
        }

        App.contracts.SupplyChain.deployed().then((instance) => {
            instance.allEvents((err, log) => {
                if (!err) {
                    $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>')
                }
            })
        }).catch((err) => {
            console.log(err.message)
        })

    }
}

$(function () {
    $(window).load(function () {
        App.init()
    })
})
