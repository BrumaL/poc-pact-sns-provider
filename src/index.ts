import express from "express";
import AWS, { AWSError } from "aws-sdk";

const app = express();
app.use(express.json());

const { PORT = 3000 } = process.env;

const credentials = new AWS.SharedIniFileCredentials({ profile: "default" });
const sns = new AWS.SNS({ credentials: credentials, region: "eu-north-1" });

app.get("/status", (req, res) => res.json({ status: "ok", sns: sns }));

export const sendMessage = async (params: AWS.SNS.PublishInput) => {
  let response: AWS.AWSError | AWS.SNS.PublishResponse;
  sns.publish(params, function (error, data) {
    if (error) {
      console.log(error);
      response = error;
    } else {
      console.log(data);
      response = data;
    }
  });

  return response;
};

app.post("/sendMessage", (req, res) => {
  let params: AWS.SNS.PublishInput = {
    Message: req.body.message,
    TopicArn: "arn:aws:sns:eu-north-1:286643423608:vs-prto-test-topic",
    MessageAttributes: {
      Country: {
        DataType: "String",
        StringValue: req.body.country,
      },
      Region: {
        DataType: "String",
        StringValue: req.body.region,
      },
    },
  };

  const response = sendMessage(params);

  console.log("response: ", response);

  return res.send(response);
});

if (require.main === module) {
  // true if file is executed
  app.listen(PORT, () => {
    console.log("server started at http://localhost:" + PORT);
  });
}

export default app;
