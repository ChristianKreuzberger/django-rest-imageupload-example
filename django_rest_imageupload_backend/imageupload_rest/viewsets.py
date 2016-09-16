from rest_framework import viewsets, filters
from imageupload_rest.serializers import UploadedImageSerializer
from imageupload.models import UploadedImage


# ViewSet for our UploadedImage Model
# Gets all images from database and serializes them using UploadedImageSerializer
class UploadedImagesViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all()
    serializer_class = UploadedImageSerializer

