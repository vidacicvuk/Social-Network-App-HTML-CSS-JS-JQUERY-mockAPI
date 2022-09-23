class User {
    user_id = '';
    username = '';
    email = ''
    password = '';
    api_url = 'https://62dd96b379b9f8c30aac7e89.mockapi.io'

    create() {
        let data = {
            username: this.username,
            email: this.email,
            password: this.password
        }

        data = JSON.stringify(data)
        fetch(this.api_url + "/users", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: data
        })
            .then(response => response.json())
            .then(data => {
                window.location.href = "hexa.html"
                let session = new Session();
                session.user_id = data.id;
                session.startSession();
            })
    }

    login() {
        fetch('https://62dd96b379b9f8c30aac7e89.mockapi.io/users', {
            method: 'GET',
            mode: 'cors',
            headers: {
                accept: 'application/json',
            },
        }).then(response => response.json())
            .then(data => {
                let logged_in = false;
                data.forEach(db_user => {
                    if (db_user.email === this.email && db_user.password === this.password) {
                        logged_in = true;
                        window.location.href = "hexa.html"
                        let session = new Session();
                        session.user_id = db_user.id;
                        session.startSession();
                    }
                });

                if (!logged_in) {
                    alert("Wrong username or password!")
                }
            })


    }

    async get(user_id){
        let response =await fetch('https://62dd96b379b9f8c30aac7e89.mockapi.io/users/'+user_id, {
            method: 'GET',
            mode: 'cors',
            headers: {
                accept: 'application/json',
            },
        });

        let data = await response.json();

        return data;
    }

    edit(){
        let data  ={
            username: this.username,
            email: this.email,
            password: this.password
        }

        data = JSON.stringify(data);
        let session = new Session();

        let user_id = session.getSession();
        console.log(data)
        fetch('https://62dd96b379b9f8c30aac7e89.mockapi.io/users/'+user_id, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                "Content-type": 'application/json',
            },
            body: data
        }).then(response=>response.json())
        .then(data=>{
            window.location.href = "hexa.html"
        })
    }
    delete(){
        let session = new Session();
        let user_id = session.getSession();



        fetch('https://62dd96b379b9f8c30aac7e89.mockapi.io/users/'+user_id, {
            method: 'DELETE',
            mode: 'cors',
            headers: {
                "Content-type": 'application/json',
            },
        }).then(response=>response.json())
        .then(data=>{
            session.destroySession();
            window.location.href = "/";
        })
    }


}