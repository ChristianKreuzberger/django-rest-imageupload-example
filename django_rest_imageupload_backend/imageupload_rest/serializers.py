from rest_framework import serializers
from imageupload.models import UploadedImage


# Serializer for UploadedImage Model
# serializes pk and image
class UploadedImageSerializer(serializers.ModelSerializer):
    """
    Serializer for the UPloadedImage Model
    Provides the pk, image, thumbnail, title and description
    """
    class Meta:
        model = UploadedImage
        fields = ('pk', 'image', 'thumbnail', 'title', 'description', )
        read_only_fields = ('thumbnail',)

