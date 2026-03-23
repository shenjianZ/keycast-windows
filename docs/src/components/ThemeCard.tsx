import * as React from 'react'

interface ThemeCardProps {
  name: string
  description: string
  preview?: string
  tags?: string[]
  onClick?: () => void
}

export function ThemeCard({ name, description, preview, tags = [], onClick }: ThemeCardProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

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

  const cardStyles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    padding: '1.25rem',
    borderRadius: '0.75rem',
    backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
    border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`,
    cursor: onClick ? 'pointer' : 'default',
    transition: 'all 0.2s ease',
    boxShadow: isHovered && onClick
      ? isDarkMode
        ? '0 8px 16px rgba(0, 0, 0, 0.4)'
        : '0 8px 16px rgba(0, 0, 0, 0.1)'
      : isDarkMode
        ? '0 2px 4px rgba(0, 0, 0, 0.2)'
        : '0 2px 4px rgba(0, 0, 0, 0.05)',
    transform: isHovered && onClick ? 'translateY(-2px)' : 'translateY(0)',
    height: '100%'
  }

  const previewStyles: React.CSSProperties = {
    width: '100%',
    height: '120px',
    borderRadius: '0.5rem',
    backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
    marginBottom: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    border: `1px solid ${isDarkMode ? '#333' : '#e5e5e5'}`
  }

  const nameStyles: React.CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    color: isDarkMode ? '#e5e5e5' : '#1a1a1a'
  }

  const descriptionStyles: React.CSSProperties = {
    fontSize: '0.875rem',
    color: isDarkMode ? '#a3a3a3' : '#737373',
    marginBottom: '1rem',
    lineHeight: '1.5'
  }

  const tagContainerStyles: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginTop: 'auto'
  }

  const tagStyles: React.CSSProperties = {
    display: 'inline-block',
    padding: '0.25rem 0.625rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '500',
    backgroundColor: isDarkMode ? '#3d3d3d' : '#f5f5f5',
    color: isDarkMode ? '#e5e5e5' : '#1a1a1a',
    border: `1px solid ${isDarkMode ? '#4d4d4d' : '#e5e5e5'}`
  }

  const getTagColor = (tag: string) => {
    const tagLower = tag.toLowerCase()
    if (tagLower.includes('推荐') || tagLower === 'recommended') {
      return {
        backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
        color: isDarkMode ? '#86efac' : '#16a34a',
        borderColor: isDarkMode ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.2)'
      }
    }
    if (tagLower.includes('深色') || tagLower === 'dark') {
      return {
        backgroundColor: isDarkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)',
        color: isDarkMode ? '#93c5fd' : '#2563eb',
        borderColor: isDarkMode ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.2)'
      }
    }
    if (tagLower.includes('浅色') || tagLower === 'light') {
      return {
        backgroundColor: isDarkMode ? 'rgba(251, 191, 36, 0.2)' : 'rgba(251, 191, 36, 0.1)',
        color: isDarkMode ? '#fcd34d' : '#d97706',
        borderColor: isDarkMode ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.2)'
      }
    }
    return tagStyles
  }

  return (
    <div
      style={cardStyles}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {preview ? (
        <div style={previewStyles}>
          <img
            src={preview}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      ) : (
        <div style={previewStyles}>
          <span style={{ color: isDarkMode ? '#737373' : '#a3a3a3', fontSize: '0.875rem' }}>
            主题预览
          </span>
        </div>
      )}
      <h3 style={nameStyles}>{name}</h3>
      <p style={descriptionStyles}>{description}</p>
      {tags.length > 0 && (
        <div style={tagContainerStyles}>
          {tags.map((tag, index) => (
            <span key={index} style={{ ...tagStyles, ...getTagColor(tag) }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
