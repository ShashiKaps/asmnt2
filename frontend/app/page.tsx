'use client'
  import { useEffect, useState } from 'react';
  
  const APIURL = "http://ec2-100-28-228-232.compute-1.amazonaws.com:4080";
  
  export interface User {
    id: number;
    name: string;
    lineStatus: 'online' | 'offline';
  }
  
  export default function OnlineStatusManager() {
    const [users, setUsers] = useState<User[]>([]);
    const [newUserId, setNewUserId] = useState('');
  
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${APIURL}/api/users`);
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    const toggleStatus = async (id: number) => {
      const current = users.find((u) => u.id === id);
      if (!current) return;
  
      const newStatus = current.lineStatus === 'online' ? 'offline' : 'online';
  
      const res = await fetch(`${APIURL}/api/users?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...current, lineStatus: newStatus }),
      });
  
      if (res.ok) {
        fetchUsers(); // 🔁 Refetch after update
      }
    };
  
    const addUser = async () => {
      if (!newUserId) return;
  
      const res = await fetch(`${APIURL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserId, lineStatus: 'offline' }),
      });
  
      if (res.ok) {
        setNewUserId('');
        fetchUsers(); // 🔁 Refetch after adding
      }
    };
  
    const deleteID = async (id: number) => {
      const res = await fetch(`${APIURL}/api/users?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
  
      if (res.ok) {
        fetchUsers(); // 🔁 Refetch after delete
      }
    };
  
    return (
      <div style={{ padding: '1rem' }}>
        <h2>User Presence (Online/Offline)</h2>
  
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={newUserId}
            onChange={(e) => setNewUserId(e.target.value)}
            placeholder="Enter user ID"
            style={{ padding: '0.5rem', marginRight: '0.5rem' }}
          />
          <button onClick={addUser} style={{ padding: '0.5rem', backgroundColor: 'lightblue' }}>
            Add User
          </button>
        </div>
  
        <ul>
          {users.map((user) => (
            <li key={user.id} style={{ marginBottom: '0.5rem' }}>
              <strong>{user.name}</strong> —{' '}
              <span
                style={{
                  color: user.lineStatus === 'online' ? 'green' : 'gray',
                  fontWeight: 'bold',
                }}
              >
                {user.lineStatus}
              </span>
              <button
                onClick={() => toggleStatus(user.id)}
                style={{ color: 'blue', marginLeft: '1rem' }}
              >
                Toggle
              </button>
              <button
                onClick={() => deleteID(user.id)}
                style={{ color: 'red', marginLeft: '1rem' }}
              >
                DELETE
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
