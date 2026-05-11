export async function trackInteraction(type: string, target: string, path = '/') {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, target, path }),
    });
  } catch {
    // silent fail
  }
}

export async function trackPageVisit(path: string) {
  try {
    await fetch('/api/analytics/visit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path }),
    });
  } catch {
    // silent fail
  }
}
