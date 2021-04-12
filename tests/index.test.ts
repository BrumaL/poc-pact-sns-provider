import {
  MessageProviderPact,
  PactMessageProviderOptions,
} from "@pact-foundation/pact";
import { versionFromGitTag } from "@pact-foundation/absolute-version";

import { convertRequestToSnsParams } from "../src/index";

const providerVersion = versionFromGitTag();
const testTimeout = 20000;

describe("provider of sns message", () => {
  const request = {
    body: {
      message: "A simple message",
      country: "USA",
      region: "North America",
    },
  };

  const options: PactMessageProviderOptions = {
    messageProviders: {
      "create country event": () =>
        Promise.resolve(convertRequestToSnsParams(request)),
    },
    provider: "MartinsMessageProvider",
    providerVersion,
    // Fetch pacts from broker
    pactBrokerUrl: "https://meklund.pactflow.io/",
    pactBrokerToken: "oqC6W6RnlmMgp-NhQfapBw",
    // Fetch from broker with given tags
    consumerVersionTags: ["master"],
    // Tag provider with given tags
    providerVersionTags: ["master"],
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
