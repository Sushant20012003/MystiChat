export const sendMessage = async(userId, message, conversationId) => {
    try {
        let response = await fetch(`http://localhost:8000/api/message/send/${userId}`, {
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({message: message, conversationId: conversationId}),
            credentials:'include'
        });

        response = await response.json();

        return response;

    } catch (error) {
        console.log(error);
        
    }
}


export const getPersonalMessage = async(conversationId) => {
    try {
        let response = await fetch(`http://localhost:8000/api/message/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({conversationId: conversationId}),
            credentials:'include'
        });

        response = await response.json();

        return response;

    } catch (error) {
        console.log(error);
        
    }
}


export const sendGroupMessage = async(message) => {
    try {
        let response = await fetch(`http://localhost:8000/api/message/all/send`, {
            method:'POST',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({message: message}),
            credentials:'include'
        });

        response = await response.json();
        return response;

    } catch (error) {
        console.log(error);
        
    }
}



export const getGroupMessage = async() => {
    try {
        let response = await fetch('http://localhost:8000/api/message/all/get', {
            method:'GET',
            credentials:'include'
        });

        response = await response.json();
        return response;

    } catch (error) {
        console.log(error);
        
    }
}