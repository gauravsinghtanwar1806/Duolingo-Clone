import requests

BASE_URL = 'http://localhost:8000/api'

# 1. Login user A (alex)
res = requests.post(f"{BASE_URL}/auth/login/", json={'username': 'alex', 'password': 'password123'})
token_a = res.json()['access']
headers_a = {'Authorization': f'Bearer {token_a}'}

# 2. Get leaderboard to find a user to add
res = requests.get(f"{BASE_URL}/leaderboard/", headers=headers_a)
leaderboard = res.json()
# find someone who is not alex
target = next((u for u in leaderboard if u['friend_status'] == 'none'), None)

if target:
    print(f"Alex sending request to {target['username']} (ID: {target['id']})")
    # 3. Send friend request
    res = requests.post(f"{BASE_URL}/friends/request/", json={'receiver_id': target['id']}, headers=headers_a)
    print("Send request response:", res.status_code, res.json())
else:
    print("No target found")
