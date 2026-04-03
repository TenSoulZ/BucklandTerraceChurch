from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from accounts.views import UserViewSet, RoleViewSet, UserRoleViewSet, FamilyUnitViewSet, MemberProfileViewSet, AttendanceViewSet
from sermons.views import SermonSeriesViewSet, SermonTagViewSet, SermonViewSet
from events.views import EventCategoryViewSet, EventViewSet, RSVPViewSet
from giving.views import DonationCampaignViewSet, DonationViewSet, GivingStatementViewSet
from blog.views import CategoryViewSet, TagViewSet, PostViewSet, CommentViewSet
from prayer.views import PrayerRequestViewSet, PrayerResponseViewSet
from communications.views import BroadcastGroupViewSet, BroadcastViewSet, NotificationLogViewSet, ContactMessageViewSet
from media_manager.views import ImageAssetViewSet

router = DefaultRouter()

# Accounts
router.register(r'users', UserViewSet, basename='users')
router.register(r'roles', RoleViewSet, basename='roles')
router.register(r'user-roles', UserRoleViewSet, basename='user-roles')
router.register(r'families', FamilyUnitViewSet, basename='families')
router.register(r'profiles', MemberProfileViewSet, basename='profiles')
router.register(r'attendance', AttendanceViewSet, basename='attendance')

# Sermons
router.register(r'sermons/series', SermonSeriesViewSet, basename='sermons-series')
router.register(r'sermons/tags', SermonTagViewSet, basename='sermons-tags')
router.register(r'sermons', SermonViewSet, basename='sermons')

# Events
router.register(r'events/categories', EventCategoryViewSet, basename='events-categories')
router.register(r'events/rsvps', RSVPViewSet, basename='events-rsvps')
router.register(r'events', EventViewSet, basename='events')

# Giving
router.register(r'giving/campaigns', DonationCampaignViewSet, basename='giving-campaigns')
router.register(r'giving/donations', DonationViewSet, basename='giving-donations')
router.register(r'giving/statements', GivingStatementViewSet, basename='giving-statements')

# Blog
router.register(r'blog/categories', CategoryViewSet, basename='blog-categories')
router.register(r'blog/tags', TagViewSet, basename='blog-tags')
router.register(r'blog/comments', CommentViewSet, basename='blog-comments')
router.register(r'blog/posts', PostViewSet, basename='blog-posts')

# Prayer
router.register(r'prayer/requests', PrayerRequestViewSet, basename='prayer-requests')
router.register(r'prayer/responses', PrayerResponseViewSet, basename='prayer-responses')

# Communications
router.register(r'communications/groups', BroadcastGroupViewSet, basename='communications-groups')
router.register(r'communications/broadcasts', BroadcastViewSet, basename='communications-broadcasts')
router.register(r'communications/logs', NotificationLogViewSet, basename='communications-logs')
router.register(r'communications/contact', ContactMessageViewSet, basename='communications-contact')

# Media Manager
router.register(r'media', ImageAssetViewSet, basename='media')

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/v1/', include(router.urls)),
    
    # Auth endpoints
    path('api/v1/auth/login/', __import__('accounts.auth_views').auth_views.CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/auth/register/', __import__('accounts.auth_views').auth_views.RegisterView.as_view(), name='register'),
    path('api/v1/auth/logout/', __import__('accounts.auth_views').auth_views.LogoutView.as_view(), name='logout'),
    path('api/v1/auth/me/', __import__('accounts.auth_views').auth_views.UserMeView.as_view(), name='me'),
    
    # OpenAPI Schema
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]
