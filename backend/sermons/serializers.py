from rest_framework import serializers
from .models import SermonSeries, SermonTag, Sermon

class SermonSeriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonSeries
        fields = '__all__'

class SermonTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = SermonTag
        fields = '__all__'

class SermonSerializer(serializers.ModelSerializer):
    series_title = serializers.CharField(source='series.title', read_only=True)
    tags = SermonTagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        source='tags', 
        queryset=SermonTag.objects.all(), 
        many=True, 
        write_only=True,
        required=False
    )

    class Meta:
        model = Sermon
        fields = (
            'id', 'title', 'slug', 'preacher', 'date_preached', 
            'description', 'video_url', 'audio_url', 'series', 
            'series_title', 'tags', 'tag_ids', 'thumbnail_url', 
            'is_published', 'created_at'
        )
        read_only_fields = ('slug', 'created_at')
