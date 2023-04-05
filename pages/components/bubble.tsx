import { Text } from "@nextui-org/react";
import styles from "./bubble.module.css";
import { RiUserLine } from "react-icons/ri";
import { BsRobot } from "react-icons/bs";
type BubblePropTypes = {
  id: number;
  text: string;
  type: string;
  createdAt?: string;
};

const Bubble = (props: BubblePropTypes) => {
  const { id, text, type, createdAt } = props;
  const Robot = () => {
    return (
      <>
        <div style={{ width: 20 }}>
          <BsRobot size={11} fill="#7828C8" className={styles.ai} />
        </div>
        <Text className={styles.robot}>{text}</Text>
      </>
    );
  };
  const Human = () => {
    return (
      <>
        <RiUserLine size={10} fill="#0E8AAA" className={styles.avatar} />
        <Text className={styles.bubble}>{text}</Text>
      </>
    );
  };
  return (
    <li key={createdAt} className={styles.bubbleContainer}>
      {type === "human" ? <Human /> : <Robot />}
    </li>
  );
};

export default Bubble;
