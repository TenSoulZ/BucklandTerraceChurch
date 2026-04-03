from rest_framework import serializers
from .models import DonationCampaign, Donation, GivingStatement

class DonationCampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationCampaign
        fields = '__all__'

class DonationSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)

    class Meta:
        model = Donation
        fields = (
            'id', 'user', 'user_email', 'donor_name', 'donor_email',
            'amount', 'campaign', 'campaign_name', 'payment_method',
            'transaction_id', 'date_donated', 'notes'
        )
        read_only_fields = ('date_donated',)

class GivingStatementSerializer(serializers.ModelSerializer):
    user_email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = GivingStatement
        fields = ('id', 'user', 'user_email', 'year', 'total_amount', 'file_url', 'generated_at')
        read_only_fields = ('generated_at',)
