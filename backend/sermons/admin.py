from django.contrib import admin
from .models import SermonSeries, SermonTag, Sermon

admin.site.register(SermonSeries)
admin.site.register(SermonTag)
admin.site.register(Sermon)
