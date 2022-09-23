class Post{
    post_id = "";
    post_content = "";
    user_id = "";
    likes = 0;
    api_url = 'https://62dd96b379b9f8c30aac7e89.mockapi.io';

    async create(){
        let session  =new Session();
        session_id = session.getSession();
        let data={
            user_id: session_id,
            post_content: this.post_content,
            likes: 0
        }

        data = JSON.stringify(data);

        let response = await fetch(this.api_url+"/posts",{
            method: "POST",
            headers:{
                "Content-type": "application/json"
            },
            body:data
        });

        data = await response.json();
        return data;
    }

    async getAllPosts(){
        let response =await fetch('https://62dd96b379b9f8c30aac7e89.mockapi.io/posts', {
            method: 'GET',
            mode: 'cors',
            headers: {
                accept: 'application/json',
            },
        });

        let data = await response.json();

        return data;
    }

    delete(post_id){
        fetch('https://62dd96b379b9f8c30aac7e89.mockapi.io/posts/'+post_id, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                accept: 'application/json',
            },
        })
        .then(response=>{
            if (response.ok){
                alert("Successfully deleted post!")
            }
        });
    }

    like(post_id,new_likes){
        let data = {
            likes: parseInt(new_likes),
        }
        data = JSON.stringify(data)
        console.log(post_id+" "+parseInt(new_likes))
        fetch('https://62dd96b379b9f8c30aac7e89.mockapi.io/posts/'+post_id, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Content-type": 'application/json',
            },
            body: data
        }).then(response=>response.json())
        .then(data=>{
            console.log(data)
        })
    }
}