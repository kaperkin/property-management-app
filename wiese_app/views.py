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

def buildings(request):
    rentals = Rentals.objects.all()
    buildings = []
    for rental in rentals:
        building={"name": rental.rental_name, "id": rental.id,}
        buildings.append(building)
    return HttpResponse(json.dumps(buildings))

@csrf_exempt
def maintenance_request(request):
    print(request.POST)
    m = Maintenance()
    m.rental = Rentals.objects.filter(id= request.POST["building_id"])[0]
    m.maintenance_rental = request.POST["maintenance_rental"]
    m.maintenance_author = request.POST["maintenance_author"]
    m.maintenance_request = request.POST["maintenance_request"]

    m.save()
    return HttpResponse(str(id))