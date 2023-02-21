import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type GetUsersResponse = {
  login: string;
  avatar_url: string;
  html_url: string;
};

const preView = () => {
  const [searchParams] = useSearchParams();
  const [usersProfile, setUsersProfile] = useState<Array<GetUsersResponse>>([]);
  const imgStyles: React.CSSProperties = {};

  const users: Array<string> | undefined = searchParams
    .get("users")
    ?.split(",");

  const size: Array<string> | undefined = searchParams.get("size")?.split("x");

  if (size) {
    imgStyles.width = `${size[0]}px`;
    imgStyles.height = `${size[1]}px`;
  }

  useEffect(() => {
    const getUserProfile = async (name: string) => {
      const res = await axios.get<GetUsersResponse>(
        `https://api.github.com/users/${name}`
      );

      return res.data;
    };

    if (users) {
      Promise.all(users.map(getUserProfile)).then((results) => {
        setUsersProfile(results);
      });
    }
  }, []);

  return (
    <div>
      {usersProfile.map((item) => (
        <div key={item.login}>
          <img src={item.avatar_url} alt={item.login} style={imgStyles} />
          <p>{item.login}</p>
        </div>
      ))}
    </div>
  );
};

export default preView;
