from django.contrib import admin
from .models import DonationCampaign, Donation, GivingStatement

admin.site.register(DonationCampaign)
admin.site.register(Donation)
admin.site.register(GivingStatement)
