import { MetaMaskSDK } from "@metamask/sdk";
import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";

export default function Metamask() {
  const options = {
    injectProvider: false,
    communicationLayerPreference: "webrtc",
    preferDesktop: true,
  };

  const [details, setDetails] = useState({});

  const MMSDK = new MetaMaskSDK(options);

  //   const ethereum = MMSDK.getProvider();
  async function detect() {
    const provider = await detectEthereumProvider();
    if (provider) {
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      window.ethereum
        .request({ method: "eth_requestAccounts", params: [] })
        .then((res) => {
          setDetails({ chainId, account: res });
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(chainId);

      window.ethereum.on("chainChanged", handleChainChanged);

      function handleChainChanged(chainId) {
        // We recommend reloading the page, unless you must do otherwise.
        window.location.reload();
      }
    }
  }
  useEffect(() => {
    detect();
  }, []);
  console.log(details);
  return (
    <div>
      <h3>Chain Id: {details?.chainId || ""}</h3>
      {details?.account?.map((item, i) => {
        return (
          <p key={i}>
            Account{i + 1}: {item}
          </p>
        );
      })}
    </div>
  );
}
