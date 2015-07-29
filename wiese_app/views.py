# TO DO
# -display only building names under maintenance requests
# - link on building names to view all maintenance requests for that buildings
# -link on individual maintenance requests to edit
# - add option of maintenance requests for "new, in progress, completed"
# - move completed maintenance requests to archive
# - create users with permissions
#       - tenants only able to create maintenance requests for their buildings


from django.views.decorators.csrf import csrf_exempt
from django.template import RequestContext, loader
from .models import Rentals, Maintenance
from django.http import HttpResponse, HttpResponseRedirect
import json
# Create your views here.



def index(request):
    template = loader.get_template('wiese_app/index.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))

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
            "state": rental.state,
            "zipcode": rental.zipcode}
        buildings.append(building)
    return HttpResponse(json.dumps(buildings))

@csrf_exempt
def maintenance(request):
    if request.POST:
        m = Maintenance()
        m.rental = Rentals.objects.filter(id= request.POST["building_id"])[0]
        m.maintenance_rental = request.POST["maintenance_rental"]
        m.maintenance_author = request.POST["maintenance_author"]
        m.maintenance_request = request.POST["maintenance_request"]

        m.save()

    maintenanceList = Maintenance.objects.all()
    maintenances = []
    for main in maintenanceList:
        maintenance={
            "rental": main.rental.rental_name,
            "id": main.rental.id,
            "maintenance_rental": main.maintenance_rental,
            "maintenance_author": main.maintenance_author,
            "maintenance_request": main.maintenance_request,
            "maintenance_date": str(main.maintenance_date),
        }
        maintenances.append(maintenance)
    return HttpResponse(json.dumps(maintenances))