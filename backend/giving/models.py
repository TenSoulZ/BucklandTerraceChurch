from django.db import models
from django.conf import settings

class DonationCampaign(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    goal_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    current_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    def __str__(self):
        return self.name

class Donation(models.Model):
    PAYMENT_METHODS = (
        ('card', 'Credit/Debit Card'),
        ('bank', 'Bank Transfer'),
        ('cash', 'Cash'),
        ('other', 'Other'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    donor_name = models.CharField(max_length=150, blank=True)
    donor_email = models.EmailField(blank=True)
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    campaign = models.ForeignKey(DonationCampaign, on_delete=models.SET_NULL, null=True, blank=True, related_name='donations')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    transaction_id = models.CharField(max_length=100, blank=True)
    
    date_donated = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)

    def __str__(self):
        name = self.user.email if self.user else self.donor_name
        return f"{self.amount} from {name} on {self.date_donated.date()}"

class GivingStatement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='statements')
    year = models.IntegerField()
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    file_url = models.URLField(blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Statement {self.year} for {self.user.email}"
