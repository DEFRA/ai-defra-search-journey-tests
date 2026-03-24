import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const JOURNEY_TESTS_ROOT = join(__dirname, '..', '..')
const COMPOSE_FILE = join(JOURNEY_TESTS_ROOT, 'compose.yml')

/**
 * Reset WireMock between tests via the admin API.
 *
 * The published bedrock-mock image often exposes something other than raw WireMock on the
 * host-mapped port (e.g. Express in front), so POST /__admin/* from the host can 404 even when
 * WireMock is healthy inside the container. We reset by calling curl inside the service so we hit
 * WireMock on container port 8080 directly.
 *
 * Fallback: HTTP from the test runner to `baseUrl` (e.g. when Docker CLI is unavailable).
 */
export async function resetWireMockState(baseUrl) {
  try {
    execFileSync(
      'docker',
      [
        'compose',
        '-f',
        COMPOSE_FILE,
        'exec',
        '-T',
        'bedrock-mock',
        'sh',
        '-c',
        'curl -sf -X POST http://127.0.0.1:8080/__admin/scenarios/reset || curl -sf -X POST http://127.0.0.1:8080/__admin/reset -H "Content-Type: application/json"'
      ],
      { stdio: 'pipe', encoding: 'utf8' }
    )
  } catch (dockerErr) {
    await resetWireMockStateViaFetch(baseUrl, dockerErr)
  }
}

async function resetWireMockStateViaFetch(baseUrl, dockerErr) {
  const trimmed = baseUrl.replace(/\/$/, '')
  const jsonHeaders = { 'Content-Type': 'application/json' }

  let response = await fetch(`${trimmed}/__admin/scenarios/reset`, {
    method: 'POST'
  })

  if (!response.ok) {
    response = await fetch(`${trimmed}/__admin/reset`, {
      method: 'POST',
      headers: jsonHeaders
    })
  }

  if (!response.ok) {
    const body = await response.text()
    const snippet = body.length > 400 ? `${body.slice(0, 400)}…` : body
    const dockerHint =
      dockerErr instanceof Error
        ? ` Docker exec failed first (${dockerErr.message}).`
        : ''
    throw new Error(
      `Failed to reset WireMock.${dockerHint} HTTP fallback (${response.status}): ${snippet}`
    )
  }
}
