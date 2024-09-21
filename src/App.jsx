import { Box, Button, Container, Flex, Input } from "@chakra-ui/react";
import { useState } from "react";
import { read, utils } from "xlsx";
import ResultTable from "./Table";
import "./app.css";
import { mkConfig, generateCsv, download } from "export-to-csv";
// import excelToJson from "convert-excel-to-json";
// import parser from "simple-excel-to-json";

const AGENT = {
  NAME: "Agent Name",
  ORDERS: "Total Orders",
  CONFIRM: "Confirm Orders",
  CANCELLED: "Cancelled Orders",
  P_CONFIRM: "% Confirm",
  P_CANCELLED: "% Cancelled",
};

export default function App() {
  // const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const csvConfig = mkConfig({ useKeysAsHeaders: true });

  async function handleFile(e) {
    setLoading(true);
    const f = await e.target.files[0].arrayBuffer();
    const wb = read(f);
    const ws = wb.Sheets[wb.SheetNames[0]];
    const sheetData = utils.sheet_to_json(ws);
    // setData(sheetData);
    const agents = [];
    console.log(sheetData);
    sheetData.forEach((order) => {
      console.log(order);
      let i = agents.findIndex(
        (a) => a[AGENT.NAME].trim() === order["AGENT NAME"].trim()
      );
      if (i !== -1) {
        agents[i][AGENT.ORDERS] += parseInt(order["QUNTITY"]);
        if (order.STATUS === "DELIVERED")
          agents[i][AGENT.CONFIRM] += parseInt(order["QUNTITY"]);
        else agents[i][AGENT.CANCELLED] += parseInt(order["QUNTITY"]);
        agents[i][AGENT.P_CONFIRM] =
          Math.round(
            (agents[i][AGENT.CONFIRM] / agents[i][AGENT.ORDERS]) * 100
          ) + "%";
        agents[i][AGENT.P_CANCELLED] =
          Math.round(
            (agents[i][AGENT.CANCELLED] / agents[i][AGENT.ORDERS]) * 100
          ) + "%";
      } else {
        agents.push({
          [AGENT.NAME]: order["AGENT NAME"],
          [AGENT.ORDERS]: parseInt(order["QUNTITY"]),
          [AGENT.CONFIRM]:
            order.STATUS === "DELIVERED" ? parseInt(order["QUNTITY"]) : 0,
          [AGENT.CANCELLED]:
            order.STATUS === "DELIVERED" ? 0 : parseInt(order["QUNTITY"]),
          [AGENT.P_CONFIRM]: "0%",
          [AGENT.P_CANCELLED]: "0%",
        });
      }
    });
    agents.sort((a, b) => b[AGENT.CONFIRM] - a[AGENT.CONFIRM]);
    const TotalOrders = agents.reduce((acc, e) => (acc += e[AGENT.ORDERS]), 0);
    const TotalConfirm = agents.reduce(
      (acc, e) => (acc += e[AGENT.CONFIRM]),
      0
    );
    const TotalCancelled = agents.reduce(
      (acc, e) => (acc += e[AGENT.CANCELLED]),
      0
    );
    agents.push({
      [AGENT.NAME]: "Total",
      [AGENT.ORDERS]: TotalOrders,
      [AGENT.CONFIRM]: TotalConfirm,
      [AGENT.CANCELLED]: TotalCancelled,
      [AGENT.P_CONFIRM]: Math.round((TotalConfirm / TotalOrders) * 100) + "%",
      [AGENT.P_CANCELLED]:
        Math.round(100 - (TotalConfirm / TotalOrders) * 100) + "%",
    });
    setResult(agents);
    setLoading(false);
  }

  return (
    <Box p={5} minH={"100vh"} bg={"teal.100"}>
      <Container maxW={"container.lg"}>
        <Flex justifyContent={"space-between"} mb={3}>
          <Input
            className="no-print"
            type="file"
            onChange={(e) => handleFile(e)}
            border={" 1px solid "}
            borderColor={"teal.500"}
            w={"max-content"}
          />
          {result && (
            <div className="no-print">
              <Button
                colorScheme="teal"
                variant={"outline"}
                onClick={() => {
                  const csv = generateCsv(csvConfig)(result);
                  download(csvConfig)(csv);
                }}
              >
                🔽download csv
              </Button>
            </div>
          )}
        </Flex>
        {loading && "loading..."}
        {result && <ResultTable data={result} />}
      </Container>
    </Box>
  );
}
