from rest_framework import serializers
from .models import LiveStream, StreamChat

class StreamChatSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = StreamChat
        fields = ['id', 'author_name', 'message', 'created_at']

    def get_author_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.email
        return obj.author_name or 'Anonymous'

class LiveStreamSerializer(serializers.ModelSerializer):
    chat_messages = StreamChatSerializer(many=True, read_only=True)
    viewer_count = serializers.SerializerMethodField()

    class Meta:
        model = LiveStream
        fields = ['id', 'title', 'description', 'youtube_video_id', 'is_live', 'start_time', 'end_time', 'viewer_count', 'chat_messages']

    def get_viewer_count(self, obj):
        # A mock viewer count for now, based on active stream status
        if obj.is_live:
            return 150 # Simulated active viewers
        return 0
