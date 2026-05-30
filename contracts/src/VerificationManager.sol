// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./AgentRegistry.sol";

contract VerificationManager {
    enum CaseStatus { Open, InProgress, Resolved, Closed }

    struct Case {
        uint256 id;
        string description;
        CaseStatus status;
        string result;
        uint256[] assignedAgentIds;
    }

    mapping(uint256 => Case) public cases;
    uint256 public nextCaseId = 1;
    AgentRegistry public agentRegistry;

    event CaseCreated(uint256 indexed id, string description);
    event AgentAssigned(uint256 indexed caseId, uint256 indexed agentId);
    event CaseResolved(uint256 indexed id, string result);

    constructor(address _agentRegistryAddress) {
        agentRegistry = AgentRegistry(_agentRegistryAddress);
    }

    function createCase(string memory _description) external returns (uint256) {
        uint256 id = nextCaseId++;
        Case storage newCase = cases[id];
        newCase.id = id;
        newCase.description = _description;
        newCase.status = CaseStatus.Open;
        
        emit CaseCreated(id, _description);
        return id;
    }

    function assignAgent(uint256 _caseId, uint256 _agentId) external {
        require(cases[_caseId].id != 0, "Case does not exist");
        require(cases[_caseId].status == CaseStatus.Open || cases[_caseId].status == CaseStatus.InProgress, "Case not open");
        
        // Ensure agent is valid and active
        (,,,,, bool isActive) = agentRegistry.agents(_agentId);
        require(isActive, "Agent is not active");
        
        cases[_caseId].assignedAgentIds.push(_agentId);
        cases[_caseId].status = CaseStatus.InProgress;

        emit AgentAssigned(_caseId, _agentId);
    }

    function resolveCase(uint256 _caseId, string memory _result) external {
        require(cases[_caseId].id != 0, "Case does not exist");
        require(cases[_caseId].status == CaseStatus.InProgress, "Case must be in progress");
        
        cases[_caseId].status = CaseStatus.Resolved;
        cases[_caseId].result = _result;

        emit CaseResolved(_caseId, _result);
    }

    function getAssignedAgents(uint256 _caseId) external view returns (uint256[] memory) {
        return cases[_caseId].assignedAgentIds;
    }
}
