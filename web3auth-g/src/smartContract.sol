// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestEvaluator {
    enum TestStatus { Unset, Initialized, InProgress, Completed, Failed }

    // Structure complète de la session de test
    struct TestSession {
        // Identifiants et informations générales
        address wallet;
        bytes32 emailHash;
        bytes32 testId;
        
        // Consentement et signature
        bytes consentSignature;
        uint64 consentTimestamp;
        
        // Temps et durée
        uint64 startTime;
        uint64 endTime;
        uint32 durationSeconds;
        
        // Informations du test et résultats
        uint16 totalQuestions;
        uint16 correctAnswers;
        uint16 score;     // Sur 10000 (100.00%)
        bool passed;
        
        // Statut et métadonnées
        TestStatus status;
        uint8 fraudScore;
        string metadataURI;
        
        // Données SIWE (Sign-In With Ethereum)
        string siweMessage;
        bytes siweSignature;
    }

    // Mappings pour stocker les tests
    mapping(address => TestSession) public testSessions;
    mapping(bytes32 => address) public testIdToAddress;
    mapping(address => bytes32[]) public userTestHistory;

    // Événements
    event TestInitialized(address indexed user, bytes32 testId, uint64 timestamp);
    event TestStarted(address indexed user, bytes32 testId, uint64 timestamp, uint16 totalQuestions);
    event TestCompleted(
        address indexed user, 
        bytes32 testId, 
        uint16 score, 
        bool passed, 
        uint64 startTime,
        uint64 endTime, 
        uint32 duration
    );

    /**
     * @dev Initialise un nouveau test avec les informations de base
     * @param emailHash Hash de l'email du candidat (bytes32)
     * @param testId Identifiant unique du test (bytes32)
     * @param consentSignature Signature du message de consentement (SIWE) 
     * @param siweMessage Message SIWE complet (optionnel)
     */
    function initializeTest(
        bytes32 emailHash,
        bytes32 testId,
        bytes calldata consentSignature,
        string calldata siweMessage
    ) external {
        require(testSessions[msg.sender].status == TestStatus.Unset, "Test already exists for this address");

        // Initialisation de la session de test
        TestSession storage session = testSessions[msg.sender];
        
        // Identifiants
        session.wallet = msg.sender;
        session.emailHash = emailHash;
        session.testId = testId;
        
        // Consentement
        session.consentSignature = consentSignature;
        session.consentTimestamp = uint64(block.timestamp);
        
        // Initialisation des temps
        session.startTime = 0;
        session.endTime = 0;
        session.durationSeconds = 0;
        
        // Initialisation du statut et des résultats
        session.totalQuestions = 0;
        session.correctAnswers = 0;
        session.score = 0;
        session.passed = false;
        session.status = TestStatus.Initialized;
        session.fraudScore = 0;
        session.metadataURI = "";
        
        // Données SIWE
        session.siweMessage = siweMessage;
        session.siweSignature = consentSignature;

        // Associations pour faciliter les recherches
        testIdToAddress[testId] = msg.sender;
        userTestHistory[msg.sender].push(testId);

        emit TestInitialized(msg.sender, testId, session.consentTimestamp);
    }

    /**
     * @dev Démarre un test déjà initialisé
     * @param totalQuestions Nombre total de questions du test
     * @param startTimeOverride Timestamp de début personnalisé (0 pour utiliser block.timestamp)
     */
    function startTest(
        uint16 totalQuestions,
        uint64 startTimeOverride
    ) external {
        TestSession storage session = testSessions[msg.sender];
        
        require(session.status == TestStatus.Initialized, "Test not initialized or already started");
        require(totalQuestions > 0, "Number of questions must be greater than 0");

        // Mise à jour des informations du test
        session.startTime = startTimeOverride > 0 ? startTimeOverride : uint64(block.timestamp);
        session.totalQuestions = totalQuestions;
        session.status = TestStatus.InProgress;

        emit TestStarted(msg.sender, session.testId, session.startTime, totalQuestions);
    }

    /**
     * @dev Complète un test en cours
     * @param correctAnswers Nombre de réponses correctes
     * @param fraudScore Score de fraude (0-100)
     * @param metadataURI URI des métadonnées du test (IPFS ou autre)
     * @param endTimeOverride Timestamp de fin personnalisé (0 pour utiliser block.timestamp)
     */
    function completeTest(
        uint16 correctAnswers,
        uint8 fraudScore,
        string calldata metadataURI,
        uint64 endTimeOverride
    ) external {
        TestSession storage session = testSessions[msg.sender];
        
        require(session.status == TestStatus.InProgress, "Test not in progress");
        require(correctAnswers <= session.totalQuestions, "Correct answers cannot exceed total questions");
        
        // Mise à jour des temps
        session.endTime = endTimeOverride > 0 ? endTimeOverride : uint64(block.timestamp);
        session.durationSeconds = uint32(session.endTime - session.startTime);
        
        // Mise à jour des résultats
        session.correctAnswers = correctAnswers;
        session.fraudScore = fraudScore;
        session.metadataURI = metadataURI;
        
        // Calcul du score et du résultat
        session.score = _calculateScore(correctAnswers, session.totalQuestions);
        session.passed = (session.score >= 6000); // 60% pour réussir
        session.status = TestStatus.Completed;
        
        emit TestCompleted(
            msg.sender, 
            session.testId, 
            session.score, 
            session.passed, 
            session.startTime,
            session.endTime,
            session.durationSeconds
        );
    }

    /**
     * @dev Permet de récupérer toutes les informations d'une session de test
     * @param user Adresse du wallet du candidat
     * @return La session de test complète
     */
    function getTestSession(address user) public view returns (
        address wallet,
        bytes32 emailHash,
        bytes32 testId,
        uint64 consentTimestamp,
        uint64 startTime,
        uint64 endTime,
        uint32 durationSeconds,
        uint16 totalQuestions,
        uint16 correctAnswers,
        uint16 score,
        bool passed,
        TestStatus status,
        uint8 fraudScore,
        string memory metadataURI
    ) {
        TestSession memory session = testSessions[user];
        return (
            session.wallet,
            session.emailHash,
            session.testId,
            session.consentTimestamp,
            session.startTime,
            session.endTime,
            session.durationSeconds,
            session.totalQuestions,
            session.correctAnswers,
            session.score,
            session.passed,
            session.status,
            session.fraudScore,
            session.metadataURI
        );
    }
    
    /**
     * @dev Permet de récupérer la signature SIWE d'une session de test
     * @param user Adresse du wallet du candidat
     * @return Le message SIWE et la signature
     */
    function getTestSignature(address user) public view returns (
        string memory siweMessage,
        bytes memory siweSignature
    ) {
        TestSession memory session = testSessions[user];
        return (
            session.siweMessage,
            session.siweSignature
        );
    }
    
    /**
     * @dev Permet d'obtenir l'historique des tests d'un utilisateur
     * @param user Adresse du wallet du candidat
     * @return Le nombre de tests et la liste des identifiants
     */
    function getUserTestHistory(address user) public view returns (
        uint256 testCount,
        bytes32[] memory testIds
    ) {
        bytes32[] memory ids = userTestHistory[user];
        return (
            ids.length,
            ids
        );
    }

    /**
     * @dev Enregistre un test complet avec toutes les données en une seule transaction
     * @param emailHash Hash de l'email du candidat
     * @param testId Identifiant unique du test
     * @param consentSignature Signature de consentement
     * @param consentTimestamp Timestamp du consentement
     * @param startTime Timestamp de début du test
     * @param endTime Timestamp de fin du test
     * @param totalQuestions Nombre total de questions
     * @param correctAnswers Nombre de réponses correctes
     * @param fraudScore Score de fraude
     * @param metadataURI URI des métadonnées
     * @param siweMessage Message SIWE
     */
    function completeTestFull(
        bytes32 emailHash,
        bytes32 testId,
        bytes calldata consentSignature,
        uint64 consentTimestamp,
        uint64 startTime,
        uint64 endTime,
        uint16 totalQuestions,
        uint16 correctAnswers,
        uint8 fraudScore,
        string calldata metadataURI,
        string calldata siweMessage
    ) external {
        // Vérifier que le testId est unique ou associé à cet utilisateur
        require(testIdToAddress[testId] == address(0) || testIdToAddress[testId] == msg.sender, 
                "Test ID already assigned to another user");
        
        // Calculer la durée
        uint32 durationSeconds = uint32(endTime - startTime);
        
        // Calculer le score
        uint16 score = _calculateScore(correctAnswers, totalQuestions);
        
        // Déterminer si le test est réussi
        bool passed = (score >= 6000); // 60% pour réussir
        
        // Créer une nouvelle entrée de test complète
        TestSession storage session = testSessions[msg.sender];
        
        // Identifiants
        session.wallet = msg.sender;
        session.emailHash = emailHash;
        session.testId = testId;
        
        // Consentement
        session.consentSignature = consentSignature;
        session.consentTimestamp = consentTimestamp;
        
        // Temps
        session.startTime = startTime;
        session.endTime = endTime;
        session.durationSeconds = durationSeconds;
        
        // Résultats
        session.totalQuestions = totalQuestions;
        session.correctAnswers = correctAnswers;
        session.score = score;
        session.passed = passed;
        
        // Statut et métadonnées
        session.status = TestStatus.Completed;
        session.fraudScore = fraudScore;
        session.metadataURI = metadataURI;
        
        // SIWE
        session.siweMessage = siweMessage;
        session.siweSignature = consentSignature;
        
        // Associations pour faciliter les recherches
        testIdToAddress[testId] = msg.sender;
        
        // Ajouter ce test à l'historique de l'utilisateur si c'est un nouveau test
        if (testIdToAddress[testId] == address(0)) {
            userTestHistory[msg.sender].push(testId);
        }
        
        // Émettre l'événement
        emit TestCompleted(
            msg.sender,
            testId,
            score,
            passed,
            startTime,
            endTime,
            durationSeconds
        );
    }
    
    /**
     * @dev Calcule le score en pourcentage (0-10000 pour 0-100%)
     * @param correct Nombre de réponses correctes
     * @param total Nombre total de questions
     * @return score Score en pourcentage (multiplié par 100)
     */
    function _calculateScore(uint16 correct, uint16 total) private pure returns (uint16) {
        return total > 0 ? uint16((correct * 10000) / total) : 0;
    }
}