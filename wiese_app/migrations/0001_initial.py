# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Maintenance',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('maintenance_rental', models.CharField(max_length=200)),
                ('maintenance_author', models.CharField(max_length=200)),
                ('maintenance_request', models.TextField()),
                ('maintenance_date', models.DateField(auto_now=True)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.CreateModel(
            name='Rentals',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('rental_name', models.CharField(max_length=200)),
                ('address', models.CharField(max_length=200)),
                ('state', models.CharField(max_length=2)),
                ('zipcode', models.CharField(max_length=5)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
    ]
