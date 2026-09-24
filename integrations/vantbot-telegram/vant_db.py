"""VANT Supabase helper for Telegram bot."""

import os
from typing import Any, Optional

from supabase import Client, create_client


class VantDatabase:
    """Simple wrapper around Supabase for VANT tables."""
    
    def __init__(self):
        url = os.environ.get("SUPABASE_URL")
        key = os.environ.get("SUPABASE_KEY")
        if not url or not key:
            raise RuntimeError("Faltan SUPABASE_URL o SUPABASE_KEY")
        self.client: Client = create_client(url, key)
    
    def get_profile(self, username: str) -> Optional[dict[str, Any]]:
        """Get profile by username."""
        resp = self.client.table("profiles").select(
            "user_id, username, display_name, rank_key, points, wins, losses, country, email_verified"
        ).eq("username", username.lower()).limit(1).execute()
        return resp.data[0] if resp.data else None
    
    def get_profile_by_user_id(self, user_id: str) -> Optional[dict[str, Any]]:
        """Get profile by user_id."""
        resp = self.client.table("profiles").select(
            "user_id, username, display_name, rank_key, points, wins, losses, country, email_verified, placements_left, placement_wins, streak"
        ).eq("user_id", user_id).limit(1).execute()
        return resp.data[0] if resp.data else None
    
    def get_ranked_queue(self, user_id: str) -> Optional[dict[str, Any]]:
        """Get ranked queue entry for user."""
        resp = self.client.table("ranked_queue").select(
            "opponent_name, opponent_rank_key, opponent_mmr, created_at"
        ).eq("user_id", user_id).limit(1).execute()
        return resp.data[0] if resp.data else None
    
    def get_tournaments(self, limit: int = 10) -> list[dict[str, Any]]:
        """List open tournaments."""
        resp = self.client.table("tournaments").select(
            "id, name, status, starts_at, capacity, min_tier, prize, blurb"
        ).eq("status", "open").order("starts_at").limit(limit).execute()
        return resp.data
    
    def get_user_tickets(self, user_id: str) -> list[dict[str, Any]]:
        """Get all tickets for a user."""
        resp = self.client.table("tickets").select(
            "id, code, product_id, tier, status, created_at"
        ).eq("user_id", user_id).order("created_at", desc=True).execute()
        return resp.data
    
    def get_leaderboard(self, limit: int = 10) -> list[dict[str, Any]]:
        """Get top players by points."""
        resp = self.client.table("profiles").select(
            "username, display_name, rank_key, points, wins, losses, created_at"
        ).order("points", desc=True).limit(limit).execute()
        return resp.data
    
    def get_ranked_history(self, user_id: str, limit: int = 10) -> list[dict[str, Any]]:
        """Get recent ranked history for a user."""
        resp = self.client.table("ranked_history").select(
            "id, title, result, points_delta, created_at"
        ).eq("user_id", user_id).order("created_at", desc=True).limit(limit).execute()
        return resp.data
    
    def get_user_tournament_entries(self, user_id: str) -> list[dict[str, Any]]:
        """Get tournament entries for a user."""
        resp = self.client.table("tournament_entries").select(
            "id, tournament_id, status, created_at"
        ).eq("user_id", user_id).order("created_at", desc=True).execute()
        return resp.data
