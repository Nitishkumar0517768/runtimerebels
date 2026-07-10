import unittest
from fastapi.testclient import TestClient
from app.api.routes import app


class TestDashboardRoutes(unittest.TestCase):

    def setUp(self):
        self.client = TestClient(app)

    def test_get_stats(self):
        response = self.client.get("/api/stats")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("messages_replied", data)
        self.assertIn("active_platforms", data)
        self.assertIn("pending_approvals", data)

    def test_get_activity(self):
        response = self.client.get("/api/activity")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(isinstance(response.json(), list))

    def test_get_and_post_config(self):
        # GET config
        get_res = self.client.get("/api/config")
        self.assertEqual(get_res.status_code, 200)

        # POST config
        payload = {
            "name": "TestUser",
            "formality_level": 4,
            "reply_delay_min": 15,
            "reply_delay_max": 90,
        }
        post_res = self.client.post("/api/config", json=payload)
        self.assertEqual(post_res.status_code, 200)
        self.assertEqual(post_res.json()["status"], "updated")

    def test_toggle_platform(self):
        response = self.client.post("/api/platforms/telegram/toggle")
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.json())

    def test_approve_reply(self):
        payload = {"content": "this is approved text"}
        response = self.client.post("/api/approvals/appr_1/approve", json=payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "approved")

    def test_reject_reply(self):
        response = self.client.post("/api/approvals/appr_2/reject")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "rejected")


if __name__ == "__main__":
    unittest.main()
