"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css"
import { config, passport } from "@imtbl/sdk"
const passportInstance = new passport.Passport({
  baseConfig: new config.ImmutableConfiguration({
    environment: config.Environment.SANDBOX,
  }),
  clientId: process.env.CLIENT_ID,
  redirectUri: 'http://localhost:5173/',
  logoutRedirectUri: 'http://localhost:5173/me/logout',
  audience: 'platform_api',
  scope: 'openid offline_access email transact'
});
export default function Home() {
  const [test, setTest] = useState(null)
  async function Login() {
    try {
      const passportProvider = await passportInstance.connectImx();
      setTest(passportProvider)
      // const accounts = await passportProvider.request({ method: "eth_requestAccounts" });
      // console.log(accounts)
    }
    catch (err) {
      console.log(err.message)
    }
  }
  return (
    <main className={styles.main}>
      <button onClick={() => Login()}>Login user</button>
    </main>
  )
}
