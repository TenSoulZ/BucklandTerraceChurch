from django.db import models
from django.conf import settings

class PrayerRequest(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='prayer_requests')
    requester_name = models.CharField(max_length=150, blank=True)
    requester_email = models.EmailField(blank=True)
    
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    is_public = models.BooleanField(default=False)
    is_anonymous = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=[
        ('new', 'New'),
        ('praying', 'Praying'),
        ('answered', 'Answered'),
    ], default='new')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} by {self.requester_name or 'Anonymous'}"

class PrayerResponse(models.Model):
    prayer_request = models.ForeignKey(PrayerRequest, on_delete=models.CASCADE, related_name='responses')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Response to {self.prayer_request.title}"
