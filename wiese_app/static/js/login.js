// Move to login.js file
function renterChange(e){
    var renter = document.getElementById('renter');
    var list = document.getElementById('buildingListContainer');
    if(renter.checked){
        list.style.display = 'block';
    }else{
        list.style.display = 'none';
    }
}
function initLogin(){
    document.getElementById("header").addEventListener("click", home);
    document.getElementById('newUser').addEventListener("click", newUser);
    document.getElementById('renter').addEventListener("change", renterChange);
    document.getElementById('manager').addEventListener("change", renterChange);
    document.getElementById('buildingList').addEventListener("change", changeValue);
}
document.addEventListener("DOMContentLoaded", initLogin);

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

function newUser(){
    document.getElementById('login').style.display='none';
    document.getElementById('createUser').style.display="block";
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

function changeValue(){
    newId = document.getElementById('buildingList').value;
    console.log(newId);
    id = document.getElementById('id').value;
    console.log(id);
    id = newId;
    console.log(id);
}

function addUser(){
    item= {
        "action": "save",
        "id": document.getElementById("id").value,
        "building": building.value,
        "name": document.getElementById('name').value,
        "username": document.getElementById('username').value,
        "password": document.getElementById('password').value
    };
    console.log(item);
    sendUser(item,'/createUser/');
}

function sendUser(){
    // create new FormData.
    // FormData holds a set of key/value pairs to send using XMLHttpRequest. It works like a form's submit button.
    var form_data = new FormData();
    // adds each key-value pair to the FormData
    for (var key in item) {
        form_data.append(key, item[key]);
    }
    // Create new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.onload = home();
    request.open("POST", url);
    request.send(form_data);
}
