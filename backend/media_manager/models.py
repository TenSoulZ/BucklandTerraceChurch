from django.db import models
from django.conf import settings

class ImageAsset(models.Model):
    file_id = models.CharField(max_length=255, unique=True)
    url = models.URLField(max_length=500)
    thumbnail_url = models.URLField(max_length=500, blank=True)
    
    name = models.CharField(max_length=255)
    size = models.PositiveIntegerField(null=True, blank=True)
    
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
