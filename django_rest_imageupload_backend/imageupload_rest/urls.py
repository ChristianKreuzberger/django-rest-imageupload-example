from django.conf.urls import url, include
from rest_framework import routers
from imageupload_rest.viewsets import UploadedImagesViewSet

router = routers.DefaultRouter()
router.register('images', UploadedImagesViewSet, 'images')

# Wire up our API using automatic URL routing.
urlpatterns = [
    url(r'^', include(router.urls)),
]
