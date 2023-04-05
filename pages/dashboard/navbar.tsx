import Image from "next/image";
import styles from "./dashboard.module.css";
import { Button } from "@nextui-org/react";
import { RiUserLine } from "react-icons/ri";

import { COLORS } from "../../constants/colors";

const NavbarComponent = () => {
  const date = new Date().toDateString();
  const time = new Date().toLocaleTimeString();
  return (
    <main className={styles.main}>
      <div className={styles.logo}>
        <Image
          src="/logo_large.png"
          alt="logo"
          width={115}
          height={25}
          priority={true}
        />
      </div>
      <Button
        size="md"
        auto
        color="primary"
        rounded
        flat
        className={styles.login}
        onPress={() => null}
      >
        <RiUserLine size={15} color={COLORS.blue800} />
      </Button>
    </main>
  );
};

export default NavbarComponent;
