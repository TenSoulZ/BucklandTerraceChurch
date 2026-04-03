from rest_framework import serializers
from .models import ImageAsset

class ImageAssetSerializer(serializers.ModelSerializer):
    uploaded_by_email = serializers.CharField(source='uploaded_by.email', read_only=True)

    class Meta:
        model = ImageAsset
        fields = ('id', 'file_id', 'url', 'thumbnail_url', 'name', 'size', 'uploaded_by', 'uploaded_by_email', 'uploaded_at')
        read_only_fields = ('uploaded_at', 'file_id', 'url', 'thumbnail_url', 'size')
