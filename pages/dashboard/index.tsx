import styles from "./dashboard.module.css";
import { Container, NextUIProvider, Spacer } from "@nextui-org/react";
import Panel from "../components/panel";
import CardSection from "../components/cardSection";
import { COLORS } from "../constants/colors";
import { poppinsBold } from "../constants/fonts";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "../utils/🔥";
import { useEffect, useState } from "react";
import NavbarComponent from "./navbar";

const Main = () => {
  const today = new Date().toDateString();
  const [data, setData] = useState<any>();
  const [organized, setOrganized] = useState<any>();
  const dbInstance = collection(db, "global");

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  async function Organizer(text: string) {
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const org = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setOrganized(org.result);
    } catch (error) {
      return error;
    }
  }

  useEffect(() => {
    const docRef = doc(dbInstance, today);

    getDoc(docRef).then((doc) => {
      const data = doc.data();
      const items = [];
      console.log(data);

      data &&
        data.items.forEach((element) => {
          items.push(element);
        });

      const headlines = items.map((item) => {
        return item["headlines"];
      });

      const report = headlines.join(", ");
      setData(report);
    });

    return () => {
      docRef;
    };
  }, []);

  useEffect(() => {
    if (data) Organizer(data);
  }, [data]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

      console.log(windowSize.width);

      return () => window.removeEventListener("resize", handleResize);
    }
  }, [windowSize]);

  return (
    <NextUIProvider>
      <NavbarComponent />

      <div className={styles.body}>
        <Panel
          title={{
            text: "GLOBAL MARKETS",
            styles: `${poppinsBold.className} ${styles.titleText}`,
          }}
          color={COLORS.blue700}
        >
          <Container style={{ alignItems: "center" }}>
            <CardSection
              title="World Economy"
              text={organized}
              color={COLORS.blue800}
              fullReport={data}
            />
            <Spacer y={2} />
            <CardSection
              title="Geopolitics"
              text={"data && data.global.geopolitics"}
              color={COLORS.blue800}
            />
            <Spacer y={2} />
            <CardSection
              title="Global Final Report"
              text={"data && data.global.final"}
              color={COLORS.blue800}
            />
          </Container>
        </Panel>
      </div>
    </NextUIProvider>
  );
};

export default Main;
