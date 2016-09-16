from rest_framework import serializers
from imageupload.models import UploadedImage


# Serializer for UploadedImage Model
# serializes pk and image
class UploadedImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedImage
        fields = ('pk', 'image', 'thumbnail',)

