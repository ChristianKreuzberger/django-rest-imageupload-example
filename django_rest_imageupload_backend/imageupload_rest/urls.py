from django.conf.urls import url, include
from rest_framework import routers
from imageupload_rest.viewsets import UploadedImagesViewSet

# initiate router and register all endpoints
router = routers.DefaultRouter()
router.register('images', UploadedImagesViewSet, 'images')

# Wire up our API with our urls
urlpatterns = [
    url(r'^', include(router.urls)),
]
