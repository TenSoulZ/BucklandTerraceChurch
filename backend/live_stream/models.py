from django.db import models
from django.conf import settings

class LiveStream(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    youtube_video_id = models.CharField(max_length=50, help_text="The ID of the YouTube video (e.g., dQw4w9WgXcQ)")
    is_live = models.BooleanField(default=False)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        status = " (LIVE)" if self.is_live else ""
        return f"{self.title}{status}"

class StreamChat(models.Model):
    stream = models.ForeignKey(LiveStream, on_delete=models.CASCADE, related_name='chat_messages')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    author_name = models.CharField(max_length=100, blank=True)  # For anonymous users if allowed
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        name = self.user.first_name if self.user else self.author_name
        return f"{name}: {self.message[:20]}"
