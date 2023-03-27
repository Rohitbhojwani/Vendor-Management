// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// import "hardhat/console.sol";

contract Funds {
    address public central;
    uint public balance;
    uint public spend;
    uint transactionCount;

    struct Allocated{
        uint amount;
        uint time;
    }

    struct Government {
        address add;
        string gov_type;
        string name;
        uint balance;
        uint spend;
    }
  
    struct Transactions {
        address from;
        address to;
        string from_name;
        string to_name;
        uint time;
        uint amount;
        string project_name;
    }

    Allocated[] public alloc;
    Government[] public gov;
    Transactions[] public transactions;

    constructor() {
        central = msg.sender;
        balance=0;
        spend=0;
        transactionCount=0;
        gov.push(Government(msg.sender,"Central","Central",0,0));
    }

    function CentralLogin() public view returns (bool) {
        if(msg.sender==central){
            return true;
        }
        else{
            return false;
        }
    }

    function GovernmentLogin() public view returns (bool) {
        uint n=gov.length;
        for(uint i=0;i<n;i++){
            if(gov[i].add == msg.sender){
                return true;
            }
        }
        return false;
    }

    function GovernmentDetails() public view returns (Government memory) {
        uint n=gov.length;
        for(uint i=0;i<n;i++){
            if(gov[i].add == msg.sender){
                return gov[i];
            }
        }
        string memory e="empty";
        Government memory empty=Government(address(0),e,e,0,0);
        return empty;
    }

    function GetBalance() public view returns (uint) {
        return balance;
    }

    function GetSpend() public view returns (uint) {
        return spend;
    }

    function getTransactionCount() public view returns (uint) {
        return transactionCount;
    }

    function AddFunds(uint _amount) public {
        gov[0].balance=balance+_amount;
        alloc.push(Allocated(_amount,block.timestamp));
        balance=balance+_amount;
    }

    function getAllocatedFunds() public view returns (Allocated[] memory) {
        return alloc;
    }

    function CheckRegister(string memory _name) public view returns (bool) {
        uint n=gov.length;
        for(uint i=0;i<n;i++){
            if(keccak256(abi.encodePacked(gov[i].name)) == keccak256(abi.encodePacked(_name))){
                return false;
            }
            if(msg.sender==gov[i].add){
                return false;
            }
        }
        //gov.push(Government(msg.sender,_govtype,_name,0,0));
        return true;
    }

    function Register(address _add,string memory _govtype,string memory _name) public {
        gov.push(Government(_add,_govtype,_name,0,0));
    }

    function AllocateFunds(uint _amount, string memory _to, string memory _project) public {
        //// check if central login
        uint n=gov.length;
        uint ind;
        for(uint i=0;i<n;i++){
            if(keccak256(abi.encodePacked(gov[i].name)) == keccak256(abi.encodePacked(_to))){
                ind=i;
                break;
            }
        }
        balance=balance-_amount;
        spend=spend+_amount;
        gov[ind].balance=gov[ind].balance+_amount;
        gov[0].balance=balance;
        gov[0].spend=spend;
        transactions.push(Transactions(central,gov[ind].add,"Central",_to,block.timestamp,_amount,_project));
        transactionCount=transactionCount+1;
    }

    function TransferFunds(uint _amount, string memory _to, string memory _project) public {
        uint n=gov.length;
        uint ind_from;
        uint ind_to;
        for(uint i=0;i<n;i++){
            if(keccak256(abi.encodePacked(gov[i].name)) == keccak256(abi.encodePacked(_to))){
                ind_to=i;
                break;
            }
        }

        for(uint i=0;i<n;i++){
            if(gov[i].add == msg.sender){
                ind_from=i;
                break;
            }
        }

        gov[ind_to].balance=gov[ind_to].balance+_amount;
        gov[ind_from].balance=gov[ind_from].balance-_amount;
        gov[ind_from].spend=gov[ind_from].spend+_amount;

        transactions.push(Transactions(msg.sender,gov[ind_to].add,gov[ind_from].name,_to,block.timestamp,_amount,_project));
        transactionCount=transactionCount+1;
    }

    function getAllTrancations() public view returns (Transactions[] memory) {
        return transactions;
    }

    function getAllGovernmentAllocatedTrancations() public view returns (Transactions[] memory) {

        uint count=transactions.length;
        uint n=0;

        for(uint i = 0; i < count; i++) {
            if(transactions[i].to == msg.sender){
                n=n+1;
            }
        }

        Transactions[] memory trans = new Transactions[](n);
        uint it=0;
        for(uint i = 0; i < count; i++) {
            if(transactions[i].to == msg.sender){
                trans[it]=transactions[i];
                it=it+1;
            }
        }

        return trans;
    }

    function getAllGovernmentSpendTrancations() public view returns (Transactions[] memory) {

        uint count=transactions.length;
        uint n=0;

        for(uint i = 0; i < count; i++) {
            if(transactions[i].from == msg.sender){
                n=n+1;
            }
        }

        Transactions[] memory trans = new Transactions[](n);
        uint it=0;
        for(uint i = 0; i < count; i++) {
            if(transactions[i].from == msg.sender){
                trans[it]=transactions[i];
                it=it+1;
            }
        }

        return trans;
    }

}