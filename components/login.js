import React from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import styles from '../styles/all.module.scss'

const Login = () => {
  return (
    <div>
        <ConnectButton className={styles.connectButton} accountStatus="address" showBalance={false}/>
    </div>
  )
}

export default Login