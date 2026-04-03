import os
import django
from django.utils import timezone
from datetime import timedelta

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from sermons.models import Sermon, SermonSeries  # noqa: E402
from events.models import Event, EventCategory  # noqa: E402
from blog.models import Post, Category  # noqa: E402
from giving.models import DonationCampaign  # noqa: E402
from prayer.models import PrayerRequest  # noqa: E402

def populate():
    # Clear existing data
    print("Clearing old data...")
    Sermon.objects.all().delete()
    SermonSeries.objects.all().delete()
    Event.objects.all().delete()
    EventCategory.objects.all().delete()
    Post.objects.all().delete()
    Category.objects.all().delete()
    DonationCampaign.objects.all().delete()
    PrayerRequest.objects.all().delete()

    print("Creating Sermon Series and Sermons...")
    series1 = SermonSeries.objects.create(title="The Grace of God", description="Exploring the unmerited favor of our Lord.")
    series2 = SermonSeries.objects.create(title="Walking in Wisdom", description="Practical lessons from the Book of Proverbs.")
    series3 = SermonSeries.objects.create(title="Kingdom Living", description="Understanding our role as citizens of Heaven.")

    sermons = [
        {"title": "The Meaning of Grace", "preacher": "Pastor Erasmus Makarimayi", "series": series1, "days_ago": 2},
        {"title": "Amazing Grace", "preacher": "Pastor Erasmus Makarimayi", "series": series1, "days_ago": 9},
        {"title": "The Path of the Upright", "preacher": "Pastor John Doe", "series": series2, "days_ago": 16},
        {"title": "Wisdom for Daily Life", "preacher": "Pastor John Doe", "series": series2, "days_ago": 23},
        {"title": "Seek First the Kingdom", "preacher": "Pastor Jane Smith", "series": series3, "days_ago": 30},
        {"title": "The Gospel of the Kingdom", "preacher": "Pastor Jane Smith", "series": series3, "days_ago": 37},
    ]

    for s in sermons:
        Sermon.objects.create(
            title=s["title"],
            preacher=s["preacher"],
            date_preached=timezone.now() - timedelta(days=s["days_ago"]),
            series=s["series"],
            is_published=True,
            video_url="https://www.youtube.com/embed/dQw4w9WgXcQ", # Placeholder
            thumbnail_url="https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=800&q=80"
        )

    print("Creating Event Categories and Events...")
    cat_worship = EventCategory.objects.create(name="Worship", color="#0d6efd")
    cat_youth = EventCategory.objects.create(name="Youth", color="#fd7e14")
    cat_community = EventCategory.objects.create(name="Community", color="#198754")
    cat_outreach = EventCategory.objects.create(name="Outreach", color="#dc3545")
    cat_study = EventCategory.objects.create(name="Bible Study", color="#6f42c1")

    events = [
        {
            "title": "Sunday Celebration Service",
            "desc": "Join us for our main weekly gathering of praise, worship, and the Word.",
            "cat": cat_worship,
            "days_ahead": 4,
            "hours": 2,
            "loc": "Main Sanctuary",
            "img": "https://images.unsplash.com/photo-1438032005730-c779502df39b?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Friday Youth Night",
            "desc": "A night of games, music, and fellowship for ages 13-21.",
            "cat": cat_youth,
            "days_ahead": 2,
            "hours": 3,
            "loc": "Church Hall",
            "img": "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Mid-week Bible Study",
            "desc": "Deep dive into the scriptures as we study the Gospel of John together.",
            "cat": cat_study,
            "days_ahead": 7,
            "hours": 1.5,
            "loc": "Online (Zoom)",
            "img": "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Grace Park Community Fair",
            "desc": "Supporting our local community with food, music, and fun for all families.",
            "cat": cat_community,
            "days_ahead": 12,
            "hours": 6,
            "loc": "Grace Park Grounds",
            "img": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80"
        },
        {
            "title": "Hospital Outreach Visit",
            "desc": "Praying for the sick and bringing hope to those in local hospitals.",
            "cat": cat_outreach,
            "days_ahead": 15,
            "hours": 3,
            "loc": "Harare Hospital",
            "img": "https://images.unsplash.com/photo-1516589174184-c685ca33d2b0?auto=format&fit=crop&w=800&q=80"
        }
    ]

    for e in events:
        start = timezone.now().replace(hour=10, minute=0, second=0) + timedelta(days=e["days_ahead"])
        Event.objects.create(
            title=e["title"],
            description=e["desc"],
            start_time=start,
            end_time=start + timedelta(hours=e["hours"]),
            location_name=e["loc"],
            location_address="Stand Number 15493, Figtree Road, Harare",
            category=e["cat"],
            image_url=e["img"],
            is_published=True
        )

    print("Creating Blog Posts...")
    blog_cat1 = Category.objects.create(name="Spiritual Growth")
    blog_cat2 = Category.objects.create(name="News & Updates")

    posts = [
        {
            "title": "5 Ways to Strengthen Your Prayer Life",
            "content": "Prayer is the lifeline of the believer. In this post, we explore five practical ways you can cultivate a deeper, more meaningful connection with God through daily prayer...",
            "cat": blog_cat1,
            "days_ago": 3
        },
        {
            "title": "New Ministry Launch: Grace Kids",
            "content": "We are excited to announce the launch of our new children's ministry! Grace Kids is designed to help our little ones discover the love of Jesus in a safe and fun environment...",
            "cat": blog_cat2,
            "days_ago": 7
        },
        {
            "title": "The Power of Testimony",
            "content": "There is incredible power in sharing what God has done in our lives. This week, we hear from several members who have experienced God's faithfulness in remarkable ways...",
            "cat": blog_cat1,
            "days_ago": 14
        }
    ]

    for p in posts:
        Post.objects.create(
            title=p["title"],
            content=p["content"],
            excerpt=p["content"][:100] + "...",
            category=p["cat"],
            is_published=True,
            published_at=timezone.now() - timedelta(days=p["days_ago"])
        )

    print("Creating Giving Campaigns...")
    DonationCampaign.objects.create(
        name="Building Expansion Project",
        description="We are raising funds to build a new multi-purpose hall to accommodate our growing congregation and youth programs.",
        goal_amount=150000,
        current_amount=62500,
        is_active=True,
        start_date=timezone.now().date() - timedelta(days=60)
    )
    DonationCampaign.objects.create(
        name="Mission Support 2024",
        description="Help us support our missionaries working in rural Zimbabwe to provide clean water and spread the Gospel.",
        goal_amount=25000,
        current_amount=18750,
        is_active=True,
        start_date=timezone.now().date() - timedelta(days=30)
    )
    DonationCampaign.objects.create(
        name="Community Kitchen Initiative",
        description="Providing hot meals twice a week for those struggling in our neighborhood.",
        goal_amount=5000,
        current_amount=4200,
        is_active=True,
        start_date=timezone.now().date() - timedelta(days=15)
    )

    print("Creating Sample Prayer Requests...")
    prayers = [
        {"name": "Sarah J.", "title": "Healing for my mother", "content": "Please pray for my mother who is undergoing surgery this Thursday. We trust God for a successful procedure and quick recovery.", "is_public": True},
        {"name": "Michael T.", "title": "Job Search", "content": "I have been looking for a job for 6 months. Please pray for God's favor and the right door to open soon.", "is_public": True},
        {"name": "Anonymous", "title": "Spiritual Strength", "content": "Going through a difficult season and need God's peace and strength to navigate through.", "is_public": True, "is_anonymous": True},
    ]

    for pr in prayers:
        PrayerRequest.objects.create(
            requester_name=pr["name"],
            requester_email="sample@example.com",
            title=pr["title"],
            content=pr["content"],
            is_public=pr["is_public"],
            is_anonymous=pr.get("is_anonymous", False),
            status="pending"
        )
    
    print("Database populated successfully!")

if __name__ == "__main__":
    populate()
