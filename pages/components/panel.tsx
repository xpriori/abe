import { Container, Text, Spacer } from "@nextui-org/react";
import { ReactElement } from "react";
import { FaGlobeAmericas } from "react-icons/fa";
import styles from "./cardSection.module.css";
import { poppins } from "../../constants/fonts";

type PanelPropTypes = {
  icon: string;
  title: string;
  color: string;
  children: ReactElement;
};

const Panel = ({ icon, title, color, children }: PanelPropTypes) => {
  const Title = () => {
    return (
      <Container className={styles.panelTitle}>
        <Text>{icon}</Text>
        <Text
          color={color}
          css={{ mt: 0 }}
          className={`${poppins.className} ${styles.panelTitleLabel}`}
        >
          {title}
        </Text>
      </Container>
    );
  };

  return (
    <div>
      <Spacer y={1} />
      <Title />
      <Spacer y={1} />

      {children}
    </div>
  );
};
export default Panel;
