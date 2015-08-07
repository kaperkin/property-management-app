# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wiese_app', '0004_auto_20150803_1546'),
    ]

    operations = [
        migrations.AddField(
            model_name='renter',
            name='building',
            field=models.ForeignKey(default=1, to='wiese_app.Rentals'),
            preserve_default=False,
        ),
    ]
