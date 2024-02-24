export interface game {
  id: number
  start_time: number
  end_time: number
  created_at: number
}

export interface gameCard {
  id: number
  color: string
  symbol: string
  shading: string
  formatted_number: number
}

export interface RoomPlayer {
  id: number
  email: string
}

export interface Player {
  id: number
  email: string
  score?: number
}