"use client";

import { Component, type ReactNode } from "react";

interface ScriptErrorBoundaryProps {
  children: ReactNode;
}

interface ScriptErrorBoundaryState {
  hasError: boolean;
}

export class ScriptErrorBoundary extends Component<
  ScriptErrorBoundaryProps,
  ScriptErrorBoundaryState
> {
  constructor(props: ScriptErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ScriptErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(
      "[ScriptErrorBoundary] Isolated script rendering error:",
      error.message,
      errorInfo.componentStack
    );
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}