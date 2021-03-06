function initLogin(){
    document.getElementById("renterButton").addEventListener("click", setUserType);
    document.getElementById("ownerButton").addEventListener("click", setUserType);
    document.getElementById("header").addEventListener("click", welcomeButton);
    document.getElementById('newUser').addEventListener("click", newUser);
    document.getElementById('cancel').addEventListener("click", welcomeButton);
    document.getElementById('welcomeButtons').style.display = "inline-block";
}
document.addEventListener("DOMContentLoaded", initLogin);

function welcomeButton(){
    document.getElementById('createUser').style.display="none";
    document.getElementById('login').style.display='none';
    document.getElementById('welcomeButtons').style.display='inline-block';
}

function setUserType(){
    if(this.getAttribute('id')=='renterButton'){
        //return renter login/reg
        window.userType = document.getElementById('userType').value = "renter";
    }else{
        //return manager login/reg
        window.userType = document.getElementById('userType').value = "manager";
    }
    var welcome = document.getElementById("welcomeButtons");
    welcome.style.display = "none";
    home();
   //make renter checked or add hash? then direct to proper login and registration
}

function home(){
    document.getElementById('createUser').style.display="none";
    document.getElementById('login').style.display='block';
}

function buildingListener() {
    console.log(this.responseText);
    window.buildings = JSON.parse(this.responseText);
    for (i = 0; i < buildings.length; i++) {
        console.log(buildings[i].rental_name)
    }
    buildingOptions();
}

function getBuildings(){
    oReq = new XMLHttpRequest();
    oReq.onload = buildingListener;
    oReq.open("get", "/buildings/", true);
    oReq.send();
}

function buildingOptions(){
    var bl = document.getElementById("buildingList");
        //create for loop to add to list using buildings obtained with oreq variable
        for (i = 0; i < buildings.length; i++) {
            //create a new option
            var option = document.createElement("option");
            // make the option have the name of the building
            option.innerHTML = buildings[i].rental_name;
            // set the attribute 'value' of the option to be the id of the building
            option.setAttribute('value', buildings[i].id);
            //add the option to the list
            bl.appendChild(option);
        }
}
getBuildings();
// Another way to pull out building id, then call by document.getElementById('buildingList').value
//function changeValue(){
//    newBuildingId = document.getElementById('buildingList').value;
//    console.log(newBuildingId);
//    buildingId = document.getElementById('buildingId').value;
//    console.log(buildingId);
//    buildingId = newBuildingId;
//    console.log(buildingid);
//}

function newUser(){
    document.getElementById('login').style.display='none';
     var bl = document.getElementById('buildingListContainer');
    if (userType=="manager"){
        bl.style.display="none";
    }else{
       bl.style.display="inline-block";
    }
    document.getElementById('createUser').style.display="inline-block";
}

function addUser(){
    item= {
        "action": "save",
        "id": document.getElementById("id").value,
        "userType": document.getElementById("userType").value,
        "building": document.getElementById("buildingList").value,
        "first_name": document.getElementById('first_name').value,
        "last_name": document.getElementById('last_name').value,
        "email": document.getElementById('email').value,
        "username": document.getElementById('username').value,
        "password": document.getElementById('password').value
    };
    console.log(item);
    sendUser(item,'/createUser/');
}

function sendUser(item, url){
    // create new FormData.
    // FormData holds a set of key/value pairs to send using XMLHttpRequest. It works like a form's submit button.
    var form_data = new FormData();
    // adds each key-value pair to the FormData
    for (var key in item) {
        form_data.append(key, item[key]);
    }
    // Create new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.onload = home;
    request.open("POST", url);
    request.send(form_data);
}
