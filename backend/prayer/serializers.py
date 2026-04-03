from rest_framework import serializers
from .models import PrayerRequest, PrayerResponse

class PrayerResponseSerializer(serializers.ModelSerializer):
    responder_name = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = PrayerResponse
        fields = ('id', 'prayer_request', 'user', 'responder_name', 'content', 'created_at')
        read_only_fields = ('created_at',)

class PrayerRequestSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    responses_count = serializers.SerializerMethodField()

    class Meta:
        model = PrayerRequest
        fields = (
            'id', 'user', 'user_email', 'requester_name', 'requester_email',
            'title', 'content', 'is_public', 'is_anonymous', 'status',
            'created_at', 'updated_at', 'responses_count'
        )
        read_only_fields = ('created_at', 'updated_at')

    def get_responses_count(self, obj):
        return obj.responses.count()
