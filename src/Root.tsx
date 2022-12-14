/* eslint-disable global-require */
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { StyledEngineProvider } from "@mui/material/styles";
import { FC, useEffect } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import App from "src/App";
import { wagmiClient } from "src/hooks/wagmi";
import { ReactQueryProvider } from "src/lib/react-query";
import { initLocale } from "src/locales";
import store from "src/store";
import { WagmiConfig } from "wagmi";

const Root: FC = () => {
  useEffect(() => {
    initLocale();
  }, []);

  return (
    <WagmiConfig client={wagmiClient}>
      <ReactQueryProvider>
        <Provider store={store}>
          <I18nProvider i18n={i18n}>
            <HashRouter>
              <StyledEngineProvider injectFirst>
                <App />
              </StyledEngineProvider>
            </HashRouter>
          </I18nProvider>
        </Provider>
      </ReactQueryProvider>
    </WagmiConfig>
  );
};

export default Root;
