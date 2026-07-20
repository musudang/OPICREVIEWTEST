import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Attempt, ResponseRecord } from './types'

interface OpicDB extends DBSchema {
  attempts: {
    key: string
    value: Attempt
  }
  responses: {
    key: string
    value: ResponseRecord
    indexes: { 'by-attempt': string }
  }
}

let dbPromise: Promise<IDBPDatabase<OpicDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<OpicDB>('opic-practice', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('attempts')) {
          db.createObjectStore('attempts', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('responses')) {
          const store = db.createObjectStore('responses', { keyPath: 'id' })
          store.createIndex('by-attempt', 'attemptId')
        }
      },
    })
  }
  return dbPromise
}

export async function createAttempt(attempt: Attempt) {
  const db = await getDB()
  await db.put('attempts', attempt)
  return attempt
}

export async function updateAttemptStatus(id: string, status: Attempt['status']) {
  const db = await getDB()
  const attempt = await db.get('attempts', id)
  if (!attempt) return
  attempt.status = status
  await db.put('attempts', attempt)
}

export async function listAttempts(): Promise<Attempt[]> {
  const db = await getDB()
  const all = await db.getAll('attempts')
  return all.sort((a, b) => b.startedAt - a.startedAt)
}

export async function saveResponse(response: ResponseRecord) {
  const db = await getDB()
  await db.put('responses', response)
  return response
}

export async function listResponsesByAttempt(attemptId: string): Promise<ResponseRecord[]> {
  const db = await getDB()
  const all = await db.getAllFromIndex('responses', 'by-attempt', attemptId)
  return all.sort((a, b) => a.order - b.order)
}
