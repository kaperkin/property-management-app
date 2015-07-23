from django.shortcuts import render
from django.template import RequestContext, loader
from .models import Rentals, Maintenance
from django.http import HttpResponse, HttpResponseRedirect
# Create your views here.

def welcome(request):
    template = loader.get_template('wiese_app/welcome.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))

def index(request):
    rental_list = Rentals.objects.all()
    maintenance_list = Maintenance.objects.all()
    template = loader.get_template('wiese_app/index.html')
    context = RequestContext(request, {
        'rental_list': rental_list,
        'maintenance_list' : maintenance_list,
    })
    return HttpResponse(template.render(context))

def renter_view(request):
    template = loader.get_template('wiese_app/renter_view.html')
    context = RequestContext(request)
    return HttpResponse(template.render(context))

def detail(request, id):
    if id == "0":
        return HttpResponseRedirect('/update_request/0/')
    maintenance = Maintenance.objects.filter(id = id)[0]
    template = loader.get_template('wiese_app/detail.html')
    context = RequestContext(request, {
        'maintenance' : maintenance,
    })
    return HttpResponse(template.render(context))

def building_spec(request, id):
    if id == "0":
        return HttpResponseRedirect('/update_building/0/')
    rental = Rentals.objects.filter(id = id)[0]
    template = loader.get_template('wiese_app/building_spec.html')
    context = RequestContext(request, {
        'rental' : rental,
    })
    return HttpResponse(template.render(context))

def update_request(request, id):
    if id == "0":
        maintenance = Maintenance()
    else:
        maintenance = Maintenance.objects.filter(id = id)[0]
    rental_list = Rentals.objects.all()
    if request.POST:
        print (request.POST)
        maintenance.rental = Rentals.objects.filter(id = request.POST['rental'])[0]
        maintenance.maintenance_rental=request.POST["maintenance_rental"]
        maintenance.maintenance_author=request.POST["maintenance_author"]
        maintenance.maintenance_request=request.POST["maintenance_request"]
        maintenance.save()
        return HttpResponseRedirect('/')
    template = loader.get_template('wiese_app/update_request.html')
    context = RequestContext(request, {
        'maintenance' : maintenance,
        'rental_list' : rental_list,
    })
    return HttpResponse(template.render(context))

def update_building(request, id):
    if id == "0":
        rental = Rentals()
    else:
        rental = Rentals.objects.filter(id = id)[0]
    if request.POST:
        print (request.POST)
        if request.POST['action'] == 'DELETE':
            rental.delete()
            return HttpResponseRedirect('/')
        else:
            rental.rental_name=request.POST["rental_name"]
            rental.address=request.POST["address"]
            rental.state=request.POST["state"]
            rental.zipcode=request.POST["zipcode"]
            rental.save()
    template = loader.get_template('wiese_app/update_building.html')
    context = RequestContext(request, {
        'rental' : rental,
    })
    return HttpResponse(template.render(context))


