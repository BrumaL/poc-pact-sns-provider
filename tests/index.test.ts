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
  // .
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
        tag: "dev",
        latest: true,
      },
      {
        tag: "staging",
        latest: true,
      },
      {
        tag: "master",
        latest: true,
      },
    ],
    providerVersion:
      process.env.CI == "true" && process.env.PACTICIPANT_VERSION,
    providerVersionTags: process.env.GIT_BRANCH ? [process.env.GIT_BRANCH] : [],
    publishVerificationResult: process.env.CI == "true",
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
