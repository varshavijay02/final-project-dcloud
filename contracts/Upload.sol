// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 < 0.9.0;

contract Upload {
    struct Access{
        address user;
        bool access;
    }

    mapping(address => string[]) items;
    mapping(address => Access[]) accessList;
    mapping(address => mapping(address=>bool)) ownership;
    mapping(address => mapping(address=>bool)) previousState;

    function add(address _user, string memory item) external{
        items[_user].push(item);
    }

    function allow(address _user) external{
        ownership[msg.sender][_user]=true;
        if(previousState[msg.sender][_user]==true){
            for(uint i=0;i<accessList[msg.sender].length;i++){
                if(accessList[msg.sender][i].user==_user){
                    accessList[msg.sender][i].access=true;
                }
            }
        }
        else{
            accessList[msg.sender].push(Access(_user,true));
            previousState[msg.sender][_user]=true;
        }
    }

    function revoke(address _user) external{
        ownership[msg.sender][_user]=false;
        for(uint i=0; i< accessList[msg.sender].length;i++){
            if(accessList[msg.sender][i].user==_user){
                accessList[msg.sender][i].access=false;
            }
        }
    }

    function display(address _user) external view returns(string[] memory){
        require(_user==msg.sender || ownership[_user][msg.sender]==true, "Access Denied!!!");
        return items[_user];
    }

    function sharedAccess() public view returns(Access[] memory){
        return accessList[msg.sender];
    }
}