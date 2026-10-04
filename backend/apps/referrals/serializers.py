from rest_framework import serializers
from apps.referrals.models import ReferralCode, Referral, ReferralReward

class ReferralRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReferralReward
        fields = "__all__"

class ReferralSerializer(serializers.ModelSerializer):
    referred_user_email = serializers.CharField(source="referred_user.email", read_only=True)
    reward = ReferralRewardSerializer(read_only=True)

    class Meta:
        model = Referral
        fields = ["id", "referred_user_email", "status", "reward", "created_at"]

class ReferralCodeSerializer(serializers.ModelSerializer):
    referral_url = serializers.SerializerMethodField()
    referrals = ReferralSerializer(many=True, read_only=True)
    total_rewards_earned = serializers.SerializerMethodField()

    class Meta:
        model = ReferralCode
        fields = [
            "code",
            "referral_url",
            "total_clicks",
            "total_signups",
            "total_converted_orgs",
            "total_rewards_earned",
            "referrals",
            "created_at",
        ]

    def get_referral_url(self, obj):
        return f"https://erentkarar.com/register?ref={obj.code}"

    def get_total_rewards_earned(self, obj):
        return sum(
            float(r.reward.amount)
            for r in obj.referrals.filter(reward__isnull=False, reward__status="APPROVED")
        )
