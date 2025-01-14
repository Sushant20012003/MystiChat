export const useFindParticipants = async() => {
    try {
        let response = await fetch('http://localhost:8000/api/message/find/participants', {
            method:'GET',
            credentials:'include'
        });

        response = await response.json();

        return response;

    } catch (error) {
        console.log(error);
        
    }
}





