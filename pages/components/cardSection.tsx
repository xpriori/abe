import { poppins } from "../../constants/fonts";
import {
  Button,
  Card,
  Input,
  Loading,
  Row,
  Spacer,
  Text,
} from "@nextui-org/react";
import { GrSend } from "react-icons/gr";
import { MdPlayArrow, MdOutlineSummarize, MdClear } from "react-icons/md";
import styles from "./cardSection.module.css";
import { useRef, useState } from "react";

import Bubble from "./bubble";

const CardSection = ({ ...props }) => {
  const { title, text, color, fullReport } = props;
  const [toggle, setToggle] = useState(false);
  const [summary, setSummary] = useState<any>();
  const [geop, setGeop] = useState<any>();
  const [query, setQuery] = useState([]);

  const inputRef = useRef<any>();

  async function SummarizeHere(text: string) {
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      setSummary(data.result);
    } catch (error) {
      return error;
    }
  }

  const handleToggle = () => {
    setToggle((state) => !state);
    if (!summary) SummarizeHere(text && text);
  };

  const handleHumanQuerySubmit = (item: string) => {
    const newItem = {
      id: query.length + 1,
      text: item,
      type: "human",
      createdAt: new Date().toLocaleDateString(),
    };
    if (item !== "") setQuery((state) => [...state, newItem]);

    processQuery(fullReport, item);
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    handleHumanQuerySubmit(event.currentTarget.value);
  };

  const processQuery = async (source: string, text: string) => {
    try {
      const response = await fetch("/api/processQuery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ source, text }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      handleAIQuerySubmit(data.result);
    } catch (error) {
      return error;
    }
  };

  const handleAIQuerySubmit = (item: string) => {
    const newItem = {
      id: query.length + 1,
      text: item,
      type: "ai",
      createdAt: new Date().toLocaleDateString(),
    };
    if (item !== "") setQuery((state) => [...state, newItem]);
  };

  return (
    <>
      <Card variant="bordered" className={styles.card}>
        <Card.Header className={styles.header}>
          <Text b color={props.color} className={poppins.className}>
            {title}
          </Text>
        </Card.Header>
        <Card.Divider />
        <Card.Body>
          <Row justify="center" align="center">
            {text ? (
              <Text className={styles.content}>{text}</Text>
            ) : (
              <Loading color="default" size="sm" />
            )}
          </Row>
          {text ? (
            <Button
              onPress={handleToggle}
              size="sm"
              flat
              rounded
              auto
              style={{
                width: 100,
                color: "#004799",
                fontSize: 10,
                marginTop: 20,
                marginBottom: 20,
                borderRadius: 10,
              }}
              iconRight={<MdOutlineSummarize fill="#004799" size={12} />}
            >
              {!summary && toggle ? (
                <Loading type="points-opacity" color="currentColor" size="sm" />
              ) : toggle ? (
                "HIDE SUMMARY"
              ) : (
                "SUMMARIZE REPORT"
              )}
            </Button>
          ) : null}

          {toggle ? (
            <Row justify="center" align="center" className={styles.summary}>
              <Text className={styles.summaryText}>{summary || null}</Text>
            </Row>
          ) : null}

          <Spacer y={1} />

          {/* QUERY */}
          {query.length ? <Card.Divider className={styles.divider} /> : null}
          {query.length ? (
            <div className={styles.queryMain}>
              <div className={styles.querySubmain}>
                <MdPlayArrow size={14} fill={"gray"} />
                <Text size={10} color={"gray"} className={styles.hSpacer}>
                  Begin Query
                </Text>
                <div className={styles.hSpacer}></div>
                <Button
                  color="warning"
                  flat
                  size="xs"
                  iconRight={<MdClear size={10} color="error" />}
                  onPress={() => setQuery([])}
                >
                  <Text className={styles.clear_button}>clear all</Text>
                </Button>
              </div>
              <ul className={styles.query_container}>
                {query.map((item) => {
                  return (
                    <Bubble
                      key={item.createdAt}
                      id={item.id}
                      text={item.text}
                      type={item.type}
                    />
                  );
                })}
              </ul>
            </div>
          ) : null}
        </Card.Body>
        <Card.Divider
          style={{
            borderColor: "#fff",
            backgroundColor: "#eee",
            borderWidth: "0.5px",
          }}
        />
        {text ? (
          <Card.Footer>
            <Row justify="flex-end" className={styles.footer}>
              <Input
                className={`${styles.queryInput} ${poppins.className}`}
                size="lg"
                placeholder="Type your query here..."
                id="query-input-box"
                aria-label="query-input-box"
                ref={inputRef}
                type="text"
                onKeyUp={(event: React.KeyboardEvent<HTMLInputElement>) => {
                  if (event.key === "Enter") {
                    handleKeyUp(event);
                    inputRef.current.value = "";
                  }
                }}
              />

              <Button
                size="md"
                auto
                color="primary"
                rounded
                flat
                className={styles.queryButton}
                onPress={() => {
                  handleHumanQuerySubmit(inputRef.current?.value);
                  inputRef.current.value = "";
                }}
              >
                <GrSend size={20} color={color} />
              </Button>
            </Row>
          </Card.Footer>
        ) : null}
      </Card>
      <Spacer y={2} />
    </>
  );
};

export default CardSection;
