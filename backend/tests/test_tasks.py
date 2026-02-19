import pytest
from datetime import date, timedelta

def test_create_user(client):
    response = client.post("/users", json={"name": "Alice"})
    assert response.status_code == 201
    assert response.json["name"] == "Alice"
    assert response.json["status"] == "active"

def test_assign_to_inactive_user_fails(client):
    # 1. Create inactive user
    user_res = client.post("/users", json={"name": "Bob", "status": "inactive"})
    user_id = user_res.json["id"]
    
    # 2. Create task
    task_res = client.post("/tasks", json={
        "title": "Task 1",
        "start_date": str(date.today()),
        "end_date": str(date.today() + timedelta(days=1))
    })
    task_id = task_res.json["id"]
    
    # 3. Assign
    response = client.post(f"/tasks/{task_id}/assign", json={"user_id": user_id})
    assert response.status_code == 400
    assert response.json["error"] == "RULE_VIOLATION"
    assert "User is inactive" in response.json["message"]

def test_overlapping_tasks_fail(client):
    # 1. Create active user
    user_res = client.post("/users", json={"name": "Charlie"})
    user_id = user_res.json["id"]
    
    # 2. Create Task A: today to tomorrow
    task_a = client.post("/tasks", json={
        "title": "Task A",
        "start_date": str(date.today()),
        "end_date": str(date.today() + timedelta(days=1))
    }).json
    
    # 3. Create Task B: tomorrow to day-after-tomorrow (Overlaps on tomorrow)
    task_b = client.post("/tasks", json={
        "title": "Task B",
        "start_date": str(date.today() + timedelta(days=1)),
        "end_date": str(date.today() + timedelta(days=2))
    }).json
    
    # 4. Assign Task A
    client.post(f"/tasks/{task_a['id']}/assign", json={"user_id": user_id})
    
    # 5. Assign Task B (should fail)
    response = client.post(f"/tasks/{task_b['id']}/assign", json={"user_id": user_id})
    assert response.status_code == 400
    assert response.json["error"] == "RULE_VIOLATION"
    assert "Task overlaps" in response.json["message"]

def test_complete_before_start_fails(client):
    # 1. Create task starting in the future
    future_date = date.today() + timedelta(days=5)
    task = client.post("/tasks", json={
        "title": "Future Task",
        "start_date": str(future_date),
        "end_date": str(future_date + timedelta(days=1))
    }).json
    
    # 2. Try to complete it today
    response = client.post(f"/tasks/{task['id']}/status", json={"status": "completed"})
    assert response.status_code == 400
    assert response.json["error"] == "RULE_VIOLATION"
    assert "cannot be completed before its start date" in response.json["message"]

def test_valid_completion(client):
    # 1. Create task starting today
    task = client.post("/tasks", json={
        "title": "Today Task",
        "start_date": str(date.today()),
        "end_date": str(date.today() + timedelta(days=1))
    }).json
    
    # 2. Complete it
    response = client.post(f"/tasks/{task['id']}/status", json={"status": "completed"})
    assert response.status_code == 200
    assert response.json["status"] == "completed"

def test_sequential_tasks_allowed(client):
    # Create user
    user_id = client.post("/users", json={"name": "Dave"}).json["id"]
    
    # Today only
    task_1 = client.post("/tasks", json={
        "title": "Task 1",
        "start_date": str(date.today()),
        "end_date": str(date.today())
    }).json
    
    # Tomorrow only (No overlap)
    task_2 = client.post("/tasks", json={
        "title": "Task 2",
        "start_date": str(date.today() + timedelta(days=1)),
        "end_date": str(date.today() + timedelta(days=1))
    }).json
    
    client.post(f"/tasks/{task_1['id']}/assign", json={"user_id": user_id})
    response = client.post(f"/tasks/{task_2['id']}/assign", json={"user_id": user_id})
    
    assert response.status_code == 200
