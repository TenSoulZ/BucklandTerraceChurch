from django.contrib import admin
from .models import EventCategory, Event, RSVP

admin.site.register(EventCategory)
admin.site.register(Event)
admin.site.register(RSVP)
