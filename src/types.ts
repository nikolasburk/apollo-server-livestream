export interface Launch {
  id: number
  site?: string
  cursor?: string
  mission?: Mission
  rocket?: Rocket
  isBooked?: Boolean
}

export interface Rocket {
  id: number
  name?: string
  type?: string
}

export interface User {
  id: number
  email: string
  trips: Launch[]
  token?: string
}

export interface Mission {
  name?: string
  missionPatchSmall?: string
  missionPatchLarge?: string
}
