import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchFriends } from "../../store/friend";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { fetchUsers } from "../../store/user";
import profilePic from "../NavBar/imgs/blank.png";
import { Link } from "react-router-dom";
import { deleteFriend } from "../../store/friend";
import "./Friends.css";

function Friends({ friends }) {
  const dispatch = useDispatch();

  const { id } = useParams();

  const sessionUserId = useSelector((state) => state.session.user.id);

  const [filteredUsers, setFilteredUsers] = useState(null);

  const [divHeight, setDivHeight] = useState(null);

  const [typed, setTyped] = useState("");

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleDelete = (userId) => (e) => {
    e.preventDefault();
    setTyped(null);
    return dispatch(deleteFriend(userId));
  };

  useEffect(() => {
    if (friends && typed.length > 0) {
      let currentMatches = Object.values(friends).filter((user) => {
        let userName = `${user.first_name} ${user.last_name}`.toLowerCase();
        return userName.startsWith(typed.toLowerCase());
      });
      setFilteredUsers(currentMatches);
    } else {
      setFilteredUsers(null);
    }

    if (Object.values(friends).length > 2) {
      let dividedLength = Math.floor(Object.values(friends).length / 2);
      let divCalc = dividedLength * 125 + 175;
      setDivHeight(`${divCalc}px`);
    } else {
      setDivHeight(`250px`);
    }
  }, [typed]);

  return (
    <div className="column-container">
      <div className="right-col"></div>
      <div className="middle-col" style={{ height: divHeight }}>
        <div className="friends-headers">
          <h2 style={{ margin: `25px` }}>Friends</h2>
          <div className="friends-search-bar-container">
            <i className="material-icons">search</i>
            <input
              className="friends-search-input"
              placeholder=" Search"
              onChange={(e) => setTyped(e.target.value)}
            />
          </div>
        </div>
        {friends && !filteredUsers ? (
          <div
            className="please-work-oh-my"
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
          >
            {Object.values(friends).map((friend) => {
              return (
                <div key={friend.id} className="actual-friend-container">
                  <Link to={`/ProfilePage/${friend.id}`}>
                    <img className="friend-profile-pic" src={profilePic}></img>
                  </Link>
                  <h5 className="friend-profile-name">{`${capitalizeFirstLetter(
                    friend.first_name
                  )} ${capitalizeFirstLetter(friend.last_name)}`}</h5>
                  {sessionUserId == id ? (
                    <button
                      className="delete-on-friend"
                      onClick={handleDelete(friend.id)}
                    >
                      <i className="unfriend-button-in-map"></i>
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
        {filteredUsers ? (
          <div
            className="please-work-oh-my"
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)" }}
          >
            {Object.values(filteredUsers).map((friend) => {
              return (
                <div key={friend.id} className="actual-friend-container">
                  <Link to={`/ProfilePage/${friend.id}`}>
                    <img className="friend-profile-pic" src={profilePic}></img>
                  </Link>
                  <h5 className="friend-profile-name">{`${capitalizeFirstLetter(
                    friend.first_name
                  )} ${capitalizeFirstLetter(friend.last_name)}`}</h5>
                  {sessionUserId == id ? (
                    <button
                      className="delete-on-friend"
                      onClick={handleDelete(friend.id)}
                    >
                      <i className="unfriend-button-in-map"></i>
                    </button>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
      <div className="left-col"></div>
    </div>
  );
}

export default Friends;
