# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations
from django.conf import settings


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('wiese_app', '0003_auto_20150803_1518'),
    ]

    operations = [
        migrations.CreateModel(
            name='Renter',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('user', models.ForeignKey(to=settings.AUTH_USER_MODEL)),
            ],
            options={
            },
            bases=(models.Model,),
        ),
        migrations.AddField(
            model_name='maintenance',
            name='renter',
            field=models.ForeignKey(default=1, to='wiese_app.Renter'),
            preserve_default=False,
        ),
    ]
