import {
  MessageProviderPact,
  PactMessageProviderOptions,
} from "@pact-foundation/pact";
import dotenv from "dotenv";
dotenv.config();

import { convertRequestToSnsParams } from "../src/index";

const testTimeout = 20000;

describe("provider of sns message", () => {
  const request = {
    body: {
      message: "A simple message",
      country: "USA",
      region: "North America",
    },
  };

  console.log("process env: ", process.env.PACT_BROKER_BASE_URL);
  console.log("process env ci: ", process.env.CI);
  console.log("process env git branch: ", process.env.GIT_BRANCH);

  const options: PactMessageProviderOptions = {
    messageProviders: {
      "create country event": () =>
        Promise.resolve(convertRequestToSnsParams(request)),
    },
    logLevel: "info",
    provider: "MartinsMessageProvider",
    pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    consumerVersionSelectors: [
      {
        tag: "master",
        latest: true,
      },
      {
        tag: process.env.CONSUMER_BRANCH,
        latest: true,
      },
    ],
    providerVersion: process.env.CI == "true" && process.env.CI_VERSION,
    providerVersionTags: process.env.GIT_BRANCH ? [process.env.GIT_BRANCH] : [],
    publishVerificationResult: true,
  };

  it(
    "sent a message",
    async () => {
      const messageProvider = new MessageProviderPact(options);
      await expect(messageProvider.verify()).resolves.not.toThrow();
    },
    testTimeout
  );
});
