let session = new Session();
let session_id = session.getSession();

if (session_id != "") {

    async function populateUserData() {
        let user = new User();
        user = await user.get(session_id);

        $("#login_email").text(user["email"])
        $("#login_username").text(user.username);

        $("#edit_email").val(user["email"])
        $("#edit_username").val(user.username);
    }

    populateUserData();
} else {
    window.location.href = "/"
}

let config = {
    "edit_username": {
        required: true,
        minlength: 5,
        maxlength: 50
    },
    "edit_email": {
        required: true,
        email: true,
        minlength: 5,
        maxlength: 50
    },
    "edit_password": {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: "edit_repeat_password"
    },
    "edit_repeat_password": {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: "edit_password"
    }
}

let validator = new Validator(config, "#registrationForm")

$("#logout").click(function (e) {
    e.preventDefault();
    session.destroySession();
    window.location.href = "/"
});

$("#editAccount").click((e) => {
    $(".custom-modal").css("display", "block")
})

$("#closeModal").click((e) => {
    $(".custom-modal").css("display", "none")
})

$(document).keydown((e) => {
    if (e.key === "Escape") {
        $(".custom-modal").css("display", "none")
    }
})

$("#edit_submit").click((e) => {

    if (validator.validationPassed()) {
        let user = new User();
        user.username = $("#edit_username").val();
        user.email = $("#edit_email").val();
        user.password = $("#edit_password").val();
        if (user.username == "" || user.email == "" || user.password == "") {
            alert("All fields must be fulfilled properly!")
        } else {
            user.edit();
        }

    } else {
        alert("The fields are not fulfilled properly!")
    }
})


$("#deleteProfileConfirm").click((e) => {
    e.preventDefault();
    let user = new User();
    user.delete();
})

$("#createPostButton").click((e) => {
    e.preventDefault();
    let content = $("#postContent").val();
    let pre_html = $("#allPostsWraper").html();
    async function createPost() {
        post = new Post();
        post.post_content = content;
        post = await post.create();

        let current_user = new User();
        current_user = await current_user.get(session_id)

        let delete_html = "";
        if (post.user_id === session_id) {
            delete_html = '<button class="remove-btn" onclick="removeMyPost(this)">remove</button>'
        }


        let comment_html = '<div class="singlePost" data-post_id="' + post.id + '"> <div class="post-content">' + post.post_content + '</div>'
        comment_html += '<div class="postActions"><p><b>author: ' + current_user.username + '</b></p><div><button class="likePostJS like-btn" onclick="likePost(this)"><span>' + post.likes + '</span> Likes</button><button class="comment-btn" onclick="commentPost(this)">Comments</button>' + delete_html + '</div></div>'
        comment_html += '<div class="post-comments"><form action=""><input placeholder="Write comment..." type="text"><button onclick="commentPostSubmit(event)">Comment</button></form></div> </div>'
        comment_html += pre_html;

        $("#allPostsWraper").html(comment_html);
    }

    if (content === "") {
        alert("Please write something first, than post.")
    } else {
        createPost();
        $("#postContent").val("")
    }

})

async function getAllPosts() {
    let allPosts = new Post();
    allPosts = await allPosts.getAllPosts();


    allPosts.forEach(post => {
        async function getUserandPosts() {
            posts_html = "";
            let delete_html = "";
            if (post.user_id === session_id) {
                delete_html = '<button class="remove-btn" onclick="removeMyPost(this)">remove</button>'
            }

            let comments = new Comment();
            comments = await comments.get(post.id);


            let current_user = new User();
            current_user = await current_user.get(post.user_id)

            let comment_html = '<div class="singlePost" data-post_id="' + post.id + '"> <div class="post-content">' + post.post_content + '</div>'
            comment_html += '<div class="postActions"><p><b>author: ' + current_user.username + '</b></p><div><button class="likePostJS like-btn" onclick="likePost(this)"><span>' + post.likes + '</span> Likes</button><button class="comment-btn" onclick="commentPost(this)">Comments</button>' + delete_html + '</div></div>'
            comment_html += '<div class="post-comments"><form action=""><input placeholder="Write comment..." type="text"><button onclick="commentPostSubmit(event)">Comment</button></form>'
            comments.forEach(comment => {
                comment_html+='<div class="single-comment">' + comment.content + '</div>'
            })

            comment_html += '</div> </div>';

            posts_html += comment_html;
            $("#allPostsWraper").html(posts_html);
        }

        getUserandPosts();
    });


}

getAllPosts()


const commentPostSubmit = event => {
    event.preventDefault();
    let btn = event.target;

    $(btn).attr("disabled", "true");
    let main_post_el = btn.closest(".singlePost");
    let post_id = $(main_post_el).attr("data-post_id")

    let html = $(main_post_el).children(".post-comments").html();

    let comment_value = $(main_post_el).find("input").val()

    $(main_post_el).children(".post-comments").append('<div class="single-comment">' + comment_value + '</div>')

    if (comment_value === "") {
        alert("Please write something...")
        $(btn).attr("disabled", "false");
    } else {
        async function createComment(){
            comment = new Comment();
            comment.post_id = post_id;
            comment.content = comment_value;
            comment = await comment.create();
        }

        createComment();
        $(main_post_el).find("input").val("")
    }

}

const removeMyPost = btn => {
    let main_post_el = btn.closest(".singlePost");
    let post_id = $(main_post_el).attr("data-post_id")
    $(main_post_el).css("display","none")

    post = new Post();
    post.delete(post_id);
}

const commentPost = btn => {
    let main_post_el = btn.closest(".singlePost");
    let post_id = $(main_post_el).attr("data-post_id")
    $(main_post_el).children(".post-comments").css("display", "block")


}

const likePost = btn => {
    let main_post_el = btn.closest(".singlePost");
    let post_id = $(main_post_el).attr("data-post_id")
    let likes = $(main_post_el).find("span").text();
    likes++;
    $(btn).find("span").text(likes);

    post = new Post();
    post.like(post_id,likes);

    $(btn).attr("disabled", "true");
}