'use client'

import { useState } from 'react'
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
import { PersonRegular, LockClosedRegular, MailRegular } from '@fluentui/react-icons'

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
  divider: {
    marginTop: tokens.spacingVerticalL,
    marginBottom: tokens.spacingVerticalL,
  },
})

export default function RegisterPage() {
  const styles = useStyles()
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Registration failed')
      } else {
        router.push('/login?registered=true')
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
              <Text className={styles.title}>Create an Account</Text>
              <Text>Join WSS Planner today</Text>
            </div>
          }
        />

        {error && (
          <MessageBar intent="error">
            <MessageBarBody>{error}</MessageBarBody>
          </MessageBar>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <Field label="Full Name" required>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              contentBefore={<PersonRegular />}
              placeholder="Enter your full name"
              required
            />
          </Field>

          <Field label="Email" required>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              contentBefore={<MailRegular />}
              placeholder="Enter your email"
              required
            />
          </Field>

          <Field label="Password" required>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              contentBefore={<LockClosedRegular />}
              placeholder="Create a password"
              required
            />
          </Field>

          <Field label="Confirm Password" required>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              contentBefore={<LockClosedRegular />}
              placeholder="Confirm your password"
              required
            />
          </Field>

          <Button
            appearance="primary"
            type="submit"
            disabled={loading}
            size="large"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <Divider className={styles.divider} />

        <Text align="center">
          Already have an account?{' '}
          <Link href="/login">Sign in</Link>
        </Text>
      </Card>
    </div>
  )
}