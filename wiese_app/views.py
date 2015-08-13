# TO DO
# - add option of maintenance requests for "new, in progress, completed"
# - move completed maintenance requests to archive
# - create users with permissions
#       - tenants only able to create maintenance requests for their buildings
# after edit maintenance, need to reload maintenance items


from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext, loader
from .models import Rentals, Maintenance, Manager, Renter, Status
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required



import json
# Create your views here.



def index(request):
    template = loader.get_template('/wiese_app/static/html/index.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))

@csrf_exempt
def logged_in(request):
    output = {"user_id": 0}
    if request.user.is_authenticated():
        output["user_id"] = request.user.id
        renterList = Renter.objects.filter(user = request.user)
        managerList = Manager.objects.filter(user = request.user)
        if (len(renterList) > 0):
            renter = renterList[0]
            output["building_id"] = renter.building.id
            output["renter_id"] = renter.id
        if (len(managerList) > 0):
            manager = managerList[0]
            output["manager_id"] = manager.id
    return HttpResponse(json.dumps(output))

@csrf_exempt
def login_view(request):
    username = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=username, password=password)
    if user is not None:
        if user.is_active:
            login(request, user)
            managerList = Manager.objects.filter(user = user)
            renterList = Renter.objects.filter(user = user)
            if len(managerList) > 0:
                return HttpResponseRedirect("/index.html#view=manager")
            elif len(renterList) > 0:
                return HttpResponseRedirect("/index.html#view=renter")
            else:
                return HttpResponseRedirect("/login.html")
    template = loader.get_template('/wiese_app/static/html/login.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))

@csrf_exempt
def logout_view(request):
    logout(request)
    return HttpResponseRedirect("/login.html")

@csrf_exempt
def buildings(request):
    print(request.POST)
    if request.POST:
        if request.POST["id"] == "0":
            rental=Rentals()
        else:
            rental=Rentals.objects.filter(id=request.POST["id"])[0]
        if request.POST["action"] == "DELETE":
            rental.delete()
        else:
            rental.rental_name = request.POST["rental_name"]
            rental.address = request.POST["address"]
            rental.city = request.POST["city"]
            rental.state = request.POST["state"]
            rental.zipcode = request.POST["zipcode"]

            rental.save()
    rentals = Rentals.objects.all()
    buildings = []
    for rental in rentals:
        building= {
            "rental_name": rental.rental_name,
            "id": rental.id,
            "address": rental.address,
            "city": rental.city,
            "state": rental.state,
            "zipcode": rental.zipcode}
        buildings.append(building)
    return HttpResponse(json.dumps(buildings))


@csrf_exempt
def status(request):
    statusList = Status.objects.all()
    status = []
    for s in statusList:
        sitem= {
            "name": s.name
        }
        status.append(sitem)
    return HttpResponse(json.dumps(status))

@csrf_exempt
def maintenance(request):
    if request.POST:
        print(request.POST)
        if request.POST["mainId"]== "0":
            m = Maintenance()
        else:
            m = Maintenance.objects.filter(id=request.POST["mainId"])[0]
        if request.POST["action"] == "DELETE":
            m.delete()
        else:
            m.rental = Rentals.objects.filter(id= request.POST["building_id"])[0]
            m.maintenance_rental = request.POST["maintenance_rental"]
            m.maintenance_author = request.POST["maintenance_author"]
            m.maintenance_request = request.POST["maintenance_request"]
            m.user = request.user

            m.save()

    maintenanceList = Maintenance.objects.all()
    maintenances = []
    for main in maintenanceList:
        maintenance={
            "mainId": main.id,
            "rental": main.rental.rental_name,
            "id": main.rental.id,
            "maintenance_rental": main.maintenance_rental,
            "maintenance_author": main.maintenance_author,
            "maintenance_request": main.maintenance_request,
            "maintenance_date": str(main.maintenance_date),
            "maintenance_status": main.status.name,
        }
        maintenances.append(maintenance)
    return HttpResponse(json.dumps(maintenances))

@csrf_exempt
def createUser(request):
    if request.POST:
        print(request.POST)
        user = User()
        # user.id = request.POST["id"]
        user.first_name = request.POST["first_name"]
        user.last_name = request.POST["last_name"]
        user.email = request.POST["email"]
        user.username = request.POST["username"]
        user.set_password(request.POST["password"])
        user.save()
        if request.POST["userType"] == "renter":
            renter = Renter()
            renter.user = user
            renter.building = Rentals.objects.filter(id=request.POST["building"])[0]
            renter.save()
            return HttpResponse("renter: "+ str(renter.id) + ", user: " + str(user.id))
        else:
            manager = Manager()
            manager.user = user
            manager.save()
            return HttpResponse("manager: "+ str(manager.id) + ", user: " + str(user.id))
    else:
        return HttpResponse("no success!")


