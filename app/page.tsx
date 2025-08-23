'use client'

import { Button, Text, makeStyles, tokens } from '@fluentui/react-components'
import Link from 'next/link'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: tokens.spacingVerticalXXL,
    backgroundColor: tokens.colorNeutralBackground1,
  },
  hero: {
    textAlign: 'center',
    maxWidth: '800px',
  },
  title: {
    fontSize: tokens.fontSizeBase700,
    fontWeight: tokens.fontWeightBold,
    marginBottom: tokens.spacingVerticalL,
    background: `linear-gradient(135deg, ${tokens.colorBrandBackground} 0%, ${tokens.colorBrandBackground2} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    fontSize: tokens.fontSizeBase500,
    color: tokens.colorNeutralForeground2,
    marginBottom: tokens.spacingVerticalXXL,
  },
  buttonGroup: {
    display: 'flex',
    gap: tokens.spacingHorizontalL,
    justifyContent: 'center',
  },
})

export default function HomePage() {
  const styles = useStyles()

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>WSS Planner</h1>
        <p className={styles.subtitle}>
          Powerful project management and planning for modern teams.
          Streamline your workflow with agile boards, issue tracking, and real-time collaboration.
        </p>
        <div className={styles.buttonGroup}>
          <Link href="/register">
            <Button appearance="primary" size="large">
              Get Started Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="large">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}