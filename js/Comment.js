class Comment{
    user_id = "";
    post_id = "";
    content  ="";
    api_url = "https://62dd96b379b9f8c30aac7e89.mockapi.io"
    async create(){
        let session  =new Session();
        session_id = session.getSession();
        let data={
            user_id: session_id,
            post_id: this.post_id,
            content: this.content
        }

        data = JSON.stringify(data);

        let response = await fetch(this.api_url+"/comments",{
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body:data
        });

        data = await response.json();
        return data;
    }

    async get(post_id){
        let response =await fetch(this.api_url+"/comments", {
            method: 'GET',
            mode: 'cors',
            headers: {
                accept: 'application/json',
            },
        });

        let data = await response.json();

        let response_data = [];

        

        data.forEach(element => {
            if(element.post_id===post_id){
                response_data.push(element)
            }
            
        });

        return response_data;
    }
}