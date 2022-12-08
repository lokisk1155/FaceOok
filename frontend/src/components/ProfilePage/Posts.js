import { useParams } from "react-router-dom";
import { fetchUser, updateUser } from "../../store/user";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCurrent } from "../../store/user";
import Featured from "./Featured";
import EditDetails from "./EditDetails";
import { fetchtPosts, updatePost } from "../../store/post";
import { createPost } from "../../store/post";
import "./Posts.css";
import CreatePostModal from "./createPostModal";
import profilePic from "../HomePage/NavBar/imgs/blank.png";
import { deletePost } from "../../store/post";

function Posts() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => {
    return state.user
  })

  const sessionUser = useSelector((state) => {
    return state.session.user;
  });

  const allPosts = useSelector((state) => state.post)

  const [posts, setPosts] = useState(null)

  const [displayEditDelete, setDisplayEditDelete] = useState(false);

  const [day, setDay] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [bio, setBio] = useState(null);
  const [toggleBio, setToggleBio] = useState(false);
  const [details, setDetails] = useState(false);
  const [featured, setFeatured] = useState(null);
  const [location, setLocation] = useState(null);
  const [customFeatured, setCustomFeatured] = useState(true);
  const [customEdit, setCustomEdit] = useState(true);
  const [customBio, setCustomBio] = useState(true);
  const [name, setName] = useState(null) 

  const [relationship, setRelationShip] = useState(null);

  const [togglePost, setTogglePost] = useState(false);
  const [customPost, setCustomPost] = useState(false);

  const [work, setWork] = useState(null);
  const [content, setContent] = useState("ayeee");


  let antiToggle = !toggleBio;

  const [postDeleted, setPostDeleted] = useState(false);

  const [editPost, setEditPost] = useState(null);
  const [customEditPost, setCustomEditPost] = useState(false);

  useEffect(() => {
    dispatch(fetchUser(id)).then(() => dispatch(fetchtPosts()));
    if (postDeleted) {
      setPostDeleted(false);
    }
    if (sessionUser.id === id) {
      setDisplayEditDelete(true);
    }
    if (allPosts) {
      if (id) {
        const filteredPosts = Object.values(allPosts);
        filteredPosts.filter((post) => post.user_id === id);
          setPosts(filteredPosts.reverse())
       } else {
        setPosts(allPosts.reverse())
      }
    }
  }, [postDeleted]);



  console.log(posts)

  const handleBioSubmit = (e) => {
    e.preventDefault();
    setCustomBio(!customBio);
    setToggleBio(customBio);
    const user = {
      ...currentUser,
      bio,
    };
    user.password = currentUser.password;
    dispatch(updateUser(user));
  };

  const handleNewPost = (e) => {
    e.preventDefault();
    setTogglePost(true);
  };

  const handleDeletePost = (post) => {
    if (post.user_id === currentUser.id) {
      dispatch(deletePost(post.id));
      setPostDeleted(true);
      return;
    }
    return;
  }

  const handleEditPost = (postId) => (e) => {
    e.preventDefault();
    setEditPost(postId);
  };

  return (
    <div className="omega-profile-page-container">
      <div className="intro-container">
        <h2 className="intro-header">Intro </h2>
        <div>
          <h4 className="actual-bio">{bio}</h4>
          {antiToggle && (
            <button
              className="add-bio-button"
              onClick={() => {
                setCustomBio(!customBio);
                setToggleBio(customBio);
              }}
            >
              {"Edit Bio"}
            </button>
          )}
          <div className="edit-bio-container">
            {toggleBio && (
              <textarea
                className="text-area-bio"
                defaultValue="Describe who you are"
                onChange={(e) => setBio(e.target.value)}
              ></textarea>
            )}
            <div>
              <div>
                {toggleBio && (
                  <button
                    className="bio-cancel-button"
                    onClick={() => {
                      setCustomBio(!customBio);
                      setToggleBio(customBio);
                    }}
                  >
                    Cancel
                  </button>
                )}
                {toggleBio && (
                  <button className="bio-save-button" onClick={handleBioSubmit}>
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        {work && <p>Works at {work}</p>}
        {location && <p>Lives at {location}</p>}
        {relationship && <p>Relationship Status: {relationship}</p>}
        <div></div>

        <div>
          <button
            className="edit-details-button"
            onClick={() => {
              setCustomEdit(!customEdit);
              setDetails(customEdit);
            }}
          >
            Edit Details
          </button>

          {details && (
            <EditDetails closeForm={setDetails} currentUser={currentUser} />
          )}
        </div>
        <div>
          <div>
            <button
              className="add-featured-button"
              onClick={() => {
                setCustomFeatured(!customFeatured);
                setFeatured(customFeatured);
              }}
            >
              Add featured
            </button>
          </div>
          <div>{featured && <Featured />}</div>
        </div>
      </div>
      <div className="omega-posts-container">
        <div className="post-feed-container">
          <div className="create-post-modal">
            <button className="new-post-button" onClick={handleNewPost}>
              <label className="place-holder-text-new-post">
                What's on your mind?
              </label>
            </button>

            <div className="pic-holder">
              {
                <img
                  className="profile-pic-inside-create-post"
                  src={profilePic}
                ></img>
              }
            </div>

            <div className="modal-holder">
              {togglePost && (
                <CreatePostModal
                  type={"create"}
                  currentUser={currentUser}
                  postContent={"What's on your mind?"}
                  header={"Create post"}
                  closeModal={setTogglePost}
                />
              )}
            </div>
          </div>

          {posts && (
            <div className="individual-post-container">
              {posts
                .map((post, index) => {
                  return (
                    <div key={index} className="individual-post">
                      <div className="post-header">
                        <img className="post-pic" src={profilePic}></img>
                        <h5 className="current-user-name">{`${currentUser.first_name} ${currentUser.last_name}`}</h5>
                      </div>
                      <p className="post-content">{post.content}</p>
                      {displayEditDelete && (
                        <button onClick={() => handleDeletePost(post)}>
                          Delete Post
                        </button>
                      )}
                      {displayEditDelete && (
                        <button onClick={handleEditPost(post.id)}>
                          Edit Post
                        </button>
                      )}
                      {editPost === post.id && (
                        <CreatePostModal
                          type="update"
                          currentUser={currentUser}
                          postId={post.id}
                          postContent={post.content}
                          header={"Edit post"}
                          closeModal={setEditPost}
                        />
                      )}
                    </div>
                  );
                })
                .reverse()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Posts;

// onClick={(() => handleUpdatePost(post.id))}>

// const [togglePost, setTogglePost] = useState(false)
// const [customPost, setCustomPost] = useState(false)
