'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Card,
  CardHeader,
  Input,
  Button,
  Label,
  makeStyles,
  tokens,
  Text,
  Divider,
  MessageBar,
  MessageBarBody,
  Field,
} from '@fluentui/react-components'
import { PersonRegular, LockClosedRegular } from '@fluentui/react-icons'

const useStyles = makeStyles({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: tokens.colorNeutralBackground2,
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    padding: tokens.spacingVerticalXXL,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalL,
  },
  header: {
    textAlign: 'center',
    marginBottom: tokens.spacingVerticalXL,
  },
  title: {
    fontSize: tokens.fontSizeBase600,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
  socialButton: {
    width: '100%',
  },
  divider: {
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalL,
  },
})

export default function LoginPage() {
  const styles = useStyles()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader
          header={
            <div className={styles.header}>
              <Text className={styles.title}>Welcome to WSS Planner</Text>
              <Text>Sign in to your account</Text>
            </div>
          }
        />

        {error && (
          <MessageBar intent="error">
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Email" required>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              contentBefore={<PersonRegular />}
              placeholder="Enter your email"
              required
            />
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              contentBefore={<LockClosedRegular />}
              placeholder="Enter your password"
              required
            />
          </Field>

          <Button
            appearance="primary"
            type="submit"
            disabled={loading}
            size="large"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <Divider className={styles.divider}>OR</Divider>

        <div className={styles.form}>
          <Button
            className={styles.socialButton}
            onClick={() => signIn('google')}
            size="large"
          >
            Continue with Google
          </Button>

          <Button
            className={styles.socialButton}
            onClick={() => signIn('github')}
            size="large"
          >
            Continue with GitHub
          </Button>
        </div>

        <Divider className={styles.divider} />

        <Text align="center">
          Don't have an account?{' '}
          <Link href="/register">Sign up</Link>
        </Text>
      </Card>
    </div>
  )
}