from fastapi.testclient import TestClient
from app.main import app

def get_user_token_headers(client: TestClient) -> dict[str, str]:
    data = {'username': 'TEST_NAME', 'password': "TestPassword"}

    r = client.post(
        f"/users/login/access-token",
        data=data,
    )

    tokens = r.json()
    access_token = tokens["access_token"]
    headers = {"Authorization": f"Bearer {access_token}"}
    return headers
    