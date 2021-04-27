import express from "express";
import AWS from "aws-sdk";

const app = express();
app.use(express.json());

const { PORT = 3000 } = process.env;

const credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
const sns = new AWS.SNS({ credentials: credentials, region: "eu-north-1" });

app.get("/status", (req, res) => res.json({ status: "ok", sns: sns }));

export const convertRequestToSnsParams = (request: any) => {
  let params = {
    Message: request.body.message,
    MessageAttributes: {
      ID: {
        DataType: "number",
        StringValue: request.body.id,
      },
      Name: {
        DataType: "string",
        StringValue: request.body.name,
      },
      Color: {
        DataType: "string",
        StringValue: request.body.color,
      },
    },
  };

  return params;
};

app.post("/sendMessage", async (req, res) => {
  const params = convertRequestToSnsParams(req);

  const request: AWS.SNS.PublishInput = {
    ...params,
    TopicArn: "arn:aws:sns:eu-north-1:286643423608:vs-prto-test-topic",
  };

  sns.publish(request, function (error, data) {
    if (error) {
      console.log(error);
      return res.status(400).send(error.message);
    } else {
      console.log(data);
      return res.send(data);
    }
  });
});

if (require.main === module) {
  // true if file is executed
  app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
  });
}

export default app;
