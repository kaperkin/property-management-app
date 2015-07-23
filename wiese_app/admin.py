from django.contrib import admin

# Register your models here.
from .models import Maintenance
from .models import Rentals

admin.site.register(Maintenance)
admin.site.register(Rentals)
