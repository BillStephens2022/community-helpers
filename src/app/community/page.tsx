"use client";

import { useState } from "react";
import { useRecoilValue } from "recoil";
import { usersState } from "../_atoms/userAtom";
import CommunityCard from "../_components/CommunityCard";
import { skillsetOptions } from "../_lib/constants";
import styles from "./page.module.css";

export default function Community() {
  const users = useRecoilValue(usersState);
  const [skillFilter, setSkillFilter] = useState("None");

  const workers = users.filter((user) => user.isWorker === true);

  const filteredWorkers = workers.filter(
    (worker) => skillFilter === "None" || worker.skillset === skillFilter
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
        {filteredWorkers.length > 0 ? (
          filteredWorkers.map((worker) => (
            <CommunityCard
              key={worker._id}
              user={worker}
            />
          ))
        ) : (
          <p>No neighbors found with the selected skill.</p>
        )}
      </div>
    </div>
  );
}
