from django.contrib import admin
from .models import PrayerRequest, PrayerResponse

admin.site.register(PrayerRequest)
admin.site.register(PrayerResponse)
