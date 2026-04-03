from django.contrib import admin
from .models import BroadcastGroup, Broadcast, NotificationLog

admin.site.register(BroadcastGroup)
admin.site.register(Broadcast)
admin.site.register(NotificationLog)
