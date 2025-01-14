import React, { useEffect, useState } from "react";



function Chat(){
    const [chats, setChats] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const getUserChats = async () => {
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzdlNDdlYjQ3YzQ3YmE3YTM5YjlhMmUiLCJuYW1lIjoiQWJkdXIgUmVobWFuIiwiZW1haWwiOiJhYmR1cnJlaG1hbjQ0MTVAZ21haWwuY29tIiwiaWF0IjoxNzM2ODgwNDQ4LCJleHAiOjE3MzY4ODc2NDh9.43i4CSHIfiLDGR-e-ov8g33vGraDLsXDdtpkGrMFUfM";
        const bearerToken = `Bearer ${token}`
        try {
            const response = await fetch('http://localhost:8080/chat/my', {
            method: "GET",
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': bearerToken
            }
            });
        
            if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setChats(data);
        } catch (error) {
            console.error("Error fetching user chats:", error);
        }
    }
    useEffect(() => {
        getUserChats();
    }, []);
    return(
        <>
        </>
    );
}




export default Chat