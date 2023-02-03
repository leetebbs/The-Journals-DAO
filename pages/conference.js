import styles from '../styles/all.module.scss'
import { HuddleIframe } from "@huddle01/huddle01-iframe";
let count = 0;
const Conference = () => {
let count =  count +1;
console.log(count)
  const iframeConfig = {
    roomUrl: "https://iframe.huddle01.com/anyvalue",
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