from django.conf.urls import patterns, include, url
from django.contrib import admin
from wiese_app import views

urlpatterns = patterns('',
    # Examples:
    url(r'^$', views.welcome, name='welcome'),
    url(r'^renter_view/$', views.renter_view, name='renter_view'),
    url(r'^owner_view$', views.index, name='index'),
    url(r'^maintenance/(?P<id>[0-9]+)/$', views.detail, name='detail'),
    url(r'^rental/(?P<id>[0-9]+)/$', views.building_spec, name='building_spec'),
    url(r'^update_request/(?P<id>[0-9]+)/$', views.update_request, name='update_request'),
    url(r'^update_building/(?P<id>[0-9]+)/$', views.update_building, name='update_building'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^admin/', include(admin.site.urls)),
)
