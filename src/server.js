import sirv from 'sirv';
import polka from 'polka';
import compression from 'compression';
import * as sapper from '@sapper/server';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';
import { authPath, refreshPath, protectedPaths } from "./OIDCConfig"; // The file we just created
import { SapperOIDCClient } from "sapper-oidc/lib/server";

(async function () {
  const options = {
    issuerURL: "https://accounts.google.com/", // See your identity provider documentation
    clientID: "8db8f07d-547d-4e8b-8d8b-218fc08b7188",
    clientSecret: "3nxeS5K3mFe.5Hv7Gvjp6xUWq~",
    redirectURI: "http://127.0.0.1:3000/cb", // This is the URL the idp will redirect the user to. It must be the callback route that you will define bellow; you must add this url to your IDP authorized redirect URI.
    silentRedirectURI: "http://localhost:3001/silentcb", // (OPTIONAL) This is the callback URL if you want to silently login the user, you must add this URL to your IDP authorized redirect URI if you add this line.
    sessionMaxAge: 60 * 60 * 24 * 7, // How long does a user's session lives for (in seconds)
    authRequestMaxAge: 60 * 60, // How much time before an auth request is deemed invalid (in seconds).
    authPath,
    refreshPath,
    protectedPaths,
    /* Where do you want the user to be redirected to upon successful auth
      Except if you set at the callback route to redirect the user back to
      where he was before */
    authSuccessfulRedirectPath: "http://127.0.0.1:3000/",
    callbackPath: "/cb", // The route of the callback
    silentCallbackPath: "/silentcb", // (OPTIONAL) The route of the silent callback, adds this line only if you have added 'silentRedirectURI' and as I already said, the paths MUST match.
    scope: "openid profile offline_access", // You must have at least openid and offline_access
    // redisURL: "", // The URL of the Redis server. Format: [redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]] (More info avaliable at IANA).
    // It default to: 127.0.0.1:6379 with no password
  };
  const client = new SapperOIDCClient(options);
  await client.init(); // Don't forget it 🚦

  polka()
    .use(await client.middleware()) // Don't forget that 🚦
    .use(
      compression({ threshold: 0 }),
      sirv("static", { dev }),
      sapper.middleware({
        session: (req, res) => ({
          // And finally 🚦
          user: req.user,
        }),
      })
    )
    .listen(PORT, (err) => {
      if (err) console.log("error", err);
    });
})();