import { Flex } from "@chakra-ui/react";
import { v4 as uuidv4 } from "uuid";

export default function ResultTable(data) {
  console.log(data.data);
  //   const ParsedData = JSON.parse(data);
  //   const THEAD = Object.keys(ParsedData[0]);
  const THead = Object.keys(data.data[0]);
  //   const TRow = data.data.filter(() => true);
  //   console.log();

  return (
    <Flex justifyContent={"center"}>
      <table
        style={{ border: "1px solid", padding: "1rem" }}
        //   size={"sm"}
        //   border={"solid 1px"}
        //   variant="simple"
        //   colorScheme="teal"
        //   w={"40rem"}
      >
        <thead>
          <tr style={{ border: "1px solid", padding: "1rem" }}>
            <th
              style={{
                maxWidth: "130px",
                border: "1px solid",
                padding: "10px",
              }}
            >
              Sl. no.
            </th>
            {THead.map((e) => (
              <th
                style={{
                  maxWidth: "130px",
                  border: "1px solid",
                  padding: "10px",
                }}
                key={uuidv4()}
              >
                {e}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.data.map((e, i) => (
            <tr
              style={{
                border: "1px solid",
                padding: "2px",
                textAlign: "center",
              }}
              key={uuidv4()}
            >
              <td>{i + 1}</td>
              {THead.map((head) => (
                <td
                  style={{
                    border: "1px solid",
                    padding: "2px",
                    width: "120px",
                    textAlign: "center",
                  }}
                  key={uuidv4()}
                >
                  {e[head]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Flex>
  );
}
