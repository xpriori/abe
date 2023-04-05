import Head from "next/head";
import styles from "./dashboard.module.css";
import { Container, NextUIProvider, Spacer } from "@nextui-org/react";
import Panel from "../components/panel";
import CardSection from "../components/cardSection";
import { COLORS } from "../../constants/colors";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "../../utils/🔥";
import { useEffect, useState } from "react";
import NavbarComponent from "./navbar";

const Main = () => {
  const today = new Date().toDateString();
  const [globalData, setGlobalData] = useState<any>();
  const [geopoliticsData, setGeopoliticsData] = useState<any>();
  const [phData, setPhData] = useState<any>();
  const [docId, setDocId] = useState<any>();
  const [organizedGlobal, setOrganizedGlobal] = useState<any>();
  const [organizedGeopolitics, setOrganizedGeopolitics] = useState<any>();
  const [organizedFinal, setOrganizedFinal] = useState<any>();
  const [organizedPh, setOrganizedPh] = useState<any>();
  const globalInstance = collection(db, "global");
  const geopoliticsInstance = collection(db, "geopolitics");
  const phInstance = collection(db, "ph");

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
      setDocId(doc.id);
      const items = [];

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
    if (organizedGlobal) Organizer(geopoliticsData, setOrganizedGeopolitics);
  }, [organizedGlobal]);

  ///////////////////////////////////////////////////////////////////////////
  // -*- FINAL GLOBAL REPORT -*- ///////////////////////////////////////////
  ///////////////////////////////////////////////////////////////////////////

  async function GenerateFinal(eco: string, geo: string, callback) {
    try {
      const response = await fetch("/api/generateFinal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ economic: eco, geopolitics: geo }),
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

  useEffect(() => {
    if (organizedGeopolitics)
      GenerateFinal(globalData, geopoliticsData, setOrganizedFinal);
  }, [organizedGeopolitics]);

  /////////////////////////////////
  // -*- PHILIPPINE MARKET INSTANCE -*-
  /////////////////////////////////
  useEffect(() => {
    const docRef = doc(phInstance, today);

    getDoc(docRef).then((doc) => {
      const data = doc.data();
      setDocId(doc.id);
      const items = [];

      data &&
        data.items.forEach((element) => {
          items.push(element);
        });

      const headlines = items.map((item) => {
        return item["headlines"];
      });

      const report = headlines.join(", ");
      setPhData(report);
    });

    return () => {
      docRef;
    };
  }, []);

  useEffect(() => {
    if (organizedFinal) Organizer(phData, setOrganizedPh);
  }, [organizedFinal]);

  ///////////////////////////////////////

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener("resize", handleResize);

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
        <Panel icon="🌎" title="GLOBAL MARKETS" color={COLORS.blue700}>
          <Container style={{ alignItems: "center" }}>
            <CardSection
              title={`World News`}
              text={organizedGlobal}
              color={COLORS.blue800}
              fullReport={globalData}
              date={docId}
            />
            <Spacer y={2} />
            <CardSection
              title={`Geopolitics`}
              text={organizedGeopolitics}
              color={COLORS.blue800}
              date={docId}
              fullReport={geopoliticsData}
            />
            <Spacer y={2} />
            <CardSection
              title={`Final Report - Global`}
              text={organizedFinal}
              color={COLORS.blue800}
              date={docId}
              fullReport={`${globalData} ${geopoliticsData}`}
            />
          </Container>
        </Panel>

        <Panel icon="🇵🇭" title="THE PHILIPPINES" color={"black"}>
          <Container style={{ alignItems: "center" }}>
            <CardSection
              title={`Market Summary`}
              text={organizedPh}
              color={COLORS.blue800}
              date={docId}
              fullReport={phData}
            />
          </Container>
        </Panel>
      </div>
    </NextUIProvider>
  );
};

export default Main;
