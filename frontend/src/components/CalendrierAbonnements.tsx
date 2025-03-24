import React from "react";
import Timeline from "react-calendar-timeline";
import moment from "moment";
import "react-calendar-timeline/lib/Timeline.css";
import styles from "../styles/CalendrierAbonnements.module.css";


const groupes = [{ id: 1, title: "Abonnements" }];

const items = [
  {
    id: 1,
    group: 1,
    title: "Netflix",
    start_time: moment("2025-03-20").valueOf(),
    end_time: moment("2025-03-20").add(1, "hour").valueOf(),
    itemProps: {
      style: {
        backgroundColor: "#f44336",
        color: "#fff",
        borderRadius: "4px",
        textAlign: "center" as const, // 👈 important
      },
    },
  },
];

const CalendrierAbonnements = () => {
  return (
    <div className={styles.container}>
      <Timeline
        groups={groupes}
        items={items}
        defaultTimeStart={moment().subtract(1, "month").valueOf()}
        defaultTimeEnd={moment().add(3, "months").valueOf()}
        lineHeight={50}
        itemHeightRatio={0.75}
        canMove={false}
        canResize={false}
        stackItems
      />
    </div>
  );
};

export default CalendrierAbonnements;
