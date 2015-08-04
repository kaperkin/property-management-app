
function buildingListener() {
    console.log(this.responseText);
    window.buildings = JSON.parse(this.responseText);
    for (i = 0; i < buildings.length; i++) {
        console.log(buildings[i].rental_name)
    }
    getMaintenance();
}

function getBuildings(){
    oReq = new XMLHttpRequest();
    oReq.onload = buildingListener;
    oReq.open("get", "/buildings/", true);
    oReq.send();
}

function renterBuildingListener() {
    console.log(this.responseText);
    window.buildings = JSON.parse(this.responseText);
    for (i = 0; i < buildings.length; i++) {
        console.log(buildings[i].rental_name)
    }
    addMaintenanceRequest();
}

function renterGetBuildings(){
    oReq = new XMLHttpRequest();
    oReq.onload = renterBuildingListener;
    oReq.open("get", "/buildings/", true);
    oReq.send();
}

function maintenanceListener() {
    console.log(this.responseText);
    window.maintenances = JSON.parse(this.responseText);
    showOwnerView();
}

function getMaintenance() {
    mReq = new XMLHttpRequest();
    mReq.onload = maintenanceListener;
    mReq.open("get", "/maintenance/", true);
    mReq.send();
}
window.welcome_buttons = document.getElementsByClassName("welcome_button");
// Show welcome buttons
function welcomeButtons() {
    everythingElse = document.getElementsByClassName("content");
    for (i=0; i<everythingElse.length; i++){
        everythingElse[i].style.display="none";
    }
    for (i = 0; i < welcome_buttons.length; i++) {
        welcome_buttons[i].style.display = "block";
    }
}

function hideContent(){
    var elements = document.getElementsByClassName("content");
    for(var i = 0; i<elements.length; i++){
        elements[i].style.display = "none";
    }
}
// Add Event Listeners
document.getElementById("header").addEventListener("click", welcomeButtons);
document.getElementById("renterButton").addEventListener("click", showRenterView);
document.getElementById("renter_maintenance_link").addEventListener("click", renterGetBuildings);
document.getElementById("ownerButton").addEventListener("click", getBuildings);
document.getElementById("owner_maintenance_add").addEventListener("click", addMaintenanceRequest);
document.getElementById("owner_property_add").addEventListener("click", addProperty);
document.getElementById("all_maintenance_requests").addEventListener("click", allMaintenanceRequests);


// hides welcome buttons and shows renter view
function showRenterView() {
    for (i = 0; i < welcome_buttons.length; i++) {
        welcome_buttons[i].style.display = "none";
    }
    var element = document.getElementById("renter_maintenance_link");
    element.style.display = "block";
}

// hides welcome button and shows owner view
function showOwnerView() {
    for (i = 0; i < welcome_buttons.length; i++) {
        welcome_buttons[i].style.display = "none";
    }
    hideContent();
    var element = document.getElementById("owner_view");
    element.style.display = "block";
    text = document.getElementById("buildingDetail");
    text.innerHTML="";
    // loop to append building details.
    for (i = 0; i < buildings.length; i++) {
        // add building name
        var buildingName = document.createElement("li");
        buildingName.style.textDecoration = "underline";
        buildingName.setAttribute("data-id", buildings[i].id);
        buildingName.addEventListener("click", function (e) {
            editProperty(e.target.getAttribute("data-id"));
        });
        buildingName.innerHTML = buildings[i].rental_name;
        text.appendChild(buildingName);
        // add blank ul
        var blankUL = document.createElement("ul");
        text.appendChild(blankUL);
        //add building address
        var buildingAddress = document.createElement("li");
        buildingAddress.innerHTML = buildings[i].address;
        blankUL.appendChild(buildingAddress);
        // add building state
        var buildingState = document.createElement("li");
        buildingState.innerHTML = buildings[i].state;
        blankUL.appendChild(buildingState);
        // add building zipcode
        var buildingZip = document.createElement("li");
        buildingZip.innerHTML = buildings[i].zipcode;
        blankUL.appendChild(buildingZip)

    }
    // loop to append maintenance details.
    var nameList = {};
    var text = document.getElementById("maintenanceDetail");
    text.innerHTML="";
    for(var i=0; i<maintenances.length; i++){
        var rental = maintenances[i].rental;
        //if( not nameList has the property of rental)
            if (!nameList.hasOwnProperty(rental)) {
                nameList[rental] = rental;
                console.log(nameList);
                // add building name
                var buildingName = document.createElement("li");
                buildingName.innerHTML = rental;
                buildingName.style.textDecoration="underline";
                buildingName.setAttribute("id", maintenances[i].id);
                buildingName.addEventListener("click", function(e){
                   buildingMaintReq(e.target.getAttribute("id"))
                });
                text.appendChild(buildingName);
            }
    }
}

function addMaintenanceRequest() {
    hideContent();
    var element = document.getElementById("maintenanceRequest");
    element.style.display = "block";
    // Get drop down list for building list
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

function editMaintenanceRequest(id){
    console.log(id);
    for (i=0; i<window.maintenances.length; i++){
        m=window.maintenances[i];
        if (m.mainId == id){
            mainReq = m;
            break;
        }
    }
    addMaintenanceRequest();
    document.getElementById("mainId").value=mainReq.mainId;
    document.getElementById("buildingList").value=mainReq.rental_name;
    document.getElementById("maintenance_rental").value=mainReq.maintenance_rental;
    document.getElementById("maintenance_author").value=mainReq.maintenance_author;
    document.getElementById("maintenance_request").value=mainReq.maintenance_request;
}

function addProperty() {
    hideContent();

    var element = document.getElementById("updateAddBuilding");
    element.style.display = "block";
    document.getElementById("id").value="0";
}

function editProperty(id){
    console.log(id);
    for (i=0; i<window.buildings.length; i++){
        b=window.buildings[i];
        if (b.id == id){
            building = b;
            break;
        }
    }
    addProperty();
    document.getElementById("id").value=building.id;
    document.getElementById("rental_name").value=building.rental_name;
    document.getElementById("address").value=building.address;
    document.getElementById("state").value=building.state;
    document.getElementById("zipcode").value=building.zipcode;
}

// general function to post data
// called by:
//      sendMaintenanceRequest
function sendPost(item, url) {
    // create new FormData.
    // FormData holds a set of key/value pairs to send using XMLHttpRequest. It works like a form's submit button.
    var form_data = new FormData();
    // adds each key-value pair to the FormData
    for (var key in item) {
        form_data.append(key, item[key]);
    }
    // Create new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.onload=getBuildings;
    request.open("POST", url);
    request.send(form_data);
}

function sendDelete(id) {
    // create new FormData.
    // FormData holds a set of key/value pairs to send using XMLHttpRequest. It works like a form's submit button.
    var form_data = new FormData();
    // adds each key-value pair to the FormData
    form_data.append("id", id);
    form_data.append("action", "DELETE");
    // Create new XMLHttpRequest
    var request = new XMLHttpRequest();
    request.onload=function(){
        getBuildings();
        allMaintenanceRequests();
    };

    request.open("POST", "/buildings/");
    request.send(form_data);
}

// Called by clicking save on maintenance request form
function sendMaintenanceRequest() {
    // creates a dictionary to hold the information on the form
    var item = {
        "action": "SAVE",
        "mainId": document.getElementById("mainId").value,
        "building_id": document.getElementById("buildingList").value,
        "maintenance_rental": document.getElementById("maintenance_rental").value,
        "maintenance_author": document.getElementById("maintenance_author").value,
        "maintenance_request": document.getElementById("maintenance_request").value,
    };
    // calls the sendPost function with the dictionary created and an url
    sendPost(item, "/maintenance/");
    document.getElementById("buildingList").innerHTML="";
welcomeButtons();
}

function sendBuildingUpdate() {
    // creates a dictionary to hold the information on the form
    var item = {
        "action": "save",
        "id": document.getElementById("id").value,
        "rental_name": document.getElementById("rental_name").value,
        "address": document.getElementById("address").value,
        "state": document.getElementById("state").value,
        "zipcode": document.getElementById("zipcode").value,
    };
    // calls the sendPost function with the dictionary created and an url
    sendPost(item, "/buildings/");
}

function deleteBuilding() {
    var id = document.getElementById("id").value;
    console.log(id);
    for (i = 0; i < window.buildings.length; i++) {
        b = window.buildings[i];
        if (b.id == id) {
            building = b;
            break;
        }
    }
    sendDelete(id);
    hideContent();
}

function deleteMaintenanceRequest(id){
    var form_data = new FormData();
    form_data.append('mainId', id);
    form_data.append('action', 'DELETE');
    var request = new XMLHttpRequest();
    request.open("POST", "/maintenance/");
    request.send(form_data);
    document.getElementById("showAllMaintenance").innerHTML="";
    getMaintenance();
    allMaintenanceRequests();
}

function allMaintenanceRequests() {
    var element = document.getElementById("showAllMaintenance");
    element.innerHTML="";
    element.style.display = "block";

    for (i = 0; i < maintenances.length; i++) {
        var text = document.getElementById("showAllMaintenance");
        // add building name
        var buildingName = document.createElement("li");
        buildingName.innerHTML = maintenances[i].rental;
        text.appendChild(buildingName);
        // add blank ul
        var blankUL = document.createElement("ul");
        text.appendChild(blankUL);
        //add unit number if it exists
        if (maintenances[i].maintenance_rental != "") {
            unit = document.createElement("li");
            unit.innerHTML = maintenances[i].maintenance_rental;
            blankUL.appendChild(unit);
        }
        // add maintenance author
        var maintenanceAuthor = document.createElement("li");
        maintenanceAuthor.innerHTML = maintenances[i].maintenance_author;
        blankUL.appendChild(maintenanceAuthor);
        // add maintenance request
        var maintenanceRequest = document.createElement("li");
        maintenanceRequest.innerHTML = maintenances[i].maintenance_request;
        blankUL.appendChild(maintenanceRequest);
        //add button to link to update maintenance request
        var updateButton = document.createElement("button");
        updateButton.innerHTML="Update";
        updateButton.setAttribute("onclick", "editMaintenanceRequest("+maintenances[i].mainId+")");
        blankUL.appendChild(updateButton);
        //add button to link to delete maintenance request
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML="Delete";
        deleteButton.setAttribute("onclick", "deleteMaintenanceRequest("+maintenances[i].mainId+")");
        blankUL.appendChild(deleteButton);
    }
}

function buildingMaintReq(e){
    var text = document.getElementById("showAllMaintenance");
    text.innerHTML="";
    text.style.display="block";
    var item = parseInt(e);
    for(var i=0; i<maintenances.length; i++){
        if (item == maintenances[i].id){
        // add building name
        var buildingName = document.createElement("li");
        buildingName.innerHTML = maintenances[i].rental;
        text.appendChild(buildingName);
        // add blank ul
        var blankUL = document.createElement("ul");
        text.appendChild(blankUL);
        //add unit number if it exists
        if (maintenances[i].maintenance_rental != "") {
            unit = document.createElement("li");
            unit.innerHTML = maintenances[i].maintenance_rental;
            blankUL.appendChild(unit);
        }
        // add maintenance author
        var maintenanceAuthor = document.createElement("li");
        maintenanceAuthor.innerHTML = maintenances[i].maintenance_author;
        blankUL.appendChild(maintenanceAuthor);
        // add maintenance request
        var maintenanceRequest = document.createElement("li");
        maintenanceRequest.innerHTML = maintenances[i].maintenance_request;
        blankUL.appendChild(maintenanceRequest);
        //add button to link to update maintenance request
        var updateButton = document.createElement("button");
        updateButton.innerHTML="Update";
        updateButton.setAttribute("onclick", "editMaintenanceRequest("+maintenances[i].mainId+")");
        blankUL.appendChild(updateButton);
        //add button to link to delete maintenance request
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML="Delete";
        deleteButton.setAttribute("onclick", "deleteMaintenanceRequest("+maintenances[i].mainId+")");
        blankUL.appendChild(deleteButton);


        }
    }
}
