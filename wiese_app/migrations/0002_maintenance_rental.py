# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('wiese_app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='maintenance',
            name='rental',
            field=models.ForeignKey(default=1, to='wiese_app.Rentals'),
            preserve_default=False,
        ),
    ]
