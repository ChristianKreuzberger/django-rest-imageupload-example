from django.conf.urls import url, include
from django.views.generic.base import RedirectView

# Redirect any request that goes into here to static/index.html
urlpatterns = [
    url(r'^$', RedirectView.as_view(url='static/index.html', permanent=False), name='index')
]
