from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

sample_stack = 1000
sample_action = {
    "hand_uuid": "123e4567-e89b-12d3-a456-426614174000",
    "action_type": "raise",
    "amount": 100
}

def test_start_hand():
    response = client.post("/api/v1/hand/start", json={"stack": sample_stack}) 
    assert response.status_code == 200
    data = response.json()
    assert "hand_uuid" in data
    assert data["stack"] == sample_stack
    assert isinstance(data["players_hand"], list)
    assert isinstance(data["actions"], list)
    assert isinstance(data["winnings"], list)

def test_take_action():
    response = client.post("/api/v1/hand/start", json={"stack": sample_stack}) 
    sample_action['hand_uuid'] = response.json()['hand_uuid']
    response = client.post("/api/v1/hand/action", json=sample_action)
    assert response.status_code == 200
    data = response.json()
    action = data["action"]
    assert "hand_uuid" in action
    assert action["hand_uuid"] == sample_action["hand_uuid"]
    assert data["action"]["action_type"] == sample_action["action_type"]

def test_get_hand_history():
    response = client.post("/api/v1/hand/start", json={"stack": sample_stack}) 
    response = client.get("/api/v1/hand/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    for hand in data:
        assert "hand_uuid" in hand
        assert isinstance(hand["players_hand"], list)
        assert isinstance(hand["actions"], list)
        assert isinstance(hand["winnings"], list)


def test_start_hand_invalid_input():
    response = client.post("/api/v1/hand/start", json={})
    assert response.status_code == 422  

def test_take_action_invalid_action():
    response = client.post("/api/v1/hand/start", json={"stack": sample_stack}) 
    invalid_action = {"action_type": "raise","amount" : 100}
    response = client.post("/api/v1/hand/action", json=invalid_action)
    assert response.status_code == 422  


