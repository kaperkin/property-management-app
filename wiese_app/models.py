import datetime
from django.db import models


class Rentals(models.Model):
    rental_name = models.CharField(max_length = 200)
    address = models.CharField(max_length = 200)
    state = models.CharField(max_length = 2)
    zipcode = models.CharField(max_length = 5)

    def __str__(self):
        return self.rental_name

class Maintenance(models.Model):
    rental = models.ForeignKey(Rentals)
    maintenance_rental = models.CharField(max_length = 200)
    maintenance_author = models.CharField(max_length = 200)
    maintenance_request = models.TextField()
    maintenance_date = models.DateField(auto_now = True)

    def __str__(self):
        return str(self.maintenance_date) + " "  + self.rental.rental_name