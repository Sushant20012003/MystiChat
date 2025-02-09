import React, { useEffect, useState } from 'react';
import { CiSearch } from "react-icons/ci";
import { BASE_URL } from '../api/config';


export default function SearchUser({users, setUsers}) {

    const [username, setUesrname] = useState("");
   
    useEffect(()=> {
        const fetchUsers = async()=>{
            if(username) {
                try {
                    let response = await fetch(`${BASE_URL}/api/auth/search`, {
                        method: 'POST',
                        headers:{
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({username: username}),
                        credentials: 'include'
                    });
            
                    response = await response.json();
    
                    if(response.success) {
                        setUsers(response.users);
                    }
                } catch (error) {
                    console.log(error);
                    
                }
            }
            else {
                setUsers(null);
            }
        }

        fetchUsers();

    }, [username]);

  return (
    <div className='flex w-full items-center gap-2 bg-gray-700 ml-2 px-4 py-2 rounded-3xl mb-4'>
            <CiSearch color='white' />
            <input type="text" placeholder='Search people...'
                className='bg-gray-700 w-full focus:outline-none text-white'
                value={username}
                onChange={(e) => setUesrname(e.target.value)}
            />
        </div>
  )
}
