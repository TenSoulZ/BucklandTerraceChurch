import os

def write_admin(app_name, models):
    content = "from django.contrib import admin\n"
    content += f"from .models import {', '.join(models)}\n\n"
    for model in models:
        content += f"admin.site.register({model})\n"
    
    with open(os.path.join("backend", app_name, "admin.py"), "w") as f:
        f.write(content)

write_admin("events", ["EventCategory", "Event", "RSVP"])
write_admin("giving", ["DonationCampaign", "Donation", "GivingStatement"])
write_admin("blog", ["Category", "Tag", "Post", "Comment"])
write_admin("prayer", ["PrayerRequest", "PrayerResponse"])
write_admin("communications", ["BroadcastGroup", "Broadcast", "NotificationLog"])
write_admin("media_manager", ["ImageAsset"])
