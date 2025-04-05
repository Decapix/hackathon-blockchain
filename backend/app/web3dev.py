from web3 import Web3
import json
from eth_account.messages import encode_defunct

# Connexion à un nœud Ethereum (par exemple, Infura)
infura_url = 'https://rpc1.bahamut.io'
web3 = Web3(Web3.HTTPProvider(infura_url))

# Vérifiez la connexion
if not web3.is_connected():
    raise ConnectionError("Failed to connect to Ethereum node")

# Adresse du contrat déployé
contract_address = '0xB0F3C35906360e3e6B779FBA21ca812d5d69a377'

# Lire le fichier ABI.js
with open('ABI.js', 'r') as file:
    contract_abi = json.load(file)

# Charger le contrat
contract = web3.eth.contract(address=contract_address, abi=contract_abi)

# Adresse de l'utilisateur et clé privée (pour signer les transactions)
user_address = '0xAdresseDeLUtilisateur'
private_key = 'VotreCléPrivée'

def get_test_score(infura_url, contract_address, contract_abi, user_address):
    """
    Récupère le score de test d'un utilisateur à partir d'un contrat intelligent Ethereum.

    :param infura_url: URL du nœud Ethereum (par exemple, Infura).
    :param contract_address: Adresse du contrat déployé.
    :param contract_abi: ABI du contrat sous forme de liste.
    :param user_address: Adresse Ethereum de l'utilisateur.
    :return: Score de test de l'utilisateur.
    """

    # Appeler la fonction de lecture
    try:
        score = contract.functions.getTestScore(user_address).call()
        return score
    except Exception as e:
        raise RuntimeError(f"Erreur lors de l'appel de la fonction : {e}")






def sign_message(message, private_key):
    # Encoder le message pour la signature
    encoded_message = encode_defunct(text=message)
    # Signer le message encodé
    signed_message = Account.sign_message(encoded_message, private_key=private_key)
    return signed_message.signature


# Enregistrer le consentement
def record_consent(email_hash, test_id):
    consent_message = "RECORD_CONSENT" + user_address[2:] + email_hash.hex() + test_id.hex()
    consent_signature = sign_message(consent_message, private_key)

    auth_message = "AUTH_MESSAGE"  # Remplacez par le message d'authentification approprié
    auth_signature = sign_message(auth_message, private_key)

    tx_hash = contract.functions.recordConsent(
        email_hash,
        test_id,
        consent_signature,
        auth_signature
    ).transact({'from': user_address})

    receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    print(f"Consentement enregistré : {receipt}")

# Démarrer un test
def start_test(test_id, total_questions):
    start_message = "START_TEST" + user_address[2:] + test_id.hex() + str(total_questions)
    start_signature = sign_message(start_message, private_key)

    tx_hash = contract.functions.startTestWithSignature(
        test_id,
        total_questions,
        start_signature
    ).transact({'from': user_address})

    receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    print(f"Test démarré : {receipt}")

# Compléter un test
def complete_test(test_id, correct_answers, fraud_score, metadata_uri):
    complete_message = "COMPLETE_TEST" + user_address[2:] + test_id.hex() + str(correct_answers) + str(fraud_score) + metadata_uri
    complete_signature = sign_message(complete_message, private_key)

    tx_hash = contract.functions.completeTestWithSignature(
        test_id,
        correct_answers,
        fraud_score,
        metadata_uri,
        complete_signature
    ).transact({'from': user_address})

    receipt = web3.eth.waitForTransactionReceipt(tx_hash)
    print(f"Test complété : {receipt}")
