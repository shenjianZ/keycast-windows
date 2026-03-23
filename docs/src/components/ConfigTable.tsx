import * as React from 'react'

export interface ConfigItem {
  name: string
  description: string
  default: string
  range?: string
  type?: 'string' | 'number' | 'boolean' | 'select'
}

interface ConfigTableProps {
  items: ConfigItem[]
}

export function ConfigTable({ items }: ConfigTableProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    return () => observer.disconnect()
  }, [])

  const tableStyles: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    margin: '1rem 0',
    fontSize: '0.875rem',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`
  }

  const thStyles: React.CSSProperties = {
    padding: '0.75rem 1rem',
    textAlign: 'left',
    fontWeight: '600',
    backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
    borderBottom: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
    color: isDarkMode ? '#e5e5e5' : '#1a1a1a'
  }

  const tdStyles: React.CSSProperties = {
    padding: '0.75rem 1rem',
    borderBottom: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
    color: isDarkMode ? '#a3a3a3' : '#737373'
  }

  const codeStyles: React.CSSProperties = {
    backgroundColor: isDarkMode ? '#3d3d3d' : '#f5f5f5',
    padding: '0.125rem 0.375rem',
    borderRadius: '0.25rem',
    fontFamily: 'Fragment Mono, monospace',
    fontSize: '0.875rem',
    color: isDarkMode ? '#e5e5e5' : '#1a1a1a'
  }

  return (
    <table style={tableStyles}>
      <thead>
        <tr>
          <th style={thStyles}>参数</th>
          <th style={thStyles}>说明</th>
          <th style={thStyles}>默认值</th>
          {items.some(item => item.range) && (
            <th style={thStyles}>推荐范围</th>
          )}
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={index}>
            <td style={{ ...tdStyles, fontWeight: '500' }}>
              <code style={codeStyles}>{item.name}</code>
            </td>
            <td style={tdStyles}>{item.description}</td>
            <td style={tdStyles}>
              <code style={codeStyles}>{item.default}</code>
            </td>
            {item.range && (
              <td style={tdStyles}>
                <code style={codeStyles}>{item.range}</code>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
