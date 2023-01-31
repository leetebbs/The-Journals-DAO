import styles from '../styles/all.module.scss'
import { HuddleIframe } from "@huddle01/huddle01-iframe";

const Conference = () => {

  const iframeConfig = {
    roomUrl: "https://iframe.huddle01.com/123",
    height: "100%",
    width: "100%",
    noBorder: true, // false by default
  };

  return (
    <div className={styles.dashboard}>
      <HuddleIframe config={iframeConfig} />
    </div>
  )
}

export default Conference