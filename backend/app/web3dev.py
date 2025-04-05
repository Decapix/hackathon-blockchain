
from web3 import Web3
import solcx
from solcx import compile_source


# Initialize Web3 connection
web3 = Web3(Web3.HTTPProvider('https://rpc1.bahamut.io'))

def get_latest_block():
    """Function to get the latest block number from the Ethereum blockchain."""
    if web3.is_connected():
        latest_block = web3.eth.block_number
        return {"latest_block": latest_block}
    else:
        return {"error": "Failed to connect to the Ethereum node"}


def compile_solidity_contract(file_path):
    """
    Compiles a Solidity contract from a .sol file.

    :param file_path: Path to the .sol file.
    :return: A tuple containing the contract ABI and bytecode.
    """
    # Read the Solidity contract source code
    with open(file_path, 'r') as file:
        contract_source_code = file.read()

    # Compile the Solidity contract
    compiled_sol = compile_source(contract_source_code)

    # Extract the contract interface (ABI) and bytecode
    contract_id = list(compiled_sol.keys())[0]  # Get the first contract ID
    contract_interface = compiled_sol[contract_id]['abi']
    bytecode = compiled_sol[contract_id]['bin']

    return contract_interface, bytecode



def deploy_contract(contract_interface, bytecode, provider_url, account_address, private_key):
    """
    Deploys a compiled contract to the Ethereum blockchain.

    :param contract_interface: The ABI of the contract.
    :param bytecode: The bytecode of the contract.
    :param provider_url: The URL of the Ethereum node.
    :param account_address: The address of the deploying account.
    :param private_key: The private key of the deploying account.
    :return: The address of the deployed contract.
    """
    # Connect to the Ethereum node
    web3 = Web3(Web3.HTTPProvider(provider_url))

    # Set the default account
    web3.eth.default_account = account_address

    # Create the contract instance
    MyContract = web3.eth.contract(abi=contract_interface, bytecode=bytecode)

    # Build the transaction to deploy the contract
    transaction = MyContract.constructor("Hello, world!").build_transaction({
        'from': account_address,
        'nonce': web3.eth.get_transaction_count(account_address),
        'gas': 2000000,
        'gasPrice': web3.toWei('50', 'gwei'),
    })

    # Sign the transaction
    signed_txn = web3.eth.account.sign_transaction(transaction, private_key=private_key)

    # Send the transaction
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)

    # Wait for the transaction to be mined
    tx_receipt = web3.eth.wait_for_transaction_receipt(tx_hash)

    # Get the contract address
    contract_address = tx_receipt.contractAddress
    print(f"Contract deployed at address: {contract_address}")

    return contract_address
