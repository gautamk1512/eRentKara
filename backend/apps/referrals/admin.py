from django.contrib import admin
from apps.referrals.models import ReferralCode, Referral, ReferralReward


class ReferralRewardInline(admin.StackedInline):
    model = ReferralReward
    extra = 0


@admin.register(ReferralCode)
class ReferralCodeAdmin(admin.ModelAdmin):
    list_display = ("code", "user", "total_clicks", "total_signups", "total_converted_orgs", "created_at")
    search_fields = ("code", "user__email")


@admin.register(Referral)
class ReferralAdmin(admin.ModelAdmin):
    list_display = ("referrer", "referred_user", "code_used", "status", "created_at")
    list_filter = ("status", "created_at")
    search_fields = ("referrer__email", "referred_user__email", "code_used__code")
    inlines = [ReferralRewardInline]


@admin.register(ReferralReward)
class ReferralRewardAdmin(admin.ModelAdmin):
    list_display = ("referral", "reward_type", "amount", "status", "created_at")
    list_filter = ("reward_type", "status", "created_at")
    search_fields = ("referral__referrer__email", "notes")
