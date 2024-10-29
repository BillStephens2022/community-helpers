"use client";

import { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { fetchUsers } from "../_utils/api/users";
import { usersState } from "../_atoms/userAtom";
import Loader from "../_components/ui/Loader";
import ProfileCard from "../_components/ProfileCard";
import { skillsetOptions } from "../_lib/constants";
import styles from "./page.module.css";

export default function Community() {
  const users = useRecoilValue(usersState);
  const [skillFilter, setSkillFilter] = useState("None");

  const filteredUsers = users.filter(
    (user) => skillFilter === "None" || user.skillset === skillFilter
  );

  return (
    <div className={styles.community_page}>
      <h2 className={styles.community_h2}>
        Find a neighbor with the skills you need!
      </h2>
      <div className={styles.filter_div}>
        <label htmlFor="skill-filter" className={styles.filter_label}>
          Filter by skillset:
        </label>
        <select
          id="skillset-filter"
          value={skillFilter}
          onChange={(e) => setSkillFilter(e.target.value)} // Update the filter state
          className={styles.filter_select}
        >
          {/* Default "None" option */}
          <option value="None">None</option>
          {/* Map over skillsetOptions to create dropdown options */}
          {skillsetOptions.map((skill) => (
            <option key={skill} value={skill}>
              {skill}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.users_div}>
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <ProfileCard
              key={user._id}
              user={user}
              size="small"
              isProfilePage={false}
            />
          ))
        ) : (
          <p>No users found with the selected skill.</p>
        )}
      </div>
    </div>
  );
}
