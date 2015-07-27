//buildings = [{"name":"building X"}, {"name":"building Y"}, {"name":"building Z"}];

function reqListener() {
    console.log(this.responseText);
    buildings = JSON.parse(this.responseText);
    console.log(buildings)
    for (i = 0; i < buildings.length; i++) {
        console.log(buildings[i].rental_name)
    }
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open("get", "/buildings/", true);
oReq.send();

// Show welcome buttons
var welcome_buttons = document.getElementsByClassName("welcome_button");
for (i = 0; i < welcome_buttons.length; i++) {
    welcome_buttons[i].style.display = "block";
}
;

// Add Event Listeners
document.getElementById("renterButton").addEventListener("click", showRenterView);
document.getElementById("renter_maintenance_link").addEventListener("click", addMaintenanceRequest);
document.getElementById("ownerButton").addEventListener("click", showOwnerView);
document.getElementById("owner_maintenance_add").addEventListener("click", addMaintenanceRequest);

// hides welcome buttons and shows renter view
function showRenterView() {
    for (i = 0; i < welcome_buttons.length; i++) {
        welcome_buttons[i].style.display = "none";
    }
    ;
    element = document.getElementById("renter_maintenance_link");
    element.style.display = "block";
};

// hides welcome button and shows owner view
function showOwnerView() {
    for (i = 0; i < welcome_buttons.length; i++) {
        welcome_buttons[i].style.display = "none";
    }
    element = document.getElementById("owner_view");
    element.style.display = "block";
    // loop to append building details.
    for (i = 0; i < buildings.length; i++) {
        text = document.getElementById("buildingDetail")
        // add building name
        buildingName = document.createElement("li")
        buildingName.innerHTML = buildings[i].rental_name
        text.appendChild(buildingName)
        // add blank ul
        blankUL = document.createElement("ul")
        text.appendChild(blankUL)
        //add building address
        buildingAddress = document.createElement("li")
        buildingAddress.innerHTML = buildings[i].address
        blankUL.appendChild(buildingAddress)
        // add building state
        buildingState = document.createElement("li")
        buildingState.innerHTML = buildings[i].state
        blankUL.appendChild(buildingState)
        // add building zipcode
        buildingZip = document.createElement("li")
        buildingZip.innerHTML = buildings[i].zipcode
        blankUL.appendChild(buildingZip)

    }
}


function addMaintenanceRequest() {
    previousElement = document.getElementById("renter_maintenance_link");
    previousElement.style.display = "none";
    ownerElement = document.getElementById("owner_view");
    ownerElement.style.display = "none";

    element = document.getElementById("maintenanceRequest");
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

    request.open("POST", url);
    request.send(form_data);
}

// Called by clicking save on maintenance request form
function sendMaintenanceRequest() {
    // creates a dictionary to hold the information on the form
    var item = {
        "building_id": document.getElementById("buildingList").value,
        "maintenance_rental": document.getElementById("maintenance_rental").value,
        "maintenance_author": document.getElementById("maintenance_author").value,
        "maintenance_request": document.getElementById("maintenance_request").value,
    };
    // calls the sendPost function with the dictionary created and an url
    sendPost(item, "/maintenance/");
    // hides request form
    element = document.getElementById("maintenanceRequest");
    element.style.display = "none";
    // shows welcome buttons
    var welcome_buttons = document.getElementsByClassName("welcome_button");
    for (i = 0; i < welcome_buttons.length; i++) {
        welcome_buttons[i].style.display = "block";
    }
}