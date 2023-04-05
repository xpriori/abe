import Head from "next/head";
import styles from "./dashboard.module.css";
import { Container, NextUIProvider, Spacer } from "@nextui-org/react";
import Panel from "../components/panel";
import CardSection from "../components/cardSection";
import { COLORS } from "../../constants/colors";
import { poppinsBold } from "../../constants/fonts";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "../../utils/🔥";
import { useEffect, useState } from "react";
import NavbarComponent from "./navbar";

const Main = () => {
  const today = new Date().toDateString();
  const [globalData, setGlobalData] = useState<any>();
  const [geopoliticsData, setGeopoliticsData] = useState<any>();
  const [organizedGlobal, setOrganizedGlobal] = useState<any>();
  const [organizedGeopolitics, setOrganizedGeopolitics] = useState<any>();
  const globalInstance = collection(db, "global");
  const geopoliticsInstance = collection(db, "geopolitics");

  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  async function Organizer(text: string, callback) {
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
          globalData.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      callback(org.result);
    } catch (error) {
      return error;
    }
  }

  ///////////////////////////
  // -*- GLOBAL INSTANCE -*-
  ///////////////////////////
  useEffect(() => {
    const docRef = doc(globalInstance, today);

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
      setGlobalData(report);
    });

    return () => {
      docRef;
    };
  }, []);

  useEffect(() => {
    if (globalData) Organizer(globalData, setOrganizedGlobal);
  }, [globalData]);

  /////////////////////////////////
  // -*- GEOPOLITICS INSTANCE -*-
  /////////////////////////////////
  useEffect(() => {
    const docRef = doc(geopoliticsInstance, today);

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
      setGeopoliticsData(report);
    });

    return () => {
      docRef;
    };
  }, []);

  useEffect(() => {
    if (geopoliticsData) Organizer(geopoliticsData, setOrganizedGeopolitics);
  }, [geopoliticsData]);

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
      <Head>
        <title>World News</title>
      </Head>
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
              text={organizedGlobal}
              color={COLORS.blue800}
              fullReport={globalData}
            />
            <Spacer y={2} />
            <CardSection
              title="Geopolitics"
              text={organizedGeopolitics}
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
