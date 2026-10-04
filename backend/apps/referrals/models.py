import uuid
from django.db import models
from apps.accounts.models import User
from apps.organizations.models import Organization

class ReferralCode(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="referral_profile")
    code = models.CharField(max_length=30, unique=True, db_index=True)
    total_clicks = models.PositiveIntegerField(default=0)
    total_signups = models.PositiveIntegerField(default=0)
    total_converted_orgs = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} ({self.user.email})"

class Referral(models.Model):
    class ReferralStatus(models.TextChoices):
        SIGNED_UP = "SIGNED_UP", "Signed Up"
        QUALIFIED = "QUALIFIED", "Qualified (Created Org / Added Property)"
        REWARDED = "REWARDED", "Reward Granted"
        FLAGGED = "FLAGGED", "Flagged as Fraudulent / Duplicate"

    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="referrals_given")
    referred_user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="referral_received")
    code_used = models.ForeignKey(ReferralCode, on_delete=models.CASCADE, related_name="referrals")
    referred_organization = models.ForeignKey(Organization, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=25, choices=ReferralStatus.choices, default=ReferralStatus.SIGNED_UP)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.referrer.email} -> {self.referred_user.email} [{self.get_status_display()}]"

class ReferralReward(models.Model):
    class RewardType(models.TextChoices):
        CREDIT = "CREDIT", "Subscription Credits (₹)"
        AI_CREDITS = "AI_CREDITS", "Ekrar AI Query Credits"
        CASH_PAYOUT = "CASH_PAYOUT", "Direct UPI / Bank Transfer"

    class RewardStatus(models.TextChoices):
        PENDING = "PENDING", "Pending Admin Approval"
        APPROVED = "APPROVED", "Approved"
        PAID = "PAID", "Disbursed"
        REJECTED = "REJECTED", "Rejected"

    referral = models.OneToOneField(Referral, on_delete=models.CASCADE, related_name="reward")
    reward_type = models.CharField(max_length=20, choices=RewardType.choices, default=RewardType.CREDIT)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=500.0)
    status = models.CharField(max_length=20, choices=RewardStatus.choices, default=RewardStatus.APPROVED)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"₹{self.amount} for {self.referral.referrer.email} [{self.get_status_display()}]"
