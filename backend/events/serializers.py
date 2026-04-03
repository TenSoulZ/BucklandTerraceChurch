from rest_framework import serializers
from .models import EventCategory, Event, RSVP

class EventCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCategory
        fields = '__all__'

class RSVPSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = RSVP
        fields = ('id', 'event', 'user', 'user_email', 'guest_name', 'guest_email', 'guests_count', 'has_checked_in', 'created_at')
        read_only_fields = ('created_at',)

class EventSerializer(serializers.ModelSerializer):
    category_details = EventCategorySerializer(source='category', read_only=True)
    rsvps_count = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = (
            'id', 'title', 'slug', 'description', 'start_time', 'end_time',
            'location_name', 'location_address', 'category', 'category_details',
            'image_url', 'is_published', 'created_at', 'rsvps_count'
        )
        read_only_fields = ('slug', 'created_at')

    def get_rsvps_count(self, obj):
        return obj.rsvps.count()
