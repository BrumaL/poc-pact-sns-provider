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
      id: 1231,
      name: "Polestar 2",
    },
  };

  const baseOptions: Partial<PactMessageProviderOptions> = {
    logLevel: "info",
    provider: "MartinsMessageProvider",
    pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
    pactBrokerToken: process.env.PACT_BROKER_TOKEN,
    providerVersion:
      process.env.CI == "true" && process.env.PACTICIPANT_VERSION,
    providerVersionTags: process.env.GIT_BRANCH ? [process.env.GIT_BRANCH] : [],
    publishVerificationResult: process.env.CI == "true",
  };

  const pactChangedOptions: Partial<PactMessageProviderOptions> = {
    pactUrls: [process.env.pactUrl],
  };

  const dynamicPactoptions: Partial<PactMessageProviderOptions> = {
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
    ],
    enablePending: true,
  };

  const messageProviders: PactMessageProviderOptions["messageProviders"] = {
    "create product event": () =>
      Promise.resolve(convertRequestToSnsParams(request)),
  };

  const options: PactMessageProviderOptions = {
    ...baseOptions,
    ...(process.env.pactUrl ? pactChangedOptions : dynamicPactoptions),
    messageProviders,
  };

  it(
    "sent a create product message",
    async () => {
      const messageProvider = new MessageProviderPact(options);
      await expect(messageProvider.verify()).resolves.not.toThrow();
    },
    testTimeout
  );
});
