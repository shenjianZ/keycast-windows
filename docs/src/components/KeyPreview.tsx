import * as React from 'react'

interface KeyPreviewProps {
  keys: string[]
  mode?: 'combo' | 'single' | 'sequential'
  theme?: 'light' | 'dark'
  size?: 'sm' | 'md' | 'lg'
}

export function KeyPreview({ keys, mode = 'combo', theme = 'dark', size = 'md' }: KeyPreviewProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    if (theme === 'auto') {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
      const observer = new MutationObserver(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'))
      })
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      })
      return () => observer.disconnect()
    } else {
      setIsDarkMode(theme === 'dark')
    }
  }, [theme])

  const sizeStyles = {
    sm: { padding: '0.25rem 0.5rem', fontSize: '0.75rem', gap: '0.25rem' },
    md: { padding: '0.375rem 0.625rem', fontSize: '0.875rem', gap: '0.375rem' },
    lg: { padding: '0.5rem 0.75rem', fontSize: '1rem', gap: '0.5rem' }
  }

  const keyCapStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '2rem',
    height: '2rem',
    padding: '0 0.5rem',
    borderRadius: '0.375rem',
    fontWeight: '500',
    boxShadow: isDarkMode
      ? '0 2px 0 rgba(0, 0, 0, 0.5)'
      : '0 2px 0 rgba(0, 0, 0, 0.1)',
    border: isDarkMode
      ? '1px solid rgba(255, 255, 255, 0.1)'
      : '1px solid rgba(0, 0, 0, 0.1)',
    backgroundColor: isDarkMode ? '#2d2d2d' : '#ffffff',
    color: isDarkMode ? '#e5e5e5' : '#1a1a1a',
    ...sizeStyles[size]
  }

  const plusStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1rem',
    height: '2rem',
    color: isDarkMode ? '#a3a3a3' : '#737373',
    fontSize: size === 'sm' ? '0.75rem' : size === 'lg' ? '1rem' : '0.875rem'
  }

  const renderKeys = () => {
    if (mode === 'combo') {
      // 组合键模式：用 + 连接
      return keys.map((key, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span style={plusStyle}>+</span>}
          <span style={keyCapStyles}>{key}</span>
        </React.Fragment>
      ))
    } else if (mode === 'sequential') {
      // 连续模式：直接排列，用空格分隔
      return keys.map((key, index) => (
        <span key={index} style={{ ...keyCapStyles, marginLeft: index > 0 ? '0.5rem' : 0 }}>
          {key}
        </span>
      ))
    } else {
      // 单个模式：只显示第一个
      return <span style={keyCapStyles}>{keys[0]}</span>
    }
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        padding: '1rem',
        borderRadius: '0.5rem',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
        border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
        margin: '0.5rem 0'
      }}
    >
      {renderKeys()}
    </div>
  )
}
