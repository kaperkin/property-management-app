//buildings = [{"name":"building X"}, {"name":"building Y"}, {"name":"building Z"}];

function reqListener () {
  console.log(this.responseText);
  buildings = JSON.parse(this.responseText);
}

var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open("get", "/buildings/", true);
oReq.send();


var welcome_buttons = document.getElementsByClassName("welcome_button");
    for (i=0; i<welcome_buttons.length; i++){
        welcome_buttons[i].style.display = "block";
    };

document.getElementById("renterButton").addEventListener("click", showRenterView);
document.getElementById("renter_maintenance_link").addEventListener("click", addMaintenanceRequest);
document.getElementById("ownerButton").addEventListener("click", showOwnerView);
document.getElementById("owner_maintenance_add").addEventListener("click", addMaintenanceRequest);

function showRenterView(){
    for (i=0; i<welcome_buttons.length; i++){
        welcome_buttons[i].style.display = "none";
    };
    element = document.getElementById("renter_maintenance_link");
    element.style.display = "block";
};



function showOwnerView(){
    for (i=0; i<welcome_buttons.length; i++){
        welcome_buttons[i].style.display = "none";
    };

    element = document.getElementById("owner_view");
    element.style.display = "block";
}


function addMaintenanceRequest(){
    previousElement = document.getElementById("renter_maintenance_link");
    previousElement.style.display ="none";
    ownerElement = document.getElementById("owner_view");
    ownerElement.style.display ="none";

    element = document.getElementById("maintenanceRequest");
    element.style.display = "block";

    var bl = document.getElementById("buildingList");
    for (i=0; i<buildings.length; i++){
        var option = document.createElement("option");
        option.innerHTML=buildings[i].name;
        option.setAttribute('value', buildings[i].id);
        bl.appendChild(option);
    }
};
//function sendPost(formData, url) {
//            var request = new XMLHttpRequest();
//            request.open("POST", url);
//            request.send(formData);
//        }

function sendPost(item, url) {
    var form_data = new FormData();

    for (var key in item) {
        form_data.append(key, item[key]);
    }

    var request = new XMLHttpRequest();
    request.open("POST", url);
    request.send(form_data);
}


function sendMaintenanceRequest(){
    var item = {
        "building_id": document.getElementById("buildingList").value,
        "maintenance_rental": document.getElementById("maintenance_rental").value,
        "maintenance_author": document.getElementById("maintenance_author").value,
        "maintenance_request": document.getElementById("maintenance_request").value,
    };
    sendPost(item, "/maintenance/");

    element = document.getElementById("maintenanceRequest");
    element.style.display = "none";

    var welcome_buttons = document.getElementsByClassName("welcome_button");
    for (i=0; i<welcome_buttons.length; i++){
        welcome_buttons[i].style.display = "block";
    }
}