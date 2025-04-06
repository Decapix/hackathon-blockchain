// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TestEvaluator {
    enum TestStatusEnum { Unset, Initialized, InProgress, Completed }

    struct TestData {
        bytes32 emailHash;
        bytes32 testId;
        bytes32 consentHash;
        uint64 startTime;
        uint64 endTime;
        uint16 totalQuestions;
        uint16 correctAnswers;
        uint8 fraudScore;
        string metadataURI;
    }

    struct TestStatus {
        address wallet;
        uint16 score;
        bool passed;
        TestStatusEnum status;
        uint32 durationSeconds;
    }

    mapping(address => TestData) private _testData;
    mapping(address => TestStatus) private _testStatus;

    event TestInitialized(address indexed user, bytes32 testId);
    event TestStarted(address indexed user, bytes32 testId);
    event TestCompleted(address indexed user, bytes32 testId, uint16 score);

    // Initialisation sans frais de gaz
    function initializeTest(
        bytes32 emailHash,
        bytes32 testId,
        bytes32 consentHash
    ) external {
        _testData[msg.sender] = TestData({
            emailHash: emailHash,
            testId: testId,
            consentHash: consentHash,
            startTime: 0,
            endTime: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            fraudScore: 0,
            metadataURI: ""
        });

        _testStatus[msg.sender] = TestStatus({
            wallet: msg.sender,
            score: 0,
            passed: false,
            status: TestStatusEnum.Initialized,
            durationSeconds: 0
        });

        emit TestInitialized(msg.sender, testId);
    }

    // Démarrage sans frais de gaz
    function startTest(
        uint16 totalQuestions
    ) external {
        TestData storage data = _testData[msg.sender];
        TestStatus storage status = _testStatus[msg.sender];

        require(status.status == TestStatusEnum.Initialized, "Invalid status");

        data.startTime = uint64(block.timestamp);
        data.totalQuestions = totalQuestions;
        status.status = TestStatusEnum.InProgress;

        emit TestStarted(msg.sender, data.testId);
    }

    // Finalisation sans frais de gaz
    function completeTest(
        uint16 correctAnswers,
        uint8 fraudScore,
        string calldata metadataURI
    ) external {
        TestData storage data = _testData[msg.sender];
        TestStatus storage status = _testStatus[msg.sender];

        require(status.status == TestStatusEnum.InProgress, "Invalid status");

        data.endTime = uint64(block.timestamp);
        data.correctAnswers = correctAnswers;
        data.fraudScore = fraudScore;
        data.metadataURI = metadataURI;

        status.durationSeconds = uint32(data.endTime - data.startTime);
        status.score = _calculateScore(correctAnswers, data.totalQuestions);
        status.passed = (status.score >= 7500); // 75% pour réussir
        status.status = TestStatusEnum.Completed;

        emit TestCompleted(msg.sender, data.testId, status.score);
    }

    // Calcul du score
    function _calculateScore(uint16 correct, uint16 total) private pure returns (uint16) {
        return total > 0 ? uint16((correct * 10000) / total) : 0;
    }

    // Nouvelle fonction pour obtenir les informations de TestData
    function getTestData(address user) public view returns (
        bytes32 testId,
        uint64 startTime,
        uint64 endTime,
        uint16 totalQuestions,
        uint16 correctAnswers,
        uint8 fraudScore,
        string memory metadataURI
    ) {
        TestData memory data = _testData[user];
        return (
            data.testId,
            data.startTime,
            data.endTime,
            data.totalQuestions,
            data.correctAnswers,
            data.fraudScore,
            data.metadataURI
        );
    }

    // Nouvelle fonction pour obtenir les informations de TestStatus
    function getTestStatus(address user) public view returns (
        address wallet,
        uint16 score,
        bool passed,
        TestStatusEnum status,
        uint32 durationSeconds
    ) {
        TestStatus memory statusInfo = _testStatus[user];
        return (
            statusInfo.wallet,
            statusInfo.score,
            statusInfo.passed,
            statusInfo.status,
            statusInfo.durationSeconds
        );
    }
}