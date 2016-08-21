from django.conf.urls import url, include
from django.views.generic.base import RedirectView

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r'^$', RedirectView.as_view(url='static/index.html', permanent=False), name='index')
]
