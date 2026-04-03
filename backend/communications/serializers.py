from rest_framework import serializers
from .models import BroadcastGroup, Broadcast, NotificationLog, ContactMessage
from django.contrib.auth import get_user_model

User = get_user_model()

class BroadcastGroupSerializer(serializers.ModelSerializer):
    member_ids = serializers.PrimaryKeyRelatedField(
        source='members', 
        queryset=User.objects.all(), 
        many=True, 
        write_only=True,
        required=False
    )
    members_count = serializers.SerializerMethodField()

    class Meta:
        model = BroadcastGroup
        fields = ('id', 'name', 'description', 'members', 'member_ids', 'members_count', 'created_at')
        read_only_fields = ('members', 'created_at')

    def get_members_count(self, obj):
        return obj.members.count()

class BroadcastSerializer(serializers.ModelSerializer):
    target_group_ids = serializers.PrimaryKeyRelatedField(
        source='target_groups',
        queryset=BroadcastGroup.objects.all(),
        many=True,
        write_only=True,
        required=False
    )
    creator_email = serializers.CharField(source='created_by.email', read_only=True)

    class Meta:
        model = Broadcast
        fields = (
            'id', 'subject', 'content', 'channel', 'target_groups', 'target_group_ids',
            'status', 'scheduled_for', 'sent_at', 'created_by', 'creator_email', 'created_at'
        )
        read_only_fields = ('status', 'sent_at', 'created_at')

class NotificationLogSerializer(serializers.ModelSerializer):
    recipient_email = serializers.CharField(source='recipient.email', read_only=True)

    class Meta:
        model = NotificationLog
        fields = ('id', 'broadcast', 'recipient', 'recipient_email', 'channel', 'status', 'error_message', 'sent_at')
        read_only_fields = ('sent_at',)

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ('id', 'name', 'email', 'subject', 'message', 'created_at', 'is_read')
        read_only_fields = ('created_at', 'is_read')
