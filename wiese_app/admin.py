from django.contrib import admin

# Register your models here.
from .models import Maintenance
from .models import Rentals
from .models import Manager
from .models import Renter
from .models import Status


admin.site.register(Maintenance)
admin.site.register(Rentals)
admin.site.register(Manager)
admin.site.register(Renter)
admin.site.register(Status)
