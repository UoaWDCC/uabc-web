"use client"
import React from "react"

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback: React.ReactNode
}

/**
 * Interface for the state of the ErrorBoundary component.
 */
interface ErrorBoundaryState {
  hasError: boolean
}

/**
 * ErrorBoundary component to catch JavaScript errors in its child component tree,
 *
 * @param children The child components to render when an error does not occur.
 * @param fallback The fallback UI to render when an error occurs.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  override render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback
    }

    return this.props.children
  }
}
