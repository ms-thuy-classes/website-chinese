export function validatePost(post) {
  const required = ['id', 'slug', 'title', 'section', 'layout']
  const missing = required.filter(field => !post[field])
  
  if (missing.length > 0) {
    return {
      valid: false,
      error: `Missing required fields: ${missing.join(', ')}`
    }
  }
  
  const validLayouts = ['lesson', 'test', 'listening', 'reading']
  if (!validLayouts.includes(post.layout)) {
    return {
      valid: false,
      error: `Invalid layout: ${post.layout}`
    }
  }
  
  return { valid: true }
}

export function validateArticle(article) {
  const required = ['id', 'slug', 'title', 'section', 'file']
  const missing = required.filter(field => !article[field])
  
  return {
    valid: missing.length === 0,
    error: missing.length > 0 ? `Missing: ${missing.join(', ')}` : null
  }
}
