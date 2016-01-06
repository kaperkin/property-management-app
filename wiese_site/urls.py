from django.conf.urls import patterns, include, url
from django.contrib import admin
from wiese_app import views, old_views
from django.conf import settings
urlpatterns = patterns('',
    ########## URLs #############################
    #############################################
    url(r'^buildings/$', views.buildings, name="buildings"),
    url(r'^maintenance/$', views.maintenance, name="maintenance"),
    url(r'^login/$', views.login_view, name="login"),
    url(r'^logged_in/$', views.logged_in, name="logged_in"),
    url(r'^logout_view/$', views.logout_view, name="logout"),
    url(r'^createUser/$', views.createUser, name="createUser"),
    url(r'^status/$', views.status, name="status"),

    ######## Old URLs ###########################
    #############################################
    url(r'^old/$', old_views.welcome, name='old_welcome'),
    url(r'^renter_view/$', old_views.renter_view, name='old_renter_view'),
    url(r'^owner_view/$', old_views.index, name='index'),
    url(r'^maintenance_all/$', old_views.maintenance_all, name='maintenance_all'),
    url(r'^maintenance/(?P<id>[0-9]+)/$', old_views.detail, name='detail'),
    url(r'^rental/(?P<id>[0-9]+)/$', old_views.building_spec, name='building_spec'),
    url(r'^update_request/(?P<id>[0-9]+)/$', old_views.update_request, name='update_request'),
    url(r'^update_building/(?P<id>[0-9]+)/$', old_views.update_building, name='update_building'),
    url(r'^admin/', include(admin.site.urls)),
)
# If index.html or nothing (/), then serve static html into url
###############################################################
if settings.DEBUG:
    urlpatterns += patterns(
        'django.contrib.staticfiles.views',
        url(r'^(?:login.html)?$', 'serve', kwargs={'path': 'html/login.html'}),
        url(r'^main.html$', 'serve', kwargs={'path': 'html/main.html'}),
        url(r'^(?P<path>(?:js|css|img)/.*)$', 'serve'),
    )
