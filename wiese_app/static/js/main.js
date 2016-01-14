// ToDo
// document workflow model
// add image upload?
//allow renters to access their requests?
//link in readme to live site

////// init function to kick it all off //////////////////////
/////////////////////////////////////////////////////////
function init() {
    document.getElementById("header").addEventListener("click", viewHome);
    document.getElementById("renter_maintenance_link").addEventListener("click", renterGetBuildings);
    document.getElementById("owner_maintenance_add").addEventListener("click", addMaintenanceRequest);
    document.getElementById("owner_property_add").addEventListener("click", addProperty);
    document.getElementById("all_maintenance_requests").addEventListener("click", allMaintenanceRequests);
    document.getElementById("logout").addEventListener("click", logout);
    isManager = window.location.hash == "#view=manager";
    isRenter = window.location.hash == "#view=renter";
    viewHome();
}

////// calls init function when DOM loads ////////////
document.addEventListener("DOMContentLoaded", init);

//////// Listener Requests  ///////////////////////////////////////
///////////////////////////////////////////////////////////////////

function userListener() {
    console.log('user listener');
    window.user = JSON.parse(this.responseText);
    console.log("user: " + user.user_id);
    if (user['user_id'] == 0){
        console.log('if section of user listener');
        window.location = "/";
    } else {
        return window.user;
    }
}

function getUser() {
    oReq = new XMLHttpRequest();
    oReq.onload = userListener;
    oReq.open("get", "/logged_in/", true);
    oReq.send();
}
getUser();

function buildingListener() {
    //console.log(this.responseText);
    window.buildings = JSON.parse(this.responseText);
    for (var i = 0; i < buildings.length; i++) {
        console.log(buildings[i].rental_name)
    }
    getMaintenance();
}

function getBuildings() {
    oReq = new XMLHttpRequest();
    oReq.onload = buildingListener;
    oReq.open("get", "/buildings/", true);
    oReq.send();
}

function renterBuildingListener() {
    //console.log(this.responseText);
    window.buildings = JSON.parse(this.responseText);
    for (i = 0; i < buildings.length; i++) {
        console.log(buildings[i].rental_name)
    }
    addMaintenanceRequest();
}

function renterGetBuildings() {
    oReq = new XMLHttpRequest();
    oReq.onload = renterBuildingListener;
    oReq.open("get", "/buildings/", true);
    oReq.send();
}

function maintenanceListener() {
    //console.log(this.responseText);
    window.maintenances = JSON.parse(this.responseText);
    showOwnerView();
}

function getMaintenance() {
    mReq = new XMLHttpRequest();
    mReq.onload = maintenanceListener;
    mReq.open("get", "/maintenance/", true);
    mReq.send();
}

function statusListener(){
    //console.log(this.responseText);
    window.statusList = JSON.parse(this.responseText);
    //console.log(statusList);
    console.log(statusList.length);
}

function getStatus(){
    sReq = new XMLHttpRequest();
    sReq.onload = statusListener;
    sReq.open("get", "/status/", true);
    sReq.send();

}

////// hide content //////////////
function hideContent() {
    var elements = document.getElementsByClassName("content");
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = "none";
    }
}

////// view home based upon user type //////////////////
function viewHome(){
    hideContent();
    if (window.isManager){
        getBuildings();
    }else {
        console.log('viewHome function');
        showRenterView();
    }
}

///////// Show views /////////////////////////////////
/////////////////////////////////////////////////////
function showRenterView() {
    console.log('showRenterView function');
    getStatus();
    var element = document.getElementById("renter_maintenance_link");
    element.style.display = "inline-block";
}

function showOwnerView() {
    hideContent();
    getStatus();
    var element = document.getElementById("owner_view");
    element.style.display = "block";
    text = document.getElementById("buildingDetail");
    text.innerHTML = "";
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
         // add building city
        var buildingCity = document.createElement("li");
        buildingCity.innerHTML = buildings[i].city;
        blankUL.appendChild(buildingCity);
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
    text.innerHTML = "";
    for (var i = 0; i < maintenances.length; i++) {
        var rental = maintenances[i].rental;
        //if( not nameList has the property of rental)
        if (!nameList.hasOwnProperty(rental)) {
            nameList[rental] = rental;
            console.log(nameList);
            // add building name
            var buildingName = document.createElement("li");
            buildingName.innerHTML = rental;
            buildingName.style.textDecoration = "underline";
            buildingName.setAttribute("id", maintenances[i].id);
            buildingName.addEventListener("click", function (e) {
                buildingMaintReq(e.target.getAttribute("id"))
            });
            text.appendChild(buildingName);
        }
    }
}

/////////// Maintenance Requests ////////////////////////
////////////////////////////////////////////////////////
function addMaintenanceRequest() {
    hideContent();
    document.getElementById("buildingList").innerHTML="";
    document.getElementById("statusDiv").innerHTML="";
    document.getElementById("mainId").innerHTML="";
    document.getElementById("maintenance_rental").value = "";
    document.getElementById("maintenance_author").value= "";
    document.getElementById("maintenance_request").value = "";
    var element = document.getElementById("maintenanceRequest");
    element.style.display = "block";
    var statusDiv = document.getElementById("statusDiv");

    //create radio buttons for status
    for (var i=0; i<statusList.length; i++){
        var r = document.createElement("input");
        r.setAttribute('type', 'radio');
        r.setAttribute('name', 'status');
        r.className = 'radio';
        r.setAttribute('id', statusList[i].id);
        var label = document.createElement("label");
        label.setAttribute('for', statusList[i].name );
        label.innerHTML=statusList[i].name;
        statusDiv.appendChild(r);
        statusDiv.appendChild(label);
    }

    // Get drop down list for building list
    var bl = document.getElementById("buildingList");
    //create for loop to add to list using buildings obtained with oreq variable
    for (var b = 0; b < buildings.length; b++) {
        //console.log(buildings[b].id);
        if (buildings[b].id == user.building_id) {
            bl.style.display = "none";
            bl.value= buildings[b].id;
            bn = document.getElementById("buildingName");
            bn.innerHTML = buildings[b].rental_name;
            statusDiv.style.display = "none";
            var radioBtns = statusDiv.getElementsByClassName('radio');
            for(var p=0; p<radioBtns.length; p++){
                if (radioBtns[p].id == "1"){
                    radioBtns[p].defaultChecked= true;
                    break;
                 }
            }
            break;
        }
    }

    if (!user.building_id) {
        for (var q = 0; q < buildings.length; q++) {
            //create a new option
            var option = document.createElement("option");
            // make the option have the name of the building
            option.innerHTML = buildings[q].rental_name;
            // set the attribute 'value' of the option to be the id of the building
            option.setAttribute('value', buildings[q].id);
            //add option with value to buildingList item
            bl.appendChild(option);
        }
    }
}

function editMaintenanceRequest(id) {
    console.log(id);
    for (var q = 0; q < window.maintenances.length; q++) {
        m = window.maintenances[q];
        if (m.mainId == id) {
            mainReq = m;
            console.log(mainReq);
            break;
        }
    }
    if (isManager) {
        var bl = document.getElementById("buildingList");
        bl.style.display = "none";
    }
    addMaintenanceRequest();
    document.getElementById("mainId").value = mainReq.mainId;
    document.getElementById("buildingName").innerHTML = mainReq.rental;
    document.getElementById("buildingList").value = mainReq.id;
    document.getElementById("maintenance_rental").value = mainReq.maintenance_rental;
    document.getElementById("maintenance_author").value = mainReq.maintenance_author;
    document.getElementById("maintenance_request").value = mainReq.maintenance_request;

    var statusDiv = document.getElementById('statusDiv');
    var radioBtns = statusDiv.getElementsByClassName('radio');
    for(var p=0; p<radioBtns.length; p++){
        if (radioBtns[p].id == mainReq.maintenance_status_id){
            radioBtns[p].defaultChecked= true;
            break;
        }
    }
}

function allMaintenanceRequests() {
    var element = document.getElementById("showAllMaintenance");
    element.innerHTML = "";
    element.style.display = "block";

    for (var i = 0; i < maintenances.length; i++) {
        //console.log(maintenances[i]);
        var text = document.getElementById("showAllMaintenance");

        // add building name
        var buildingName = document.createElement("li");
        buildingName.innerHTML = maintenances[i].rental;
        text.appendChild(buildingName);
        // add blank ul
        var blankUL = document.createElement("ul");
        buildingName.appendChild(blankUL);
        //add unit number if it exists
        if (maintenances[i].maintenance_rental != "") {
            unit = document.createElement("li");
            unit.innerHTML = "<b>Unit: </b>" + maintenances[i].maintenance_rental;
            blankUL.appendChild(unit);
        }
        // add maintenance author
        var maintenanceAuthor = document.createElement("li");
        maintenanceAuthor.innerHTML = "<b>Requested By: </b>" + maintenances[i].maintenance_author;
       blankUL.appendChild(maintenanceAuthor);
        // add maintenance request
        var maintenanceRequest = document.createElement("li");
        maintenanceRequest.innerHTML = "<b>Request: </b>" + maintenances[i].maintenance_request;
        blankUL.appendChild(maintenanceRequest);
        // add maintenance status
        var maintenanceStatus = document.createElement("li");
        //create radio button for status
        for (var rb=0; rb<statusList.length; rb++){
            if (statusList[rb].name == maintenances[i].maintenance_status){
               maintenanceStatus.innerHTML= "<b>Status: </b>" + statusList[rb].name;
                break;
            }
        }
        blankUL.appendChild(maintenanceStatus);
        blankUL.appendChild(maintenanceStatus);
        //add button to link to update maintenance request
        var updateButton = document.createElement("div");
        updateButton.innerHTML = "Update";
        updateButton.setAttribute("onclick", "editMaintenanceRequest(" + maintenances[i].mainId + ")");
        updateButton.className = "save-cancel-delete-button";
        blankUL.appendChild(updateButton);
        //add button to link to delete maintenance request
        var deleteButton = document.createElement("div");
        deleteButton.innerHTML = "Delete";
        deleteButton.setAttribute("onclick", "deleteMaintenanceRequest(" + maintenances[i].mainId + ")");
        deleteButton.setAttribute("id", "delete");
        deleteButton.className = "save-cancel-delete-button";
        blankUL.appendChild(deleteButton);
    }
}

function buildingMaintReq(e) {
    var text = document.getElementById("showAllMaintenance");
    text.innerHTML = "";
    text.style.display = "block";
    var item = parseInt(e);
    for (var i = 0; i < maintenances.length; i++) {
        if (item == maintenances[i].id) {
            // add building name
            var buildingName = document.createElement("li");
            buildingName.innerHTML = maintenances[i].rental;
            text.appendChild(buildingName);
            // add blank ul
            var blankUL = document.createElement("ul");
            buildingName.appendChild(blankUL);
            //add unit number if it exists
            if (maintenances[i].maintenance_rental != "") {
                unit = document.createElement("li");
                unit.innerHTML = "<b>Unit: </b>" +maintenances[i].maintenance_rental;
                blankUL.appendChild(unit);
            }
            // add maintenance author
            var maintenanceAuthor = document.createElement("li");
            maintenanceAuthor.innerHTML = "<b>Requested By: </b>" + maintenances[i].maintenance_author;
            blankUL.appendChild(maintenanceAuthor);
            // add maintenance request
            var maintenanceRequest = document.createElement("li");
            maintenanceRequest.innerHTML = "<b>Request: </b>" +maintenances[i].maintenance_request;
            blankUL.appendChild(maintenanceRequest);
            // add maintenance status
            var maintenanceStatus = document.createElement("li");
            //create radio button for status
            for (var rb=0; rb<statusList.length; rb++){
                if (statusList[rb].name == maintenances[i].maintenance_status){
                   maintenanceStatus.innerHTML= "<b>Status: </b>" + statusList[rb].name;
                    break;
                }
            }
            blankUL.appendChild(maintenanceStatus);
            //add button to link to update maintenance request
            var updateButton = document.createElement("div");
            updateButton.innerHTML = "Update";
            updateButton.setAttribute("onclick", "editMaintenanceRequest(" + maintenances[i].mainId + ")");
            updateButton.className="save-cancel-delete-button";
            blankUL.appendChild(updateButton);
            //add button to link to delete maintenance request
            var deleteButton = document.createElement("div");
            deleteButton.className = "save-cancel-delete-button";
            deleteButton.innerHTML = "Delete";
            deleteButton.setAttribute("onclick", "deleteMaintenanceRequest(" + maintenances[i].mainId + ")");
            deleteButton.setAttribute("id", "delete");
            blankUL.appendChild(deleteButton);
        }
    }
}

function sendMaintenanceRequest() {
    //find which radio button is checked
    var statusDiv = document.getElementById("statusDiv");
    var radios = statusDiv.getElementsByClassName("radio");
    var maintenance_status = 0;
    for (var i = 0; i<radios.length; i++) {
        if (radios[i].checked) {
            maintenance_status = radios[i].id;
            console.log(maintenance_status);
            break;
         }
        }

    // creates a dictionary to hold the information on the form
    var item = {
        "action": "SAVE",
        "mainId": document.getElementById("mainId").value,
        "building_id": document.getElementById("buildingList").value,
        "maintenance_rental": document.getElementById("maintenance_rental").value,
        "maintenance_author": document.getElementById("maintenance_author").value,
        "maintenance_request": document.getElementById("maintenance_request").value,
        "maintenance_status": maintenance_status
    };
    console.log(item);
    if(isRenter){
        item["building_id"] = user.building_id;
    }
    // calls the sendPost function with the dictionary created and an url
    sendPost(item, "/maintenance/");
    document.getElementById("buildingList").innerHTML = "";
}

function deleteMaintenanceRequest(id) {
    var form_data = new FormData();
    form_data.append('mainId', id);
    form_data.append('action', 'DELETE');
    var request = new XMLHttpRequest();
    document.getElementById("showAllMaintenance").innerHTML = "";
    request.onload= function(){
        getBuildings();
        allMaintenanceRequests();
    };
    request.open("POST", "/maintenance/");
    request.send(form_data);
}

/////////// Property Functions ////////////////////////
////////////////////////////////////////////////////////

function addProperty() {
    hideContent();
    document.getElementById("id").value = "0";
    document.getElementById("rental_name").value = "";
    document.getElementById("address").value = "";
    document.getElementById("city").value = "";
    document.getElementById("state").value = "";
    document.getElementById("zipcode").value = "";
    var element = document.getElementById("updateAddBuilding");
    element.style.display = "block";
}

function editProperty(id) {
    console.log(id);
    for (i = 0; i < window.buildings.length; i++) {
        b = window.buildings[i];
        if (b.id == id) {
            building = b;
            break;
        }
    }
    addProperty();
    document.getElementById("id").value = building.id;
    document.getElementById("rental_name").value = building.rental_name;
    document.getElementById("address").value = building.address;
    document.getElementById("city").value = building.city;
    document.getElementById("state").value = building.state;
    document.getElementById("zipcode").value = building.zipcode;
}

function sendBuildingUpdate() {
    // creates a dictionary to hold the information on the form
    var item = {
        "action": "save",
        "id": document.getElementById("id").value,
        "rental_name": document.getElementById("rental_name").value,
        "city": document.getElementById("city").value,
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

/////////// General Send/Delete/Logout Functions ////////////////////////
////////////////////////////////////////////////////////
// general function to post data
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
    request.onload = viewHome;
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
    request.onload = function () {
        getBuildings();
        allMaintenanceRequests();
    };

    request.open("POST", "/buildings/");
    request.send(form_data);
}

function logout(){
    window.location="/logout_view/";
}
