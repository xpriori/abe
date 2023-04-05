import { Container, Grid, Text, Spacer } from "@nextui-org/react";
import { ReactElement } from "react";
import { FaGlobeAmericas } from "react-icons/fa";

type PanelPropTypes = {
  title: {
    text: string;
    styles: string;
  };
  color: string;

  children: ReactElement;
};

export default function Panel({ title, color, children }: PanelPropTypes) {
  const Title = () => {
    return (
      <Container
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <FaGlobeAmericas fill={color} size={12} />
        <Text color={color} css={{ mt: 0 }} className={`${title.styles}`}>
          {title.text}
        </Text>
      </Container>
    );
  };

  return (
    <div style={{}}>
      <Spacer y={1} />
      <Title />
      <Spacer y={1} />

      {children}
    </div>
  );
}
