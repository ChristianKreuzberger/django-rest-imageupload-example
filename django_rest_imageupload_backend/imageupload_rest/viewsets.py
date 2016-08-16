from rest_framework import viewsets, filters
from imageupload_rest import serializers
from imageupload.models import UploadedImage


class UploadedImagesViewSet(viewsets.ModelViewSet):
    queryset = UploadedImage.objects.all()
    serializer_class = serializers.UploadedImageSerializer
